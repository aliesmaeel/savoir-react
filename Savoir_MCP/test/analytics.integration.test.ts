/**
 * Milestone 2 end-to-end: tool calls produce aggregate metrics only; click links are counted
 * (bots excluded); the staff dashboard requires authentication; nothing personal is stored.
 */
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import type { Server } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";
import { createHttpApp } from "../src/http.js";
import { hashPassword } from "../src/insights.js";
import { createLogger } from "../src/logger.js";
import { createAppContext } from "../src/server.js";
import { defaultRoutes, fakeFetch, json, searchResponse, type Route } from "./fixtures.js";

type R = { structuredContent?: Record<string, any> };
const open: Array<() => Promise<void>> = [];
afterEach(async () => {
  while (open.length) await open.pop()!();
});

const STAFF_HASH = hashPassword("staff-password-123");

async function start(env: Record<string, string> = {}, routes: Route[] = []) {
  const { fetch } = fakeFetch([...routes, ...defaultRoutes]);
  const logs: string[] = [];
  const config = { ...loadConfig({ CMS_BASE_URL: "https://cms.test", ANALYTICS_LINK_SECRET: "s".repeat(32), ...env }), dataDir: null };
  const ctx = createAppContext(config, createLogger("debug", (l) => logs.push(l)), fetch);
  const { app, close } = createHttpApp(ctx);
  const server: Server = await new Promise((r) => {
    const s = app.listen(0, "127.0.0.1", () => r(s));
  });
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  const client = new Client({ name: "analytics-test", version: "1.0.0" });
  await client.connect(new StreamableHTTPClientTransport(new URL(`${base}/mcp`)));
  open.push(async () => {
    await client.close();
    await close();
    await new Promise((r) => server.close(r));
  });
  const call = (name: string, args: Record<string, unknown> = {}) => client.callTool({ name, arguments: args }) as Promise<R>;
  return { call, client, ctx, base, logs };
}

describe("business metrics", () => {
  it("records the journey as daily aggregates with no personal data", async () => {
    const { call, ctx } = await start();
    await call("search_properties", { areas: ["Dubai Marina"], purpose: "buy", max_price_aed: 2_800_000 });
    await call("get_property_details", { slug: "unfurnished-vacant-skyline-view-2974-25427458" });
    const sl = (await call("update_shortlist", { add: [{ kind: "property", slug: "unfurnished-vacant-skyline-view-2974-25427458" }] })).structuredContent!.shortlist;
    const h = (
      await call("prepare_inquiry", {
        listings: [{ kind: "property", slug: "unfurnished-vacant-skyline-view-2974-25427458" }],
        requirements: { purpose: "buy", notes: "Call me on +971 50 123 4567, jane@example.com" },
        viewing_preference: "Friday 5pm with my wife",
        campaign_code: "spring26",
      })
    ).structuredContent!.handoff;

    const snap = ctx.aggregates!.snapshot();
    const day = Object.values(snap.days)[0]!;
    expect(day.events.search).toEqual({ "alternatives=0|bedrooms=any|budget_band=sale_2-3M|completion=any|must_have=false|outcome=ok|purpose=buy|type=any": 1 });
    expect(day.events.search_area).toEqual({ "area=Dubai Marina|outcome=ok": 1 });
    expect(Object.keys(day.events.handoff_prepared!)[0]).toContain("campaign=spring26");
    expect(day.listings["property:unfurnished-vacant-skyline-view-2974-25427458"]).toMatchObject({ detail_view: 1, shortlist_add: 1, handoff_listing: 1 });

    const stored = JSON.stringify(snap);
    for (const secret of ["jane@example.com", "123 4567", "my wife", "Friday", sl.shortlist_id, h.reference_code]) expect(stored).not.toContain(secret);
  });

  it("counts card and handoff clicks via signed redirects, excluding bots and rejecting tampered links", async () => {
    const { call, ctx, base, logs } = await start();
    const s = await call("search_properties", { purpose: "buy" });
    const link = s.structuredContent!.items[0].links.whatsapp as string;
    const path = new URL(link).pathname;
    const r1 = await fetch(`${base}${path}`, { redirect: "manual", headers: { "user-agent": "Mozilla/5.0 (iPhone) Safari" } });
    expect(r1.status).toBe(302);
    expect(r1.headers.get("location")).toMatch(/^https:\/\/wa\.me\/971505074686\?text=/);
    await fetch(`${base}${path}`, { redirect: "manual", headers: { "user-agent": "WhatsApp/2.23" } }); // link preview: not counted
    expect((await fetch(`${base}${path.slice(0, -3)}AAA`, { redirect: "manual" })).status).toBe(404);
    const day = Object.values(ctx.aggregates!.snapshot().days)[0]!;
    expect(day.events.link_click).toEqual({ "channel=whatsapp_company|kind=property|source=card": 1 });
    expect(logs.join("\n")).not.toContain(path.split("/go/")[1]!.slice(0, 20));
    expect(logs.join("\n")).toContain('"path":"/go/:token"');
  });

  it("uses plain links when analytics are off, and exposes no analytics through MCP tools", async () => {
    const off = await start({ ANALYTICS: "off" });
    const s = await off.call("search_properties", { purpose: "buy" });
    expect(s.structuredContent!.items[0].links.website).toBe("https://savoirproperties.com/project/unfurnished-vacant-skyline-view-2974-25427458");
    expect(off.ctx.aggregates).toBeNull();
    const tools = (await off.client.listTools()).tools.map((t) => t.name).join(" ");
    expect(tools).not.toMatch(/analytic|insight|metric|report/i);
  });
});

describe("staff dashboard", () => {
  it("is not available unless credentials are configured", async () => {
    const { base } = await start();
    expect((await fetch(`${base}/internal/insights`)).status).toBe(404);
  });

  it("requires valid credentials, throttles guessing, and serves the report", async () => {
    const { base, call } = await start({ INSIGHTS_USER: "savoir", INSIGHTS_PASSWORD_HASH: STAFF_HASH }, [
      (c) => (c.url.pathname === "/api/search" ? json(searchResponse([], { total: 0 })) : undefined),
    ]);
    await call("search_properties", { purpose: "rent", max_price_aed: 50_000 });
    const auth = (u: string, p: string) => ({ authorization: `Basic ${Buffer.from(`${u}:${p}`).toString("base64")}` });
    const none = await fetch(`${base}/internal/insights`);
    expect(none.status).toBe(401);
    expect(none.headers.get("www-authenticate")).toMatch(/^Basic/);
    const ok = await fetch(`${base}/internal/insights?days=7`, { headers: auth("savoir", "staff-password-123") });
    expect(ok.status).toBe(200);
    expect(ok.headers.get("cache-control")).toBe("no-store");
    const html = await ok.text();
    expect(html).toContain("Savoir Properties app — business insights");
    expect(html).toContain("rent_&lt;80k");
    for (let i = 0; i < 5; i++) expect((await fetch(`${base}/internal/insights`, { headers: auth("savoir", "nope") })).status).toBe(401);
    expect((await fetch(`${base}/internal/insights`, { headers: auth("savoir", "staff-password-123") })).status).toBe(429);
  });
});
