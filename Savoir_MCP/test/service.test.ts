import { describe, expect, it } from "vitest";
import { CmsClient, CmsError } from "../src/cms/client.js";
import { resolveAreas, resolveDevelopers, resolveHandover, SavoirCms } from "../src/cms/service.js";
import { DEFAULT_IMAGE_HOSTS } from "../src/config.js";
import { silentLogger } from "../src/logger.js";
import {
  defaultRoutes,
  fakeFetch,
  json,
  OFFPLAN_SUGGESTIONS,
  offplanItem,
  offplanSearchResponse,
  PROPERTY_SUGGESTIONS,
  searchItem,
  searchResponse,
  type Route,
} from "./fixtures.js";

function setup(routes: Route[] = []) {
  const { fetch, calls } = fakeFetch([...routes, ...defaultRoutes]);
  const client = new CmsClient({ baseUrl: "https://cms.test", timeoutMs: 1000, maxRequestsPerMinute: 1000, logger: silentLogger, fetchImpl: fetch });
  const cms = new SavoirCms(client, { publicSiteUrl: "https://savoirproperties.com", imageHosts: DEFAULT_IMAGE_HOSTS });
  const searchCalls = () => calls.filter((c) => c.url.pathname === "/api/search");
  const offplanCalls = () => calls.filter((c) => c.url.pathname === "/api/search-offplan");
  return { cms, calls, searchCalls, offplanCalls };
}

const KNOWN = Object.keys(PROPERTY_SUGGESTIONS);

describe("search_properties request body", () => {
  it("sends studio as numeric bedroom 0 (the CMS ignores non-numeric values)", async () => {
    const { cms, searchCalls } = setup();
    await cms.searchProperties({ bedrooms: 0, page: 1, page_size: 6 });
    expect(searchCalls()[0]!.body).toMatchObject({ bedroom: 0 });
    expect(typeof (searchCalls()[0]!.body as { bedroom: unknown }).bedroom).toBe("number");
  });

  it("maps purpose, completion, type, bathrooms and prices to the website's CMS values", async () => {
    const { cms, searchCalls } = setup();
    await cms.searchProperties({
      purpose: "rent",
      completion: "off_plan",
      property_type: "office",
      bedrooms: 3,
      bathrooms: 2,
      min_price: 100000,
      max_price: 250000,
      page: 2,
      page_size: 4,
      sort: "price_high_to_low",
    });
    const call = searchCalls()[0]!;
    expect(call.method).toBe("POST");
    expect(call.body).toEqual({
      query: [],
      offering_type: "RR",
      completion_status: "off_plan",
      type: "Office-space",
      bedroom: 3,
      bathroom: 2,
      min_price: 100000,
      max_price: 250000,
    });
    expect(Object.fromEntries(call.url.searchParams)).toEqual({ page: "2", limit: "4", sort_field: "price", sort_order: "desc" });
  });

  it("uses buy → RS, ready → completed, nulls for unset filters and newest-first by default", async () => {
    const { cms, searchCalls } = setup();
    const out = await cms.searchProperties({ purpose: "buy", completion: "ready", page: 1, page_size: 6 });
    expect(searchCalls()[0]!.body).toEqual({
      query: [],
      offering_type: "RS",
      completion_status: "completed",
      type: null,
      bedroom: null,
      bathroom: null,
      min_price: null,
      max_price: null,
    });
    expect(searchCalls()[0]!.url.searchParams.get("sort_field")).toBe("updated_at");
    expect(out.applied_filters).toMatchObject({ purpose: "buy", completion: "ready", sort: "newest" });
  });

  it("resolves areas to exact CMS location names before searching", async () => {
    const { cms, searchCalls } = setup();
    const out = await cms.searchProperties({ areas: ["dubai marina", "JBR"], page: 1, page_size: 6 });
    expect((searchCalls()[0]!.body as { query: string[] }).query).toEqual(["Dubai Marina", "Jumeirah Beach Residence"]);
    expect(out.applied_filters.areas).toEqual(["Dubai Marina", "Jumeirah Beach Residence"]);
  });

  it("does not call the search endpoint for an unknown area and reports no results honestly", async () => {
    const { cms, searchCalls } = setup();
    const out = await cms.searchProperties({ areas: ["Atlantis on Mars"], page: 1, page_size: 6 });
    expect(searchCalls()).toHaveLength(0);
    expect(out.status).toBe("no_results");
    expect(out.items).toEqual([]);
    expect(out.notes.join(" ")).toContain("Atlantis on Mars");
  });
});

