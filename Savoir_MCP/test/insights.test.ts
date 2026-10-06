import { describe, expect, it } from "vitest";
import type { AnalyticsData } from "../src/analytics.js";
import { buildInsights, hashPassword, renderInsightsHtml, verifyPassword } from "../src/insights.js";

const data: AnalyticsData = {
  version: 1,
  days: {
    "2026-08-01": { events: { search: { "budget_band=sale_1-2M|outcome=ok": 99 } }, listings: {} }, // outside a 30-day window
    "2026-10-05": {
      events: {
        search: { "budget_band=sale_<1M|outcome=no_results": 8, "budget_band=sale_<1M|outcome=ok": 4, "budget_band=sale_2-3M|outcome=ok": 20 },
        search_area: { "area=Dubai Marina|outcome=ok": 15, "area=Palm Jumeirah|outcome=no_results": 5 },
        detail_view: { "kind=property": 12 },
        handoff_prepared: { "campaign=spring26|listings=1": 3, "campaign=none|listings=2": 2 },
        link_click: { "channel=whatsapp_company|kind=property|source=handoff": 4, "channel=website|kind=property|source=card": 6 },
      },
      listings: {
        "property:a": { detail_view: 5, shortlist_add: 2, link_click: 1 },
        "property:b": { detail_view: 9 },
        "offplan:<x>": { handoff_listing: 1 },
      },
    },
    "2026-10-06": { events: { search: { "budget_band=unspecified|outcome=ok": 2 } }, listings: {} },
  },
};

describe("insights report", () => {
  const r = buildInsights(data, { days: 30, now: Date.parse("2026-10-06T10:00:00Z"), siteOrigin: "https://savoirproperties.com" });

  it("covers the requested period only", () => {
    expect(r.period).toEqual({ from: "2026-09-07", to: "2026-10-06", days_with_data: 2 });
    expect(r.funnel[0]).toEqual({ step: "Property searches", count: 34 });
  });

  it("separates link clicks (intent) from delivered leads", () => {
    const step = (s: string) => r.funnel.find((f) => f.step.startsWith(s))!;
    expect(step("Contact link clicks").count).toBe(4); // website clicks are not contact clicks
    expect(step("Contact link clicks").note).toMatch(/not a delivered lead/);
    expect(step("Inquiries submitted").count).toBe(0);
  });

  it("reports rates with sample sizes and flags small samples", () => {
    expect(r.rates.no_result_searches).toEqual({ value: 8 / 34, numerator: 8, denominator: 34, low_sample: false });
    expect(r.rates.contact_clicks_per_handoff).toMatchObject({ numerator: 4, denominator: 5, low_sample: true });
  });

  it("flags underserved budgets only with enough searches", () => {
    const under = r.budgets.find((b) => b.band === "sale_<1M")!;
    expect(under).toMatchObject({ searches: 12, underserved: true });
    expect(r.budgets.find((b) => b.band === "sale_2-3M")!.underserved).toBe(false);
    expect(r.budgets.find((b) => b.band === "unspecified")!.underserved).toBe(false);
  });

  it("ranks listings by weighted interest, with website links", () => {
    expect(r.listings[0]).toMatchObject({ slug: "a", url: "https://savoirproperties.com/project/a", detail_views: 5, shortlist_adds: 2, clicks: 1 });
    expect(r.listings.map((l) => l.slug)).toEqual(["a", "b", "<x>"]);
    expect(r.campaigns).toEqual([{ campaign: "spring26", handoffs: 3 }]);
    expect(r.areas[1]).toMatchObject({ area: "Palm Jumeirah", searches: 5 });
  });

  it("renders escaped HTML with the limitations", () => {
    const html = renderInsightsHtml(r);
    expect(html).toContain("&lt;x&gt;");
    expect(html).not.toContain("<x>");
    expect(html).toContain("cannot be measured");
    expect(html).toContain('name="robots" content="noindex, nofollow"');
  });
});

describe("staff password hashing", () => {
  it("verifies only the right password", () => {
    const h = hashPassword("correct horse battery");
    expect(h).toMatch(/^scrypt\$16384\$8\$1\$/);
    expect(verifyPassword("correct horse battery", h)).toBe(true);
    expect(verifyPassword("wrong", h)).toBe(false);
    expect(verifyPassword("x", "garbage")).toBe(false);
  });
});
