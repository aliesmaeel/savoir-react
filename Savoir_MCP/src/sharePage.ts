/**
 * Read-only public page for a shared shortlist: /s/<share_token>.
 * Renders only server-captured listing snapshots (no CMS calls, no personal data).
 */
import type { ShortlistRecord } from "./shortlist.js";
import { withUtm } from "./handoff.js";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function sharePageCsp(imageHosts: readonly string[], siteOrigin: string): string {
  return [
    "default-src 'none'",
    `img-src ${[...imageHosts.map((h) => `https://${h}`), siteOrigin].join(" ")}`,
    "style-src 'unsafe-inline'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join("; ");
}

const PAGE_HEADERS_STYLE = `
:root{color-scheme:light dark;--bg:#fff;--fg:#1c1b1a;--muted:#6e6a64;--line:#ebe7e1;--soft:#f6f4f1;--primary:#1f1e1d;--primary-fg:#fff;--gold:#a8834a}
@media (prefers-color-scheme:dark){:root{--bg:#1c1c1c;--fg:#f2efea;--muted:#a9a39b;--line:#353330;--soft:#2a2927;--primary:#ece3d6;--primary-fg:#171717;--gold:#d2b07c}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",sans-serif;-webkit-font-smoothing:antialiased}
main{max-width:880px;margin:0 auto;padding:20px 16px 48px}
header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:28px}
.brand{display:inline-flex;background:#1f1e1d;border-radius:9px;padding:7px 12px}
.brand img{height:17px;width:auto;display:block}
.muted{color:var(--muted);font-size:13.5px}
h1{font-size:24px;font-weight:600;letter-spacing:-.01em;margin:0 0 4px}
.lede{margin:0 0 22px}
ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
li{border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.ph{aspect-ratio:16/10;background:var(--soft)}
.ph img{width:100%;height:100%;object-fit:cover;display:block}
.b{padding:12px 14px 14px;display:flex;flex-direction:column;gap:2px;flex:1}
.p{font-size:17px;font-weight:650;font-variant-numeric:tabular-nums}
.t{font-weight:500;margin:0}
a.btn{align-self:flex-start;margin-top:12px;display:inline-flex;align-items:center;min-height:36px;padding:0 14px;border-radius:10px;background:var(--primary);color:var(--primary-fg);text-decoration:none;font-weight:550;font-size:13.5px}
a.btn:focus-visible,a:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
footer{margin-top:32px;border-top:1px solid var(--line);padding-top:14px;display:flex;flex-wrap:wrap;gap:6px 16px;justify-content:space-between}
footer a{color:var(--fg)}
`;

export function renderSharePage(r: ShortlistRecord, siteOrigin: string, logoUrl: string, utm = false, track?: (url: string, kind: "property" | "offplan", slug: string) => string): string {
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai" });
  const items = r.items
    .map((i) => {
      const s = i.snapshot;
      const plain = utm ? withUtm(s.url, "shared_shortlist", undefined, siteOrigin) : s.url;
      const url = track ? track(plain, i.kind, i.slug) : plain;
      return `<li><div class="ph">${s.photo ? `<img src="${esc(s.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ""}</div>
<div class="b"><div class="p">${esc(s.price_label ?? "Price on request")}</div>
<p class="t" dir="auto">${esc(s.title.replace(/\s*\|\s*/g, " · "))}</p>
<div class="muted" dir="auto">${esc([s.location_label, s.bedrooms_label, i.kind === "offplan" ? "Off-plan project" : null].filter(Boolean).join(" · "))}</div>
<div class="muted">As listed on ${esc(fmtDate(s.captured_at))}</div>
<a class="btn" href="${esc(url)}" rel="noopener noreferrer">View current details</a></div></li>`;
    })
    .join("\n");
  return `<!doctype html><html lang="en" dir="auto"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><meta name="referrer" content="no-referrer"><title>Shared shortlist · Savoir Properties</title><style>${PAGE_HEADERS_STYLE}</style></head>
<body><main><header><a class="brand" href="${esc(siteOrigin)}/" rel="noopener noreferrer"><img src="${esc(logoUrl)}" alt="Savoir Properties"></a><span class="muted">Shared shortlist</span></header>
<h1>Saved properties</h1>
<p class="muted lede">Shared from Savoir Properties. Prices and availability may have changed since these were saved.</p>
${r.items.length ? `<ul>${items}</ul>` : `<p class="muted">This shortlist is empty.</p>`}
<footer class="muted"><span>No personal information. This link expires on ${esc(fmtDate(r.expires_at))}.</span>
<span>Contact Savoir: <a href="https://wa.me/971505074686" rel="noopener noreferrer">WhatsApp</a> · <a href="${esc(siteOrigin)}/contact-us" rel="noopener noreferrer">savoirproperties.com</a></span></footer>
</main></body></html>`;
}

export function shareNotFoundPage(siteOrigin: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Shortlist unavailable · Savoir Properties</title><style>${PAGE_HEADERS_STYLE}</style></head>
<body><main><h1>This shortlist is no longer available</h1><p class="muted lede">The link may have expired, or its owner stopped sharing it.</p>
<p><a class="btn" href="${esc(siteOrigin)}/" rel="noopener noreferrer">Browse Savoir Properties</a></p></main></body></html>`;
}