describe("area / developer / handover resolution", () => {
  it("expands partial names to whole-word matches and reports the expansion", () => {
    const r = resolveAreas(["Marina"], KNOWN);
    expect(r.matched).toEqual(["Dubai Marina", "Marina Gate", "Marina Vista", "Dubai Marina Towers"]);
    expect(r.expanded[0]!.input).toBe("Marina");
  });

  it("never expands country-wide or tiny terms", () => {
    expect(resolveAreas(["UAE", "Du"], KNOWN).matched).toEqual([]);
    expect(resolveAreas(["United Arab Emirates"], KNOWN).matched).toEqual(["United Arab Emirates"]);
  });

  it("matches developers by exact name or whole word", () => {
    expect(resolveDevelopers(["sobha", "EMAAR PROPERTIES", "xyz"], OFFPLAN_SUGGESTIONS.developers)).toEqual({
      matched: ["Sobha Group", "Emaar Properties"],
      unmatched: ["xyz"],
    });
    expect(resolveDevelopers(["ing"], OFFPLAN_SUGGESTIONS.developers).matched).toEqual([]);
  });

  it("maps a quarter to every stored spelling, a year to all its quarters, and 'ready' to ready values", () => {
    const known = OFFPLAN_SUGGESTIONS.completion_date;
    expect(resolveHandover("Q2 2028", known)).toEqual(["Q2 - 2028", "Q2 2028"]);
    expect(resolveHandover("2028", known)).toEqual(["Q2 - 2028", "Q2 2028", "Q3 - 2028"]);
    expect(resolveHandover("ready", known)).toEqual(["Ready To - Move in"]);
    expect(resolveHandover("next summer", known)).toEqual([]);
  });
});

describe("pagination and empty results", () => {
  it("maps CMS totals into bounded pagination", async () => {
    const { cms } = setup([
      (c) => (c.url.pathname === "/api/search" ? json(searchResponse([searchItem(), searchItem({ slug: "b", title_en: "B" })], { page: 2, limit: 2, total: 61, total_pages: 31 })) : undefined),
    ]);
    const out = await cms.searchProperties({ page: 2, page_size: 2 });
    expect(out.status).toBe("ok");
    expect(out.pagination).toEqual({ page: 2, page_size: 2, total_results: 61, total_pages: 31, has_more: true });
  });

  it("reports zero matches as no_results, not an error", async () => {
    const { cms } = setup([(c) => (c.url.pathname === "/api/search" ? json(searchResponse([], { total: 0, total_pages: 0 })) : undefined)]);
    const out = await cms.searchProperties({ bedrooms: 7, page: 1, page_size: 6 });
    expect(out.status).toBe("no_results");
    expect(out.pagination.total_results).toBe(0);
  });

  it("explains a page beyond the last page", async () => {
    const { cms } = setup([(c) => (c.url.pathname === "/api/search" ? json(searchResponse([], { page: 9, total: 3, total_pages: 1 })) : undefined)]);
    const out = await cms.searchProperties({ page: 9, page_size: 6 });
    expect(out.status).toBe("ok");
    expect(out.items).toEqual([]);
    expect(out.notes[0]).toContain("beyond the last page (1)");
  });

  it("propagates API failures as CmsError instead of an empty result", async () => {
    const { cms } = setup([(c) => (c.url.pathname === "/api/search" ? json({ message: "boom" }, 500) : undefined)]);
    await expect(cms.searchProperties({ page: 1, page_size: 6 })).rejects.toBeInstanceOf(CmsError);
  });

  it("rejects a malformed success body", async () => {
    const { cms } = setup([(c) => (c.url.pathname === "/api/search" ? json({ unexpected: true }) : undefined)]);
    await expect(cms.searchProperties({ page: 1, page_size: 6 })).rejects.toMatchObject({ code: "cms_invalid_response" });
  });
});

