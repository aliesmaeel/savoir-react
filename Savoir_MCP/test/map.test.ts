import { describe, expect, it } from "vitest";
import { loadConfig, DEFAULT_IMAGE_HOSTS } from "../src/config.js";
import { mapOffplanDetails, mapOffplanSummary, mapPropertySummary } from "../src/cms/mappers.js";
import { AREA_POINTS } from "../src/data/areaPoints.js";
import { areaPoint, embedPoint, MAX_EMBED_SPAN_M } from "../src/data/mapPoints.js";
import * as mapPointsModule from "../src/data/mapPoints.js";
import { buildWidgetHtml } from "../src/ui/widget.js";
import { offplanDetailResponse, offplanItem, searchItem } from "./fixtures.js";

const ctx = { publicSiteUrl: "https://savoirproperties.com", imageHosts: DEFAULT_IMAGE_HOSTS };
const embed = (span: number, lng: number, lat: number) => `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${span}!2d${lng}!3d${lat}!2m3!1f0"></iframe>`;

describe("map points", () => {
  it("only contains area centres inside Dubai, each with a source", () => {
    expect(Object.keys(AREA_POINTS).length).toBeGreaterThan(30);
    for (const [name, p] of Object.entries(AREA_POINTS)) {
      expect(p.lat, name).toBeGreaterThan(24.6);
      expect(p.lat, name).toBeLessThan(25.45);
      expect(p.lng, name).toBeGreaterThan(54.85);
      expect(p.lng, name).toBeLessThan(55.7);
      expect(p.osm, name).toMatch(/^(node|way|relation)\/\d+$/);
      expect(p.radius_m, name).toBeGreaterThanOrEqual(500);
    }
  });

  it("places listings at their community centre and says it is an area", () => {
    const p = areaPoint("Dubai Marina")!;
    expect(p).toMatchObject({ precision: "area", area: "Dubai Marina" });
    expect(areaPoint("The Lagoons")?.area).toBe("Dubai Creek Harbour (The Lagoons)"); // alias in brackets
    expect(areaPoint("Al Furjan")).toBeNull(); // no verifiable area: not placed
    expect(areaPoint("Atlantis on Mars")).toBeNull();
  });

  it("uses a developer map view only when it is tight, and only as an approximate location", () => {
    expect(embedPoint(embed(452, 55.2481, 25.184))).toMatchObject({ precision: "approximate", lat: 25.184, lng: 55.2481, radius_m: 250 });
    expect(embedPoint(embed(3610, 55.3, 25.1))?.radius_m).toBe(1805);
    expect(embedPoint(embed(MAX_EMBED_SPAN_M + 1, 55.3, 25.1))).toBeNull(); // city-wide view: not a location
    expect(embedPoint(embed(452, 2.35, 48.85))).toBeNull(); // outside Dubai
    expect(embedPoint("not a map")).toBeNull();
    expect(embedPoint(null)).toBeNull();
  });

  it("adds an area-level map_point to ready and off-plan listings", () => {
    const prop = mapPropertySummary({ ...searchItem(), community: "Dubai Marina" }, ctx)!;
    expect(prop.map_point).toMatchObject({ precision: "area", area: "Dubai Marina" });
    expect(mapPropertySummary({ ...searchItem(), community: "Al Furjan" }, ctx)!.map_point).toBeNull();

    const slug = "map-test-project";
    const before = mapOffplanSummary({ ...offplanItem(), slug, location: "Business Bay" }, ctx)!;
    expect(before.map_point).toMatchObject({ precision: "area", area: "Business Bay" });
    const detail = mapOffplanDetails({ ...offplanDetailResponse(), slug, location: "Business Bay", area: "Business Bay", map_link: embed(452, 55.27, 25.18) }, ctx)!;
    expect(detail.map_point).toMatchObject({ precision: "area", area: "Business Bay" });
    // Learned from the detail page: later lists use the same area-level point.
    expect(mapOffplanSummary({ ...offplanItem(), slug, location: "Business Bay" }, ctx)!.map_point).toMatchObject({ precision: "area", area: "Business Bay" });
  });
});

describe("off-plan pin verification", () => {
  it("always shows projects at area level; the developer map only checks the listed area", () => {
    const { offplanMapPoint } = mapPointsModule;
    expect(offplanMapPoint(embed(452, 55.27, 25.18), "Business Bay")).toMatchObject({ check: "agrees", point: { precision: "area", area: "Business Bay" } });
    // 14 km away from Business Bay: the map view contradicts the listing, so the area centre is used.
    expect(offplanMapPoint(embed(452, 55.14, 25.08), "Business Bay")).toMatchObject({ check: "conflict", point: { precision: "area", area: "Business Bay" } });
    // No verifiable area: not placed, even with a map view.
    expect(offplanMapPoint(embed(452, 55.25, 25.18), "Dubai Land Residence Complex (DLRC)", "Dubailand")).toEqual({ point: null, check: "unverified" });
    expect(offplanMapPoint(null, "Dubai Marina")).toMatchObject({ check: "area-only", point: { precision: "area" } });
  });
});

describe("map configuration", () => {
  it("is off by default: no tiles, no Leaflet in the card", () => {
    const config = loadConfig({ CMS_BASE_URL: "https://cms.test" });
    expect(config.mapTiles).toBeNull();
    expect(buildWidgetHtml("/*bundle*/", { map: config.mapTiles })).not.toContain("leafletjs.com");
  });

  it("derives the tile origins for the CSP and inlines Leaflet when a provider is set", () => {
    const config = loadConfig({ CMS_BASE_URL: "https://cms.test", MAP_TILE_URL: "https://{s}.tiles.example.com/{z}/{x}/{y}.png?key=public", MAP_TILE_SUBDOMAINS: "a,b" });
    expect(config.mapTiles).toMatchObject({ origins: ["https://a.tiles.example.com", "https://b.tiles.example.com"], attribution: "© OpenStreetMap contributors" });
    const html = buildWidgetHtml("/*bundle*/", { map: config.mapTiles });
    expect(html).toContain("leafletjs.com");
    expect(html).toContain('"map":{"url":"https://{s}.tiles.example.com/{z}/{x}/{y}.png?key=public"');
  });

  it("rejects tile templates that are not https XYZ templates", () => {
    expect(() => loadConfig({ CMS_BASE_URL: "https://cms.test", MAP_TILE_URL: "https://tiles.example.com/tile.png" })).toThrow(/\{z\}/);
    expect(() => loadConfig({ CMS_BASE_URL: "https://cms.test", MAP_TILE_URL: "http://tiles.example.com/{z}/{x}/{y}.png" })).toThrow(/https/);
  });
});
