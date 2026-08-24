import { XMLParser } from "fast-xml-parser";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loader as robotsLoader } from "~/routes/robots[.]txt";
import { loader as sitemapIndexLoader } from "~/routes/sitemap[.]xml";
import { loader as contentSitemapLoader } from "~/routes/sitemaps";
import { getCanonicalUrlForPathname, PRODUCTION_ORIGIN } from "./canonical";
import { resetSitemapCache } from "./sitemap.server";

const parser = new XMLParser({ ignoreAttributes: false });

function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function requestUrl(input: RequestInfo | URL): URL {
  if (input instanceof Request) return new URL(input.url);
  return new URL(String(input));
}

function createCmsFetchMock() {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = requestUrl(input);

    if (url.pathname === "/api/search-offplan") {
      return jsonResponse({
        data: [],
        pagination: { current_page: 1, last_page: 1, total: 0 },
      });
    }

    if (url.pathname === "/api/search") {
      return jsonResponse({
        page: 1,
        total_pages: 1,
        data: [
          {
            id: 1,
            slug: "published-home",
            published: true,
            updated_at: "2026-08-20T10:30:00Z",
          },
          {
            id: 2,
            slug: "published-home",
            published: true,
            updated_at: "2026-08-19T10:30:00Z",
          },
          { id: 3, slug: "unpublished-home", published: false },
          { id: 4, slug: "private-home", visibility: "private" },
          { id: 5, published: true },
          { id: 6, slug: "bad/slug", published: true },
          { id: 7, slug: "marina&sea", published: true },
          "not-a-record",
        ],
      });
    }

    if (url.pathname === "/api/blogs" || url.pathname === "/api/news") {
      return jsonResponse({
        data: [],
        pagination: { current_page: 1, last_page: 1, total: 0 },
      });
    }

    if (url.pathname === "/api/teams") return jsonResponse([]);
    if (url.pathname === "/api/home") return jsonResponse({ areas: [] });

    return new Response("Not found", { status: 404 });
  });
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

describe("SEO resource routes", () => {
  beforeEach(() => {
    resetSitemapCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("serves crawlable robots.txt with the production sitemap and OAI-SearchBot access", async () => {
    const response = robotsLoader();
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toMatch(/^text\/plain/u);
    expect(body).toContain("Sitemap: https://savoirproperties.com/sitemap.xml");
    expect(body).toContain("User-agent: OAI-SearchBot");

    const oaiRules = body.split("User-agent: OAI-SearchBot", 2)[1]?.split("Sitemap:", 1)[0] ?? "";
    expect(oaiRules).toMatch(/^Allow: \/$/mu);
    expect(oaiRules).not.toMatch(/^Disallow: \/$/mu);
  });

  it("serves a valid XML sitemap index containing only production HTTPS URLs", async () => {
    vi.stubGlobal("fetch", createCmsFetchMock());

    const response = await sitemapIndexLoader();
    const body = await response.text();
    const xml = parser.parse(body);
    const sitemapRows = asArray<{ loc: string }>(xml.sitemapindex?.sitemap);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toMatch(/^application\/xml/u);
    expect(xml.sitemapindex).toBeDefined();
    expect(sitemapRows.length).toBeGreaterThan(1);

    for (const { loc } of sitemapRows) {
      const url = new URL(loc);
      expect(url.origin).toBe(PRODUCTION_ORIGIN);
      expect(url.protocol).toBe("https:");
      expect(url.search).toBe("");
      expect(loc).not.toMatch(/localhost|127\.0\.0\.1|staging|\.test/iu);
    }
  });

  it("filters non-public and malformed listings, removes duplicates, and matches canonical formatting", async () => {
    vi.stubGlobal("fetch", createCmsFetchMock());
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const response = await contentSitemapLoader({
      params: { type: "properties", page: "1" },
    });
    const body = await response.text();
    const xml = parser.parse(body);
    const rows = asArray<{ loc: string; lastmod?: string }>(xml.urlset?.url);
    const locations = rows.map(({ loc }) => loc);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toMatch(/^application\/xml/u);
    expect(xml.urlset).toBeDefined();
    expect(locations).toContain("https://savoirproperties.com/project/published-home");
    expect(locations).toContain("https://savoirproperties.com/project/marina%26sea");
    expect(locations).not.toContain("https://savoirproperties.com/project/unpublished-home");
    expect(locations).not.toContain("https://savoirproperties.com/project/private-home");
    expect(locations.filter((url) => url.endsWith("/published-home"))).toHaveLength(1);
    expect(body).not.toContain("bad/slug");
    expect(body).not.toMatch(/localhost|127\.0\.0\.1|staging|\.test/iu);

    for (const loc of locations) {
      const url = new URL(loc);
      expect(url.origin).toBe(PRODUCTION_ORIGIN);
      expect(url.protocol).toBe("https:");
      expect(url.search).toBe("");
      expect(getCanonicalUrlForPathname(url.pathname)).toBe(loc);
    }

    const published = rows.find(({ loc }) => loc.endsWith("/published-home"));
    expect(published?.lastmod).toBe("2026-08-20T10:30:00.000Z");
  });
});