describe("off-plan search", () => {
  it("sends only verified filters: resolved developers, a single completion_date string and project slugs", async () => {
    const { cms, offplanCalls } = setup();
    await cms.searchOffplan({ developers: ["Sobha"], handover: "Q3 2028", area: "Business Bay", page: 1, page_size: 6 });
    const call = offplanCalls()[0]!;
    expect(call.body).toEqual({ developers: ["Sobha Group"], completion_date: "Q3 - 2028", locations: ["binghatti-aquarise"] });
    expect(call.url.searchParams.get("sort_field")).toBe("updated_at");
  });

  it("sends nulls when unfiltered and maps pagination", async () => {
    const { cms, offplanCalls } = setup([
      (c) => (c.url.pathname === "/api/search-offplan" ? json(offplanSearchResponse([offplanItem()], { total: 46, per_page: 6, current_page: 1, last_page: 8 })) : undefined),
    ]);
    const out = await cms.searchOffplan({ page: 1, page_size: 6 });
    expect(offplanCalls()[0]!.body).toEqual({ developers: null, completion_date: null, locations: null });
    expect(out.pagination).toMatchObject({ total_results: 46, total_pages: 8, has_more: true });
  });

  it("merges every stored spelling of a handover quarter (one CMS call each) newest first", async () => {
    const { cms, offplanCalls } = setup([
      (c) => {
        if (c.url.pathname !== "/api/search-offplan") return undefined;
        const cd = (c.body as { completion_date: string }).completion_date;
        if (cd === "Q2 - 2028") return json(offplanSearchResponse([offplanItem({ id: 1, slug: "a", title: "A", updated_at: "2026-01-01T00:00:00Z" })]));
        if (cd === "Q2 2028") return json(offplanSearchResponse([offplanItem({ id: 2, slug: "b", title: "B", updated_at: "2026-05-01T00:00:00Z" })]));
        return json(offplanSearchResponse([]));
      },
    ]);
    const out = await cms.searchOffplan({ handover: "Q2 2028", page: 1, page_size: 6 });
    expect(offplanCalls().map((c) => (c.body as { completion_date: string }).completion_date)).toEqual(["Q2 - 2028", "Q2 2028"]);
    expect(offplanCalls().every((c) => c.url.searchParams.get("limit") === "100")).toBe(true);
    expect(out.items.map((i) => i.slug)).toEqual(["b", "a"]);
    expect(out.pagination.total_results).toBe(2);
  });

  it("returns no_results without calling search for an unknown developer or area", async () => {
    const { cms, offplanCalls } = setup();
    expect((await cms.searchOffplan({ developers: ["Nobody Ltd"], page: 1, page_size: 6 })).status).toBe("no_results");
    expect((await cms.searchOffplan({ area: "Atlantis", page: 1, page_size: 6 })).status).toBe("no_results");
    expect(offplanCalls()).toHaveLength(0);
  });

  it("caches suggestion lookups", async () => {
    const { cms, calls } = setup();
    await cms.searchOffplan({ developers: ["Emaar"], page: 1, page_size: 6 });
    await cms.searchOffplan({ developers: ["Sobha"], page: 1, page_size: 6 });
    expect(calls.filter((c) => c.url.pathname === "/api/search-offplan-suggestions")).toHaveLength(1);
  });
});

describe("details", () => {
  it("treats the CMS 'on null' 500 for a missing slug as not found", async () => {
    const { cms } = setup();
    await expect(cms.propertyDetails("does-not-exist-123")).rejects.toMatchObject({ code: "cms_not_found" });
  });

  it("URL-encodes slugs in CMS paths", async () => {
    const { cms, calls } = setup();
    await cms.propertyDetails("marina&sea");
    expect(calls.at(-1)!.url.pathname).toBe("/api/property/marina%26sea");
  });
});
