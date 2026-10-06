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
:root{color-scheme:light dark;--bg:#fff;--fg:#111;--muted:#5f5f5f;--line:#e6e1da;--chip:#f4efe9;--accent:#2b2b2b}
@media (prefers-color-scheme:dark){:root{--bg:#1b1b1b;--fg:#f3f1ee;--muted:#b4ada4;--line:#3a3732;--chip:#2f2c28;--accent:#dec7b1}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:860px;margin:0 auto;padding:20px 16px 40px}
header{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#2b2b2b;color:#f3f1ee;border-radius:10px;padding:10px 14px;margin-bottom:16px}
header .muted{color:#e6e0d8}
header img{height:34px;width:auto}
h1{font:700 24px Georgia,"Times New Roman",serif;margin:0 0 6px}
.muted{color:var(--muted);font-size:13px}
ul{list-style:none;margin:0;padding:0;display:grid;gap:12px}
li{display:grid;grid-template-columns:140px 1fr;gap:12px;border:1px solid var(--line);border-radius:10px;overflow:hidden}
li img{width:140px;height:100%;min-height:100px;object-fit:cover;background:var(--chip)}
.b{padding:10px 12px 12px 0}
.t{font:700 17px Georgia,serif;margin:0 0 4px}
.p{font-weight:700}
a.btn{display:inline-block;margin-top:8px;padding:6px 12px;border-radius:8px;background:var(--accent);color:var(--bg);text-decoration:none;font-weight:600;font-size:13px}
footer{margin-top:22px;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:520px){li{grid-template-columns:1fr}li img{width:100%;height:170px}.b{padding:0 12px 12px}}
`;

export function renderSharePage(r: ShortlistRecord, siteOrigin: string, logoUrl: string, utm = false, track?: (url: string, kind: "property" | "offplan", slug: string) => string): string {
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai" });
  const items = r.items
    .map((i) => {
      const s = i.snapshot;
      const plain = utm ? withUtm(s.url, "shared_shortlist", undefined, siteOrigin) : s.url;
      const url = track ? track(plain, i.kind, i.slug) : plain;
      return `<li>${s.photo ? `<img src="${esc(s.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : "<div></div>"}
<div class="b"><p class="t">${esc(s.title)}</p>
<div class="muted">${esc([s.location_label, s.bedrooms_label, i.kind === "offplan" ? "Off-plan project" : null].filter(Boolean).join(" · "))}</div>
<div class="p">${esc(s.price_label ?? "Price on request")}</div>
<div class="muted">As listed on ${esc(fmtDate(s.captured_at))}</div>
<a class="btn" href="${esc(url)}" rel="noopener noreferrer">View current details</a></div></li>`;
    })
    .join("\n");
  return `<!doctype html><html lang="en" dir="auto"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><meta name="referrer" content="no-referrer"><title>Shared shortlist · Savoir Properties</title><style>${PAGE_HEADERS_STYLE}</style></head>
<body><main><header><a href="${esc(siteOrigin)}/" rel="noopener noreferrer"><img src="${esc(logoUrl)}" alt="Savoir Properties"></a><span class="muted">Shared shortlist</span></header>
<h1>Saved properties</h1>
<p class="muted">Someone shared this shortlist of Savoir Properties listings with you. Prices and availability are as listed on the date shown and may have changed — open a listing for current details or contact Savoir.</p>
${r.items.length ? `<ul>${items}</ul>` : `<p>This shortlist is empty.</p>`}
<footer class="muted">This page contains no personal information. It expires on ${esc(fmtDate(r.expires_at))} or when the owner stops sharing it.
Contact Savoir: <a href="https://wa.me/971505074686" rel="noopener noreferrer">WhatsApp</a> · <a href="${esc(siteOrigin)}/contact-us" rel="noopener noreferrer">savoirproperties.com</a></footer>
</main></body></html>`;
}

export function shareNotFoundPage(siteOrigin: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Shortlist unavailable · Savoir Properties</title><style>${PAGE_HEADERS_STYLE}</style></head>
<body><main><h1>This shortlist is no longer available</h1><p class="muted">The link may have expired, or its owner stopped sharing it.</p>
<p><a class="btn" href="${esc(siteOrigin)}/" rel="noopener noreferrer">Browse Savoir Properties</a></p></main></body></html>`;
}
