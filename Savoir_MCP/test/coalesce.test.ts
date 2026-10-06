import { describe, expect, it } from "vitest";
import { CmsClient } from "../src/cms/client.js";
import { silentLogger } from "../src/logger.js";
import { json } from "./fixtures.js";

function slowClient() {
  let calls = 0;
  let t = 1_000_000;
  const release: Array<() => void> = [];
  const client = new CmsClient({
    baseUrl: "https://cms.test",
    timeoutMs: 5000,
    maxRequestsPerMinute: 100,
    logger: silentLogger,
    now: () => t,
    fetchImpl: () => {
      calls++;
      return new Promise((resolve) => release.push(() => resolve(json({ n: calls }))));
    },
  });
  return { client, calls: () => calls, flush: () => release.splice(0).forEach((r) => r()), advance: (ms: number) => (t += ms) };
}

describe("CMS request coalescing and data age", () => {
  it("shares one CMS call between identical concurrent reads", async () => {
    const s = slowClient();
    const a = s.client.getMeta("/api/x", { cacheTtlMs: 60_000 });
    const b = s.client.getMeta("/api/x", { cacheTtlMs: 60_000 });
    s.flush();
    const [ra, rb] = await Promise.all([a, b]);
    expect(s.calls()).toBe(1);
    expect(ra).toEqual(rb);
  });

  it("reports when cached data was actually fetched", async () => {
    const s = slowClient();
    const first = s.client.getMeta("/api/x", { cacheTtlMs: 60_000 });
    s.flush();
    const r1 = await first;
    s.advance(30_000);
    const r2 = await s.client.getMeta("/api/x", { cacheTtlMs: 60_000 });
    expect(r2.fetchedAt).toBe(r1.fetchedAt);
    expect(s.calls()).toBe(1);
  });

  it("fresh=true bypasses the cache (used to re-verify before a contact handoff)", async () => {
    const s = slowClient();
    const first = s.client.getMeta("/api/x", { cacheTtlMs: 60_000 });
    s.flush();
    await first;
    s.advance(5_000);
    const second = s.client.getMeta("/api/x", { cacheTtlMs: 60_000, fresh: true });
    s.flush();
    const r = await second;
    expect(s.calls()).toBe(2);
    expect(r.data).toEqual({ n: 2 });
  });

  it("never coalesces writes", async () => {
    const s = slowClient();
    const a = s.client.post("/api/contact-us", { a: 1 }, { acceptNonJsonSuccess: true });
    const b = s.client.post("/api/contact-us", { a: 1 }, { acceptNonJsonSuccess: true });
    await Promise.resolve();
    s.flush();
    await Promise.all([a, b]);
    expect(s.calls()).toBe(2);
  });

  it("exposes the remaining request budget", async () => {
    const s = slowClient();
    expect(s.client.budgetRemaining()).toBe(100);
    const p = s.client.get("/api/y");
    s.flush();
    await p;
    expect(s.client.budgetRemaining()).toBe(99);
  });
});
