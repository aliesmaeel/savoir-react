import { describe, expect, it } from "vitest";
import { CmsClient } from "../src/cms/client.js";
import { areaGuide, compareListings, missingPreferences, propertySuitability, recoverySearches, summarise, verifyAmenities, MAX_AMENITY_CHECKS } from "../src/cms/discovery.js";
import { mapPropertyDetails } from "../src/cms/mappers.js";
import { SavoirCms } from "../src/cms/service.js";
import { DEFAULT_IMAGE_HOSTS } from "../src/config.js";
import { silentLogger } from "../src/logger.js";
import type { PropertySummary } from "../src/schemas.js";
import { fakeFetch, json, LARAVEL_NULL_500, PROPERTY_SUGGESTIONS, propertyDetailResponse, searchItem, searchResponse, type RecordedCall, type Route } from "./fixtures.js";

const ctx = { publicSiteUrl: "https://savoirproperties.com", imageHosts: DEFAULT_IMAGE_HOSTS };

function setup(routes: Route[], max = 1000) {
  const { fetch, calls } = fakeFetch([(c) => (c.url.pathname === "/api/search-suggestions" ? json(PROPERTY_SUGGESTIONS) : undefined), ...routes]);
  const client = new CmsClient({ baseUrl: "https://cms.test", timeoutMs: 1000, maxRequestsPerMinute: max, logger: silentLogger, fetchImpl: fetch });
  return { cms: new SavoirCms(client, ctx), calls, searches: () => calls.filter((c) => c.url.pathname === "/api/search") };
}
const body = (c: RecordedCall) => c.body as Record<string, unknown>;

describe("missingPreferences", () => {
  it("asks for at most two things, most useful first", () => {
    expect(missingPreferences({}).map((m) => m.field)).toEqual(["purpose", "budget"]);
    expect(missingPreferences({ purpose: "rent", max_price: 100000 }).map((m) => m.field)).toEqual(["bedrooms", "area"]);
    expect(missingPreferences({ purpose: "buy", max_price: 1, bedrooms: 0, areas: ["Dubai Marina"] })).toEqual([]);
    expect(missingPreferences({ purpose: "rent" })[0]!.question).toMatch(/rental budget/);
  });
});

describe("recoverySearches", () => {
  const base = { areas: ["Dubai Marina"], purpose: "buy" as const, bedrooms: 3, max_price: 2_000_000, page: 1, page_size: 6 };
  // Exact search finds nothing; any relaxed search finds 4 listings.
  const relaxedHasResults: Route = (c) => {
    if (c.url.pathname !== "/api/search") return undefined;
    const b = body(c);
    const exact = JSON.stringify(b.query) === JSON.stringify(["Dubai Marina"]) && b.bedroom === 3 && b.max_price === 2_000_000;
    return json(exact ? searchResponse([], { total: 0 }) : searchResponse([searchItem()], { total: 4, limit: 3 }));
  };

  it("relaxes one requirement per probe, labels each, and caps probes at three", async () => {
    const { cms, searches } = setup([relaxedHasResults]);
    const r = await recoverySearches(cms, base, ["Dubai Marina"]);
    expect(r.skipped).toBeNull();
    expect(r.alternatives.map((a) => a.kind)).toEqual(["higher_budget", "nearby_areas", "any_bedrooms"]);
    const bodies = searches().map(body);
    expect(bodies[0]).toMatchObject({ max_price: null, bedroom: 3, query: ["Dubai Marina"] });
    expect(Object.fromEntries(searches()[0]!.url.searchParams)).toMatchObject({ sort_field: "price", sort_order: "asc" });
    expect((bodies[1]!.query as string[]).includes("Dubai Marina")).toBe(false);
    expect(bodies[1]!.query as string[]).toContain("Jumeirah Beach Residence");
    expect(bodies[2]).toMatchObject({ bedroom: null, max_price: 2_000_000 });
    expect(r.alternatives[0]!.description).toBe("Without the budget limit — prices start at AED 2,650,000");
    expect(r.alternatives[1]!.description).toMatch(/Nearby areas \(editorial suggestion\)/);
    expect(r.alternatives[0]!.search_args).toEqual({ bedrooms: 3, areas: ["Dubai Marina"], purpose: "buy", sort: "price_low_to_high" });
    expect(searches()).toHaveLength(3);
  });

  it("does not report alternatives that also have no results", async () => {
    const { cms } = setup([(c) => (c.url.pathname === "/api/search" ? json(searchResponse([], { total: 0 })) : undefined)]);
    const r = await recoverySearches(cms, base, ["Dubai Marina"]);
    expect(r.alternatives).toEqual([]);
  });

  it("skips probes when the shared CMS budget is low", async () => {
    const { cms, searches } = setup([relaxedHasResults], 4);
    const r = await recoverySearches(cms, base, ["Dubai Marina"]);
    expect(searches()).toHaveLength(0);
    expect(r.skipped).toMatch(/limited to protect the listings service/);
  });

  it("stops probing after a CMS error", async () => {
    const { cms, searches } = setup([(c) => (c.url.pathname === "/api/search" ? json({ message: "x" }, 500) : undefined)]);
    const r = await recoverySearches(cms, base, ["Dubai Marina"]);
    expect(r.alternatives).toEqual([]);
    expect(searches()).toHaveLength(1);
  });
});

