/**
 * End-to-end customer journey over Streamable HTTP with a recording fake CMS:
 * guided search → recovery → details → compare → shortlist (+ share page) → contact handoff.
 */
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import type { Server } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";
import { createHttpApp } from "../src/http.js";
import { createLogger } from "../src/logger.js";
import { createAppContext } from "../src/server.js";
import { defaultRoutes, fakeFetch, json, LARAVEL_NULL_500, offplanDetailResponse, offplanItem, offplanSearchResponse, propertyDetailResponse, searchItem, searchResponse, type Route } from "./fixtures.js";

type R = { content: Array<{ type: string; text?: string }>; structuredContent?: Record<string, any>; isError?: boolean };

const open: Array<() => Promise<void>> = [];
afterEach(async () => {
  while (open.length) await open.pop()!();
});

const TRICKY_TITLE = `Sea & Sky "Loft" <3 'view'`;

const journeyRoutes: Route[] = [
  // property details by slug
  (c) => {
    const m = c.url.pathname.match(/^\/api\/property\/(.+)$/);
    if (!m) return undefined;
    const slug = decodeURIComponent(m[1]!);
    if (slug === "gone-1") return json(LARAVEL_NULL_500, 500);
    if (slug === "pool-1") return json(propertyDetailResponse({ slug, title_en: "Pool Villa", features: ["Private pool", "View of water"], size: 2000, price: 4_000_000 }));
    if (slug === "tricky-1") return json(propertyDetailResponse({ slug, title_en: TRICKY_TITLE }));
    if (slug === "rent-1") return json(propertyDetailResponse({ slug, title_en: "Rental Flat", offering_type: "RR", price: 150_000, size: 900 }));
    return json(propertyDetailResponse({ slug }));
  },
  // property search: Atlantis-free; "studio + Palm + 50k" has no exact match, relaxed has
  (c) => {
    if (c.url.pathname !== "/api/search") return undefined;
    const b = c.body as Record<string, unknown>;
    if (b.max_price === 50_000 && b.bedroom === 0) return json(searchResponse([], { total: 0 }));
    if (b.bedroom === 0) return json(searchResponse([searchItem({ slug: "studio-1", bedroom: "0" })], { total: 1 }));
    return json(searchResponse([searchItem({ slug: "pool-1", title_en: "Pool Villa" }), searchItem({ slug: "plain-1", title_en: "Plain Flat" })], { total: 2 }));
  },
  // off-plan: three projects, one "Call Us"
  (c) =>
    c.url.pathname === "/api/search-offplan"
      ? json(
          offplanSearchResponse([
            offplanItem({ id: 1, slug: "cheap", title: "Cheap Tower", starting_price: "AED 700K" }),
            offplanItem({ id: 2, slug: "dear", title: "Dear Tower", starting_price: "AED 9.32 M" }),
            offplanItem({ id: 3, slug: "callus", title: "Mystery Tower", starting_price: "Call Us" }),
          ]),
        )
      : undefined,
  ...defaultRoutes,
];

async function start(dataDir: string | null = null) {
  const { fetch, calls } = fakeFetch(journeyRoutes);
  const logs: string[] = [];
  const config = { ...loadConfig({ CMS_BASE_URL: "https://cms.test", PUBLIC_MCP_URL: "https://mcp.savoirproperties.com" }), dataDir };
  const ctx = createAppContext(config, createLogger("debug", (l) => logs.push(l)), fetch);
  const { app, close } = createHttpApp(ctx);
  const server: Server = await new Promise((r) => {
    const s = app.listen(0, "127.0.0.1", () => r(s));
  });
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  const client = new Client({ name: "journey-test", version: "1.0.0" });
  await client.connect(new StreamableHTTPClientTransport(new URL(`${base}/mcp`)));
  open.push(async () => {
    await client.close();
    await close();
    await new Promise((r) => server.close(r));
  });
  const call = (name: string, args: Record<string, unknown> = {}) => client.callTool({ name, arguments: args }) as Promise<R>;
  const textOf = (r: R) => r.content.map((c) => c.text ?? "").join("\n");
  return { call, textOf, calls, logs, base, ctx };
}

