/**
 * Staff marketing insights from the aggregate counters (see analytics.ts).
 * Used by the report CLI (scripts/insights.ts) and the optional authenticated dashboard.
 * Every rate carries its sample size; small samples are flagged.
 */
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { dubaiDay, parseDimKey, type AnalyticsData } from "./analytics.js";

export const LOW_SAMPLE = 30;

export interface Rate {
  value: number | null; // 0..1
  numerator: number;
  denominator: number;
  low_sample: boolean;
}
const rate = (n: number, d: number): Rate => ({ value: d > 0 ? n / d : null, numerator: n, denominator: d, low_sample: d < LOW_SAMPLE });

export interface InsightsReport {
  period: { from: string; to: string; days_with_data: number };
  funnel: Array<{ step: string; count: number; note?: string }>;
  rates: Record<string, Rate>;
  link_clicks_by_channel: Record<string, number>;
  link_clicks_by_source: Record<string, number>;
  areas: Array<{ area: string; searches: number; no_result_rate: Rate }>;
  budgets: Array<{ band: string; searches: number; no_result_rate: Rate; underserved: boolean }>;
  listings: Array<{ kind: string; slug: string; url: string; detail_views: number; shortlist_adds: number; compares: number; handoffs: number; clicks: number; score: number }>;
  daily: Array<{ day: string; searches: number; handoffs: number; clicks: number; inquiries: number }>;
  campaigns: Array<{ campaign: string; handoffs: number }>;
  limitations: string[];
}

function sumEvent(days: AnalyticsData["days"][string][], event: string, where?: (dims: Record<string, string>) => boolean): number {
  let n = 0;
  for (const d of days) for (const [k, v] of Object.entries(d.events[event] ?? {})) if (!where || where(parseDimKey(k))) n += v;
  return n;
}

function groupBy(days: AnalyticsData["days"][string][], event: string, dim: string): Map<string, { total: number; noResults: number }> {
  const m = new Map<string, { total: number; noResults: number }>();
  for (const d of days)
    for (const [k, v] of Object.entries(d.events[event] ?? {})) {
      const dims = parseDimKey(k);
      const key = dims[dim] ?? "unspecified";
      const e = m.get(key) ?? { total: 0, noResults: 0 };
      e.total += v;
      if (dims.outcome === "no_results") e.noResults += v;
      m.set(key, e);
    }
  return m;
}

