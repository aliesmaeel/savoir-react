import { describe, expect, it } from "vitest";
import { CmsClient, CmsError, endpointLabel } from "../src/cms/client.js";
import { createLogger, silentLogger } from "../src/logger.js";
import { LARAVEL_NULL_500, json } from "./fixtures.js";

function client(fetchImpl: (url: string, init?: RequestInit) => Promise<Response>, opts: Partial<{ timeoutMs: number; max: number; now: () => number }> = {}) {
  return new CmsClient({
    baseUrl: "https://cms.test",
    timeoutMs: opts.timeoutMs ?? 1000,
    maxRequestsPerMinute: opts.max ?? 100,
    logger: silentLogger,
    fetchImpl,
    now: opts.now,
  });
}

describe("CMS error classification", () => {
  it("maps 429 to cms_rate_limited", async () => {
    await expect(client(async () => json({ message: "Too Many Attempts." }, 429)).get("/api/x")).rejects.toMatchObject({ code: "cms_rate_limited", status: 429 });
  });

  it("maps the Laravel 'on null' 500 to not found only when asked, and never exposes the debug payload", async () => {
    const c = client(async () => json(LARAVEL_NULL_500, 500));
    const asNotFound = await c.get("/api/property/x", { notFoundOnMissingRecord: true }).catch((e: CmsError) => e);
    expect(asNotFound).toMatchObject({ code: "cms_not_found" });
    const generic = await c.get("/api/search").catch((e: CmsError) => e);
    expect(generic).toMatchObject({ code: "cms_error", status: 500 });
    for (const e of [asNotFound, generic] as CmsError[]) {
      expect(`${e.message} ${e.publicMessage}`).not.toMatch(/HomeController|htdocs|trace|ErrorException/);
    }
  });

  it("maps timeouts and network failures", async () => {
    const slow = client(
      (_u, init) =>
        new Promise((_r, reject) => {
          init?.signal?.addEventListener("abort", () => reject(Object.assign(new Error("timeout"), { name: "TimeoutError" })));
        }),
      { timeoutMs: 1000 },
    );
    await expect(slow.get("/api/x")).rejects.toMatchObject({ code: "cms_timeout" });
    await expect(client(async () => Promise.reject(new TypeError("fetch failed"))).get("/api/x")).rejects.toMatchObject({ code: "cms_unreachable" });
  });

  it("rejects non-JSON success bodies, except for writes that opt in", async () => {
    const html = async () => new Response("<html>ok</html>", { status: 200, headers: { "Content-Type": "text/html" } });
    await expect(client(html).get("/api/x")).rejects.toMatchObject({ code: "cms_invalid_response" });
    await expect(client(html).post("/api/contact-us", {}, { acceptNonJsonSuccess: true })).resolves.toEqual({});
  });

  it("surfaces 422 field messages without the rest of the body", async () => {
    const e = (await client(async () => json({ message: "x", errors: { email: ["The email field is required."] }, trace: ["secret"] }, 422))
      .post("/api/contact-us", {})
      .catch((err) => err)) as CmsError;
    expect(e.code).toBe("cms_rejected");
    expect(e.fieldErrors).toEqual({ email: ["The email field is required."] });
  });
});

describe("request budget and cache", () => {
  it("stops calling the CMS once the per-minute budget is spent, then recovers", async () => {
    let t = 0;
    let calls = 0;
    const c = client(async () => {
      calls++;
      return json({ ok: true });
    }, { max: 2, now: () => t });
    await c.get("/a");
    await c.get("/b");
    await expect(c.get("/c")).rejects.toMatchObject({ code: "local_rate_limited" });
    expect(calls).toBe(2);
    t += 61_000;
    await expect(c.get("/c")).resolves.toEqual({ ok: true });
  });

  it("serves cached responses within the TTL", async () => {
    let calls = 0;
    const c = client(async () => {
      calls++;
      return json({ n: calls });
    });
    expect(await c.get("/s", { cacheTtlMs: 10_000 })).toEqual({ n: 1 });
    expect(await c.get("/s", { cacheTtlMs: 10_000 })).toEqual({ n: 1 });
    expect(calls).toBe(1);
  });

  it("sends JSON with an Accept header and a timeout signal", async () => {
    let seen: RequestInit | undefined;
    await client(async (_u, init) => {
      seen = init;
      return json({});
    }).post("/api/search?page=1", { a: 1 });
    expect(seen?.headers).toMatchObject({ Accept: "application/json", "Content-Type": "application/json" });
    expect(seen?.signal).toBeInstanceOf(AbortSignal);
    expect(seen?.body).toBe('{"a":1}');
  });
});

describe("logging", () => {
  it("labels endpoints without slugs or query strings", () => {
    expect(endpointLabel("/api/property/some-slug-123?x=1")).toBe("/api/property/:slug");
    expect(endpointLabel("/api/search?page=1&limit=6")).toBe("/api/search");
  });

  it("redacts personal data keys and masks emails/phones in free text", () => {
    const lines: string[] = [];
    const log = createLogger("debug", (l) => lines.push(l));
    log.info("x", { name: "Jane", email: "jane@example.com", note: "call +971 50 123 4567 or jane@example.com", host: "127.0.0.1" });
    const out = JSON.parse(lines[0]!);
    expect(out.name).toBe("[redacted]");
    expect(out.email).toBe("[redacted]");
    expect(out.note).toBe("call [phone] or [email]");
    expect(out.host).toBe("127.0.0.1");
  });
});