describe("guided search", () => {
  it("verifies requested amenities per listing, orders matches first and says amenities are not a filter", async () => {
    const { call, textOf } = await start();
    const r = await call("search_properties", { purpose: "buy", must_have: ["private_pool"] });
    const items = r.structuredContent!.items;
    expect(items[0]).toMatchObject({ slug: "pool-1", amenity_check: { matched: ["private_pool"], not_listed: [] } });
    expect(items[1]).toMatchObject({ slug: "plain-1", amenity_check: { matched: [], not_listed: ["private_pool"] } });
    expect(r.structuredContent!.amenity_note).toMatch(/cannot search by amenity/);
    expect(textOf(r)).toContain("Pool Villa: has private_pool");
    expect(r.structuredContent!.data_as_of).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("returns the two most useful missing preferences when the customer is vague", async () => {
    const { call, textOf } = await start();
    const r = await call("search_properties", {});
    expect(r.structuredContent!.missing_preferences.map((m: any) => m.field)).toEqual(["purpose", "budget"]);
    expect(textOf(r)).toMatch(/ask the customer \(at most these two\)/);
  });

  it("offers clearly labelled alternatives when nothing matches", async () => {
    const { call, textOf } = await start();
    const r = await call("search_properties", { areas: ["Palm Jumeirah"], purpose: "rent", bedrooms: "studio", max_price_aed: 50_000 });
    expect(r.structuredContent!.status).toBe("no_results");
    expect(r.isError).toBeFalsy();
    const alts = r.structuredContent!.alternatives;
    expect(alts.length).toBeGreaterThan(0);
    expect(alts[0]).toMatchObject({ kind: "higher_budget", total_results: 1, search_args: { bedrooms: "studio", areas: ["Palm Jumeirah"], sort: "price_low_to_high" } });
    expect(alts[0].search_args.max_price_aed).toBeUndefined();
    expect(alts[0].description).toMatch(/^Without the budget limit — prices start at AED /);
    expect(textOf(r)).toContain("ALTERNATIVES — these do NOT match every requirement");
  });

  it("suggests areas from live inventory for customers who don't know Dubai", async () => {
    const { call } = await start();
    const r = await call("get_area_guide", { purpose: "buy" });
    expect(r.structuredContent!.view).toBe("area_guide");
    expect(r.structuredContent!.guide.areas[0]).toMatchObject({ area: "Dubai Marina", tags: ["Waterfront / marina"] });
  });
});

describe("off-plan decision support", () => {
  it("matches budget on 'starting from' prices and says which projects publish no price", async () => {
    const { call, textOf } = await start();
    const r = await call("search_offplan_projects", { max_starting_price_aed: 1_000_000 });
    expect(r.structuredContent!.items.map((i: any) => i.slug)).toEqual(["cheap"]);
    expect(textOf(r)).toMatch(/cheapest unit/);
    expect(textOf(r)).toMatch(/1 matching project\(s\) publish no starting price/);
  });

  it("calculates a schedule only from a customer-provided unit price", async () => {
    const { call, textOf } = await start();
    const none = await call("get_offplan_project_details", { slug: "the-archive-by-imtiaz" });
    expect(none.structuredContent!.payment_schedule).toBeNull();
    const r = await call("get_offplan_project_details", { slug: "the-archive-by-imtiaz", unit_price_aed: 1_200_000 });
    expect(r.structuredContent!.payment_schedule.stages.map((s: any) => s.amount_aed)).toEqual([240_000, 420_000, 540_000]);
    expect(textOf(r)).toMatch(/Excludes Dubai Land Department fees/);
    expect(textOf(r)).not.toMatch(/ROI|return on investment|guaranteed/i);
  });
});

describe("compare", () => {
  it("compares listings with price per sq ft only for sale listings and per-listing suitability", async () => {
    const { call, textOf } = await start();
    const r = await call("compare_listings", {
      items: [
        { kind: "property", slug: "pool-1" },
        { kind: "property", slug: "rent-1" },
        { kind: "property", slug: "gone-1" },
      ],
      requirements: { purpose: "buy", budget_max_aed: 3_000_000 },
    });
    const items = r.structuredContent!.items;
    expect(items[0].property.price_per_sqft_aed).toBe(2000);
    expect(items[1].property.price_per_sqft_aed).toBeNull();
    expect(items[2]).toMatchObject({ available: false, property: null });
    expect(items[0].suitability.summary).toBe("partly_fits"); // for sale, but over budget
    expect(items[1].suitability.summary).toBe("does_not_fit"); // a rental can never fit a buyer, even within budget
    expect(textOf(r)).toContain("no longer available or not found");
  });
});

describe("shortlist and share page", () => {
  it("saves server-verified listings, marks them in later searches, shares a read-only page and deletes cleanly", async () => {
    const { call, base, logs, textOf } = await start();
    const created = await call("update_shortlist", { add: [{ kind: "property", slug: "tricky-1" }, { kind: "property", slug: "gone-1" }] });
    const sl = created.structuredContent!.shortlist;
    expect(sl.shortlist_id).toMatch(/^[A-Za-z0-9_-]{22}$/);
    expect(sl.items.map((i: any) => i.title)).toEqual([TRICKY_TITLE]); // title captured from the CMS, not the client
    expect(created.structuredContent!.rejected).toEqual(["gone-1"]);
    expect(textOf(created)).toMatch(/30 days after its last change/);

    await call("update_shortlist", { shortlist_id: sl.shortlist_id, add: [{ kind: "property", slug: "pool-1" }] });
    const s = await call("search_properties", { purpose: "buy", shortlist_id: sl.shortlist_id });
    expect(s.structuredContent!.items.find((i: any) => i.slug === "pool-1").saved).toBe(true);
    expect(s.structuredContent!.items.find((i: any) => i.slug === "plain-1").saved).toBe(false);

    const shared = await call("share_shortlist", { shortlist_id: sl.shortlist_id });
    const url = new URL(shared.structuredContent!.shortlist.share_url);
    expect(url.origin).toBe("https://mcp.savoirproperties.com");
    const token = url.pathname.split("/").pop()!;
    expect(token).not.toBe(sl.shortlist_id);

    const page = await fetch(`${base}/s/${token}`);
    const html = await page.text();
    expect(page.status).toBe(200);
    expect(page.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(page.headers.get("cache-control")).toBe("no-store");
    expect(page.headers.get("content-security-policy")).toMatch(/default-src 'none'/);
    expect(html).toContain("Sea &amp; Sky &quot;Loft&quot; &lt;3 &#39;view&#39;");
    expect(html).not.toContain(TRICKY_TITLE);
    expect(html).not.toContain("utm_"); // attribution tags are opt-in (ATTRIBUTION_UTM=on)
    // Agent contact details from the listing are not published on the share page.
    expect(html).not.toContain("Luiza@savoirproperties.com");
    expect(html).not.toContain("509254548");

    await call("share_shortlist", { shortlist_id: sl.shortlist_id, action: "stop_sharing" });
    expect((await fetch(`${base}/s/${token}`)).status).toBe(404);

    const del = await call("delete_shortlist", { shortlist_id: sl.shortlist_id });
    expect(del.structuredContent).toMatchObject({ status: "ok", deleted: true });
    expect((await call("get_shortlist", { shortlist_id: sl.shortlist_id })).structuredContent!.status).toBe("not_found");

    const all = logs.join("\n");
    expect(all).not.toContain(token);
    expect(all).not.toContain(sl.shortlist_id);
    expect(all).toContain('"path":"/s/:token"');
  });

  it("reports exactly what each update changed, so the card confirms only real saves", async () => {
    const { call } = await start();
    const created = await call("update_shortlist", { add: [{ kind: "property", slug: "tricky-1" }, { kind: "property", slug: "gone-1" }] });
    const id = created.structuredContent!.shortlist.shortlist_id;
    expect(created.structuredContent!.change).toEqual({ created: true, added: ["tricky-1"], removed: [] });

    const again = await call("update_shortlist", { shortlist_id: id, add: [{ kind: "property", slug: "pool-1" }], remove: [{ kind: "property", slug: "tricky-1" }] });
    expect(again.structuredContent!.change).toEqual({ created: false, added: ["pool-1"], removed: ["tricky-1"] });
    expect(again.structuredContent!.shortlist.items.map((i: any) => i.slug)).toEqual(["pool-1"]);

    // Unknown or expired shortlist: nothing is reported as saved.
    const expired = await call("update_shortlist", { shortlist_id: "A".repeat(22), add: [{ kind: "property", slug: "pool-1" }] });
    expect(expired.structuredContent!.status).toBe("not_found");
    expect(expired.structuredContent!.change).toBeUndefined();
  });

  it("survives a restart when a data directory is configured", async () => {
    const { mkdtempSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const dir = mkdtempSync(join(tmpdir(), "slj-"));
    const first = await start(dir);
    const id = (await first.call("update_shortlist", { add: [{ kind: "property", slug: "pool-1" }] })).structuredContent!.shortlist.shortlist_id;
    first.ctx.shortlists.flush();
    const second = await start(dir);
    expect((await second.call("get_shortlist", { shortlist_id: id })).structuredContent!.shortlist.items[0].slug).toBe("pool-1");
  });
});

describe("contact handoff", () => {
  it("re-verifies listings live, drops unavailable ones, and prepares an attributed message with no personal data", async () => {
    const { call, calls, textOf, base } = await start();
    await call("get_property_details", { slug: "pool-1" }); // cached now
    const before = calls.filter((c) => c.url.pathname === "/api/property/pool-1").length;
    const r = await call("prepare_inquiry", {
      listings: [{ kind: "property", slug: "pool-1" }, { kind: "property", slug: "gone-1" }, { kind: "offplan", slug: "the-archive-by-imtiaz" }],
      requirements: { purpose: "buy", budget_max_aed: 4_500_000, bedrooms: 2 },
      viewing_preference: "Saturday morning",
      campaign_code: "spring26",
    });
    expect(calls.filter((c) => c.url.pathname === "/api/property/pool-1").length).toBe(before + 1); // fresh, not cached
    const h = r.structuredContent!.handoff;
    expect(h.reference_code).toMatch(/^SAV-[2-9A-HJKMNP-Z]{6}$/);
    expect(h.listings.map((l: any) => l.slug)).toEqual(["pool-1", "the-archive-by-imtiaz"]);
    expect(h.unavailable).toEqual([{ kind: "property", slug: "gone-1" }]);
    expect(h.message).toContain("Preferred viewing time: Saturday morning (a request — please confirm availability)");
    expect(h.message).toContain(`${h.reference_code} · Campaign: spring26`);
    expect(h.message).not.toContain("utm_");
    expect(h.message).toContain(h.reference_code);
    expect(h.live_submission_available).toBe(false);
    expect(Object.keys(h)).not.toEqual(expect.arrayContaining(["name"]));
    expect(textOf(r)).toMatch(/This is not a booking/);
    expect(textOf(r)).not.toMatch(/viewing (is|has been) (booked|confirmed)/i);
    // The WhatsApp button is a signed click link that redirects to WhatsApp with exactly this message.
    const go = new URL(h.channels.whatsapp_company);
    expect(go.pathname).toMatch(/^\/go\//);
    const redirect = await fetch(`${base}${go.pathname}`, { redirect: "manual" });
    expect(redirect.status).toBe(302);
    const target = redirect.headers.get("location")!;
    expect(target.startsWith("https://wa.me/971505074686?text=")).toBe(true);
    expect(decodeURIComponent(target.split("text=")[1]!)).toBe(h.message);
  });

  it("writes the message in Arabic when asked", async () => {
    const { call } = await start();
    const r = await call("prepare_inquiry", { listings: [{ kind: "property", slug: "pool-1" }], language: "ar" });
    expect(r.structuredContent!.handoff.message).toContain("أرغب في الاستفسار عن هذا العقار");
  });

  it("still offers WhatsApp when the CMS cannot re-verify", async () => {
    const { fetch } = fakeFetch([(c) => (c.url.pathname.startsWith("/api/property/") ? json({ message: "down" }, 503) : undefined), ...defaultRoutes]);
    const config = { ...loadConfig({ CMS_BASE_URL: "https://cms.test" }), dataDir: null };
    const ctx = createAppContext(config, createLogger("error", () => {}), fetch);
    const { app, close } = createHttpApp(ctx);
    const server: Server = await new Promise((r) => {
      const s = app.listen(0, "127.0.0.1", () => r(s));
    });
    const client = new Client({ name: "t", version: "1" });
    await client.connect(new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${(server.address() as { port: number }).port}/mcp`)));
    open.push(async () => {
      await client.close();
      await close();
      await new Promise((r) => server.close(r));
    });
    const r = (await client.callTool({ name: "prepare_inquiry", arguments: { listings: [{ kind: "property", slug: "pool-1" }] } })) as R;
    expect(r.isError).toBe(true);
    expect(r.content[0]!.text).toContain("https://wa.me/971505074686");
  });
});