export function buildInsights(data: AnalyticsData, opts: { days: number; now?: number; siteOrigin: string }): InsightsReport {
  const now = opts.now ?? Date.now();
  const to = dubaiDay(now);
  const from = dubaiDay(now - (opts.days - 1) * 86_400_000);
  const dayKeys = Object.keys(data.days).filter((d) => d >= from && d <= to).sort();
  const days = dayKeys.map((d) => data.days[d]!);

  const searches = sumEvent(days, "search");
  const offplanSearches = sumEvent(days, "offplan_search");
  const noResults = sumEvent(days, "search", (d) => d.outcome === "no_results");
  const details = sumEvent(days, "detail_view");
  const compares = sumEvent(days, "compare");
  const adds = sumEvent(days, "shortlist_add");
  const shares = sumEvent(days, "shortlist_shared");
  const handoffs = sumEvent(days, "handoff_prepared");
  const clicks = sumEvent(days, "link_click");
  const contactClicks = sumEvent(days, "link_click", (d) => d.channel !== "website");
  const inquiries = sumEvent(days, "inquiry_submitted");

  const byChannel: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  for (const d of days)
    for (const [k, v] of Object.entries(d.events.link_click ?? {})) {
      const dims = parseDimKey(k);
      byChannel[dims.channel ?? "unknown"] = (byChannel[dims.channel ?? "unknown"] ?? 0) + v;
      bySource[dims.source ?? "unknown"] = (bySource[dims.source ?? "unknown"] ?? 0) + v;
    }

  const areas = [...groupBy(days, "search_area", "area").entries()]
    .map(([area, e]) => ({ area, searches: e.total, no_result_rate: rate(e.noResults, e.total) }))
    .sort((a, b) => b.searches - a.searches)
    .slice(0, 20);

  const budgets = [...groupBy(days, "search", "budget_band").entries()]
    .map(([band, e]) => {
      const r = rate(e.noResults, e.total);
      return { band, searches: e.total, no_result_rate: r, underserved: band !== "unspecified" && e.total >= 10 && (r.value ?? 0) >= 0.4 };
    })
    .sort((a, b) => b.searches - a.searches);

  const listingAgg = new Map<string, { detail_views: number; shortlist_adds: number; compares: number; handoffs: number; clicks: number }>();
  for (const d of days)
    for (const [key, ev] of Object.entries(d.listings)) {
      const e = listingAgg.get(key) ?? { detail_views: 0, shortlist_adds: 0, compares: 0, handoffs: 0, clicks: 0 };
      e.detail_views += ev.detail_view ?? 0;
      e.shortlist_adds += ev.shortlist_add ?? 0;
      e.compares += ev.compare_listing ?? 0;
      e.handoffs += ev.handoff_listing ?? 0;
      e.clicks += ev.link_click ?? 0;
      listingAgg.set(key, e);
    }
  const listings = [...listingAgg.entries()]
    .map(([key, e]) => {
      const [kind, ...rest] = key.split(":");
      const slug = rest.join(":");
      return { kind: kind!, slug, url: `${opts.siteOrigin}/${kind === "offplan" ? "off-plan" : "project"}/${slug}`, ...e, score: e.detail_views + 2 * e.compares + 3 * e.shortlist_adds + 4 * e.clicks + 5 * e.handoffs };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  const daily = dayKeys.map((day) => {
    const b = [data.days[day]!];
    return { day, searches: sumEvent(b, "search") + sumEvent(b, "offplan_search"), handoffs: sumEvent(b, "handoff_prepared"), clicks: sumEvent(b, "link_click"), inquiries: sumEvent(b, "inquiry_submitted") };
  });

  const campaigns = [...groupBy(days, "handoff_prepared", "campaign").entries()]
    .filter(([c]) => c !== "none" && c !== "unspecified")
    .map(([campaign, e]) => ({ campaign, handoffs: e.total }))
    .sort((a, b) => b.handoffs - a.handoffs);

  return {
    period: { from, to, days_with_data: dayKeys.length },
    funnel: [
      { step: "Property searches", count: searches },
      { step: "Off-plan searches", count: offplanSearches },
      { step: "Listing detail views", count: details },
      { step: "Comparisons", count: compares },
      { step: "Shortlist saves", count: adds },
      { step: "Shortlists shared", count: shares },
      { step: "Messages prepared (handoffs)", count: handoffs, note: "message composed; not necessarily sent" },
      { step: "Contact link clicks (WhatsApp)", count: contactClicks, note: "a click is intent, not a delivered lead" },
      { step: "Inquiries submitted to the CMS", count: inquiries, note: "delivered leads; 0 while live submission is disabled" },
    ],
    rates: {
      no_result_searches: rate(noResults, searches),
      detail_views_per_search: rate(details, searches + offplanSearches),
      handoffs_per_search: rate(handoffs, searches + offplanSearches),
      contact_clicks_per_handoff: rate(sumEvent(days, "link_click", (d) => d.source === "handoff"), handoffs),
    },
    link_clicks_by_channel: byChannel,
    link_clicks_by_source: bySource,
    areas,
    budgets,
    listings,
    daily,
    campaigns,
    limitations: [
      "Counts are daily aggregates with no user or session identifiers: repeat visits by the same person are counted again, and unique customers cannot be measured.",
      "A contact link click shows intent only. Whether a WhatsApp message or email was actually sent cannot be observed; match the SAV-XXXXXX reference in incoming WhatsApp messages to confirm leads.",
      "Links the AI assistant writes into its own text replies are plain (not tracked); only buttons in the cards and handoff are counted.",
      "Link-preview bots and browser prefetches are excluded heuristically; some automated clicks may still be counted.",
      "Email and phone buttons are not tracked. The website has no analytics, so on-site behaviour after a click is unknown.",
      `Rates with fewer than ${LOW_SAMPLE} events in the denominator are flagged as low sample and should not drive decisions.`,
      "Search areas reflect what customers asked for (resolved to Savoir location names), not where they live.",
    ],
  };
}

// ---------- staff credentials (scrypt) ----------

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$8$1$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, salt, hash] = parts as [string, string, string, string, string, string];
  try {
    const expected = Buffer.from(hash, "base64url");
    const actual = scryptSync(password, Buffer.from(salt, "base64url"), expected.length, { N: Number(n), r: Number(r), p: Number(p) });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

// ---------- HTML rendering ----------

const esc = (s: unknown) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const pct = (r: Rate) => (r.value === null ? "—" : `${(r.value * 100).toFixed(1)}%`) + ` <span class="n">(${r.numerator}/${r.denominator}${r.low_sample ? ", low sample" : ""})</span>`;

export function renderInsightsHtml(r: InsightsReport): string {
  const table = (head: string[], rows: string[][]) =>
    `<table><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${head.length}" class="n">No data yet</td></tr>`}</tbody></table>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>Savoir app insights ${esc(r.period.from)} – ${esc(r.period.to)}</title>
<style>
:root{color-scheme:light dark;--fg:#111;--bg:#fff;--muted:#666;--line:#e3ddd5;--chip:#f4efe9}
@media (prefers-color-scheme:dark){:root{--fg:#eee;--bg:#1b1b1b;--muted:#aaa;--line:#3a3732;--chip:#2a2723}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:1100px;margin:0 auto;padding:20px 16px 40px}
h1{font:700 24px Georgia,serif;margin:0 0 4px}h2{font:700 18px Georgia,serif;margin:26px 0 8px}
.n{color:var(--muted);font-size:12px}
table{border-collapse:collapse;width:100%;font-size:13px}th,td{text-align:left;padding:6px 8px;border-bottom:1px solid var(--line);vertical-align:top}
th{background:var(--chip)}
.warn{background:#f7e6e2;color:#8a2f22;border-radius:6px;padding:1px 6px;font-size:12px}
ul{padding-left:18px}
</style></head><body><main>
<h1>Savoir Properties app — business insights</h1>
<div class="n">${esc(r.period.from)} to ${esc(r.period.to)} (Dubai time) · ${r.period.days_with_data} day(s) with data · aggregate counts only, no personal data</div>
<h2>Funnel</h2>
${table(["Step", "Count", "Note"], r.funnel.map((f) => [esc(f.step), String(f.count), esc(f.note ?? "")]))}
<h2>Key rates</h2>
${table(["Rate", "Value (numerator/denominator)"], [
  ["Searches with no exact match", pct(r.rates.no_result_searches!)],
  ["Detail views per search", pct(r.rates.detail_views_per_search!)],
  ["Messages prepared per search", pct(r.rates.handoffs_per_search!)],
  ["WhatsApp clicks per prepared message", pct(r.rates.contact_clicks_per_handoff!)],
])}
<h2>Most requested areas</h2>
${table(["Area", "Searches", "No exact match"], r.areas.map((a) => [esc(a.area), String(a.searches), pct(a.no_result_rate)]))}
<h2>Budgets</h2>
<p class="n">"Underserved" = at least 10 searches in the band and 40%+ without an exact match — a signal to source more listings at that price.</p>
${table(["Budget band", "Searches", "No exact match", ""], r.budgets.map((b) => [esc(b.band), String(b.searches), pct(b.no_result_rate), b.underserved ? '<span class="warn">underserved</span>' : ""]))}
<h2>Listings attracting interest</h2>
${table(["Listing", "Detail views", "Shortlist saves", "Comparisons", "Messages", "Clicks"], r.listings.map((l) => [`<a href="${esc(l.url)}" rel="noopener noreferrer">${esc(l.slug)}</a> <span class="n">${esc(l.kind)}</span>`, String(l.detail_views), String(l.shortlist_adds), String(l.compares), String(l.handoffs), String(l.clicks)]))}
<h2>Search-to-contact trend</h2>
${table(["Day", "Searches", "Messages prepared", "Link clicks", "Inquiries submitted"], r.daily.map((d) => [esc(d.day), String(d.searches), String(d.handoffs), String(d.clicks), String(d.inquiries)]))}
<h2>Clicks</h2>
${table(["Channel / source", "Clicks"], [...Object.entries(r.link_clicks_by_channel).map(([k, v]) => [`channel: ${esc(k)}`, String(v)]), ...Object.entries(r.link_clicks_by_source).map(([k, v]) => [`source: ${esc(k)}`, String(v)])])}
<h2>Campaign codes</h2>
${table(["Campaign", "Messages prepared"], r.campaigns.map((c) => [esc(c.campaign), String(c.handoffs)]))}
<h2>Limitations</h2>
<ul>${r.limitations.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
</main></body></html>`;
}