describe("verifyAmenities", () => {
  const items: PropertySummary[] = Array.from({ length: 8 }, (_, i) => ({ ...mapPropertyDetails(propertyDetailResponse({ slug: `p${i}` }), ctx)!, slug: `p${i}` }));
  const detail: Route = (c) => {
    const m = c.url.pathname.match(/^\/api\/property\/(p\d)$/);
    if (!m) return undefined;
    const features = m[1] === "p3" ? ["Private pool", "View of water"] : m[1] === "p1" ? ["Private pool"] : ["Balcony"];
    return json(propertyDetailResponse({ slug: m[1], features }));
  };

  it(`checks at most ${MAX_AMENITY_CHECKS} listings, never drops any, and orders full matches first`, async () => {
    const { cms, calls } = setup([detail]);
    const r = await verifyAmenities(cms, items, ["private_pool", "water_view"]);
    expect(r.annotated).toHaveLength(8);
    expect(r.checked).toBe(MAX_AMENITY_CHECKS);
    expect(calls.filter((c) => c.url.pathname.startsWith("/api/property/"))).toHaveLength(MAX_AMENITY_CHECKS);
    expect(r.annotated[0]!.item.slug).toBe("p3");
    expect(r.annotated[0]!.amenity_check).toEqual({ checked: true, matched: ["private_pool", "water_view"], not_listed: [] });
    expect(r.annotated.slice(-2).every((a) => a.amenity_check === null)).toBe(true);
    expect(r.note).toMatch(/cannot search by amenity/);
  });
});

describe("areaGuide", () => {
  it("builds statistics from current listings and attaches editorial tags", async () => {
    const inv = [
      searchItem({ slug: "a", community: "Dubai Marina", offering_type: "RR", bedroom: "1", price: 120000 }),
      searchItem({ slug: "b", community: "Dubai Marina", offering_type: "RR", bedroom: "1", price: 150000 }),
      searchItem({ slug: "c", community: "Downtown Dubai", offering_type: "RR", bedroom: "1", price: 400000 }),
      searchItem({ slug: "d", community: "Jumeirah Village Circle", offering_type: "RS", bedroom: "1", price: 900000 }),
    ];
    const { cms } = setup([(c) => (c.url.pathname === "/api/search" ? json(searchResponse(inv, { total: 4, limit: 100, total_pages: 1 })) : undefined)]);
    const g = await areaGuide(cms, { purpose: "rent", budget_max_aed: 200000, bedrooms: 1 });
    expect(g.areas).toEqual([{ area: "Dubai Marina", matching_listings: 2, price_range_aed: { min: 120000, max: 150000 }, tags: ["Waterfront / marina"], nearby: expect.arrayContaining(["Jumeirah Beach Residence"]) }]);
    expect(g.editorial_status).toMatch(/pending Savoir review/);
    const beach = await areaGuide(cms, { tags: ["beachfront"] });
    expect(beach.areas).toEqual([]);
  });
});

describe("suitability", () => {
  const d = mapPropertyDetails(propertyDetailResponse({ features: ["Balcony"] }), ctx)!; // sale, 2 bed, Dubai Marina, AED 2.65M, ready

  it("explains each stated requirement with verified data", () => {
    const s = propertySuitability(d, { purpose: "buy", budget_max_aed: 2_500_000, bedrooms: 2, areas: ["dubai marina"], must_have: ["balcony", "private_pool"] });
    expect(s.checks.map((c) => [c.requirement, c.fit])).toEqual([
      ["For sale", "meets"],
      ["Budget up to AED 2,500,000", "does_not_meet"],
      ["2 bedrooms", "meets"],
      ["Area: dubai marina", "meets"],
      ["Balcony", "meets"],
      ["Private pool", "unknown"],
    ]);
    expect(s.checks[1]!.detail).toBe("AED 2,650,000 (6% over)");
    expect(s.summary).toBe("partly_fits");
  });

  it("summarises without counting unknowns as fits or misses", () => {
    expect(summarise([])).toBe("no_requirements");
    expect(summarise([{ requirement: "a", fit: "meets", detail: "" }])).toBe("fits_all_stated");
    expect(summarise([{ requirement: "a", fit: "meets", detail: "" }, { requirement: "b", fit: "unknown", detail: "" }])).toBe("some_unknown");
    expect(summarise([{ requirement: "a", fit: "does_not_meet", detail: "" }])).toBe("does_not_fit");
    expect(summarise([{ requirement: "For sale", fit: "does_not_meet", detail: "", hard: true }, { requirement: "b", fit: "meets", detail: "" }])).toBe("does_not_fit");
  });

  it("marks listings that disappeared as unavailable in a comparison", async () => {
    const { cms } = setup([
      (c) => (c.url.pathname === "/api/property/gone-1" ? json(LARAVEL_NULL_500, 500) : undefined),
      (c) => (c.url.pathname.startsWith("/api/property/") ? json(propertyDetailResponse()) : undefined),
    ]);
    const r = await compareListings(cms, [{ kind: "property", slug: "unfurnished-vacant-skyline-view-2974-25427458" }, { kind: "property", slug: "gone-1" }], { bedrooms: 2 });
    expect(r.items.map((i) => i.available)).toEqual([true, false]);
    expect(r.items[0]!.suitability!.summary).toBe("fits_all_stated");
  });
});
