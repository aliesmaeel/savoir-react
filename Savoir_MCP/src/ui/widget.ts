/**
 * MCP Apps UI resource (text/html;profile=mcp-app) rendering Savoir listing
 * cards. Works in ChatGPT and other MCP Apps hosts; tools also return full
 * text so clients without UI lose nothing.
 *
 * The official @modelcontextprotocol/ext-apps App client is inlined (its
 * self-contained "app-with-deps" build) and exposed as a global, so the widget
 * needs no network access beyond listing images (CSP resourceDomains).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const WIDGET_URI = "ui://savoir/listings-v1.html";

let cachedBundle: string | undefined;

/** Load the ext-apps browser bundle and turn its trailing ES export into a global. */
export function loadAppBundle(): string {
  if (cachedBundle) return cachedBundle;
  const path = fileURLToPath(import.meta.resolve("@modelcontextprotocol/ext-apps/app-with-deps"));
  cachedBundle = exposeExportsAsGlobal(readFileSync(path, "utf8"), "__savoirMcpApps");
  return cachedBundle;
}

export function exposeExportsAsGlobal(bundle: string, globalName: string): string {
  const match = bundle.match(/export\s*\{([^}]*)\}\s*;?\s*$/);
  if (!match || bundle.indexOf("export{") !== bundle.lastIndexOf("export{") || /\bimport\s*[{*\w]/.test(bundle.slice(0, 2000))) {
    throw new Error("Unexpected ext-apps bundle format; cannot inline the widget client");
  }
  const pairs = (match[1] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [local, exported] = s.split(/\s+as\s+/);
      return `${JSON.stringify(exported ?? local)}:${local}`;
    });
  return `${bundle.slice(0, match.index)}globalThis.${globalName}={${pairs.join(",")}};`;
}

/** Escape a string for safe embedding inside a <script> element. */
function scriptSafe(js: string): string {
  return js.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
}

export function buildWidgetHtml(bundle: string = loadAppBundle()): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Savoir Properties</title>
<style>${CSS}</style>
</head>
<body>
<div id="root" aria-live="polite"><div class="sv-empty">Loading Savoir listings…</div></div>
<script type="module">${scriptSafe(bundle)}</script>
<script type="module">${scriptSafe(WIDGET_JS)}</script>
</body>
</html>`;
}

const CSS = `
:root{
  --sv-bg:#ffffff;--sv-fg:#111111;--sv-muted:#5f5f5f;--sv-card:#ffffff;--sv-line:#e6e1da;
  --sv-accent:#2b2b2b;--sv-accent-fg:#ffffff;--sv-gold:#c6a45a;--sv-sand:#dec7b1;--sv-chip:#f4efe9;
  --sv-shadow:0 4px 14px rgba(0,0,0,.10);
  --sv-serif:"Cormorant Garamond",Georgia,"Times New Roman",serif;
  --sv-sans:"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
:root[data-theme="dark"]{
  --sv-bg:#1b1b1b;--sv-fg:#f3f1ee;--sv-muted:#b4ada4;--sv-card:#242424;--sv-line:#3a3732;
  --sv-accent:#dec7b1;--sv-accent-fg:#161616;--sv-chip:#2f2c28;--sv-shadow:0 4px 14px rgba(0,0,0,.4);
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--sv-bg);color:var(--sv-fg);font-family:var(--sv-sans);font-size:14px;line-height:1.4}
#root{padding:12px}
.sv-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin:0 2px 10px}
.sv-head h2{font-family:var(--sv-serif);font-weight:700;font-size:20px;margin:0}
.sv-sub{color:var(--sv-muted);font-size:12px}
.sv-row{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 2px 10px}
.sv-card{flex:0 0 260px;scroll-snap-align:start;background:var(--sv-card);border:1px solid var(--sv-line);border-radius:10px;overflow:hidden;box-shadow:var(--sv-shadow);display:flex;flex-direction:column}
.sv-ph{position:relative;height:160px;overflow:hidden;background:var(--sv-chip)}
.sv-ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.sv-badge{position:absolute;left:10px;top:10px;background:#2b2b2b;color:#fff;font-size:11px;font-weight:600;padding:4px 8px;border-radius:6px}
.sv-body{padding:10px 12px 12px;display:flex;flex-direction:column;gap:4px;flex:1}
.sv-title{font-family:var(--sv-serif);font-size:17px;font-weight:700;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:42px}
.sv-loc{color:var(--sv-muted);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sv-price{font-family:var(--sv-serif);font-size:20px;font-weight:700;margin-top:2px}
.sv-meta{display:flex;flex-wrap:wrap;gap:6px;font-size:12px;font-weight:600}
.sv-meta span+span:before{content:"◆";color:var(--sv-sand);margin-right:6px;font-size:8px;vertical-align:middle}
.sv-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:8px}
.sv-btn{appearance:none;border:1px solid var(--sv-accent);background:transparent;color:var(--sv-fg);border-radius:8px;padding:6px 10px;font:600 12px var(--sv-sans);cursor:pointer}
.sv-btn.primary{background:var(--sv-accent);color:var(--sv-accent-fg)}
.sv-btn:focus-visible{outline:2px solid var(--sv-gold);outline-offset:2px}
.sv-empty,.sv-error{border:1px dashed var(--sv-line);border-radius:10px;padding:16px;color:var(--sv-muted)}
.sv-error{border-style:solid;border-color:#c97b6b;color:inherit}
.sv-notes{margin:8px 2px 0;color:var(--sv-muted);font-size:12px}
.sv-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:4px 2px 0}
.sv-detail{background:var(--sv-card);border:1px solid var(--sv-line);border-radius:12px;overflow:hidden}
.sv-gallery{display:flex;gap:4px;overflow-x:auto;scroll-snap-type:x mandatory;height:280px;background:var(--sv-chip)}
.sv-gallery img{flex:0 0 100%;width:100%;height:100%;min-width:0;object-fit:cover;scroll-snap-align:start}
.sv-dbody{padding:12px 14px 14px;display:flex;flex-direction:column;gap:10px}
.sv-dtitle{font-family:var(--sv-serif);font-size:22px;font-weight:700;margin:0}
.sv-facts{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
.sv-fact{background:var(--sv-chip);border-radius:8px;padding:6px 8px}
.sv-fact b{display:block;font-size:11px;color:var(--sv-muted);font-weight:600}
.sv-chips{display:flex;flex-wrap:wrap;gap:6px}
.sv-chips span{background:var(--sv-chip);border-radius:999px;padding:3px 9px;font-size:12px}
.sv-agent{display:flex;align-items:center;justify-content:space-between;gap:8px;border-top:1px solid var(--sv-line);padding-top:10px;flex-wrap:wrap}
.sv-plan{display:flex;gap:6px}
.sv-plan div{flex:1;background:var(--sv-chip);border-radius:8px;padding:8px;text-align:center}
.sv-plan b{display:block;font-family:var(--sv-serif);font-size:20px}
.sv-disc{font-size:11px;color:var(--sv-muted)}
.sv-back{margin-bottom:8px}
`;

/* Browser-side script. Plain JS; all CMS text is inserted via textContent. */
const WIDGET_JS = String.raw`
const SV = globalThis.__savoirMcpApps;
const root = document.getElementById("root");
const COMPANY_WA = "https://wa.me/971505074686";
let app = null;
let lastInput = null;
let history = [];

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = String(text);
  return n;
}
function img(src, alt) {
  const i = document.createElement("img");
  i.src = src; i.alt = alt || ""; i.loading = "lazy"; i.referrerPolicy = "no-referrer";
  i.addEventListener("error", () => { i.style.visibility = "hidden"; });
  return i;
}
function btn(label, onClick, primary) {
  const b = el("button", "sv-btn" + (primary ? " primary" : ""), label);
  b.type = "button";
  b.addEventListener("click", onClick);
  return b;
}
async function openLink(url) {
  if (!/^(https:|mailto:|tel:)/.test(url)) return;
  try {
    if (app) { const r = await app.openLink({ url }); if (!r || !r.isError) return; }
  } catch (e) {}
  if (globalThis.openai && typeof globalThis.openai.openExternal === "function") { globalThis.openai.openExternal({ href: url }); return; }
  window.open(url, "_blank", "noopener,noreferrer");
}
async function ask(textMsg) {
  try {
    if (app) { await app.sendMessage({ role: "user", content: [{ type: "text", text: textMsg }] }); return; }
  } catch (e) {}
  if (globalThis.openai && typeof globalThis.openai.sendFollowUpMessage === "function") globalThis.openai.sendFollowUpMessage({ prompt: textMsg });
}
async function callTool(name, args) {
  if (app) {
    const r = await app.callServerTool({ name, arguments: args });
    return r && r.structuredContent;
  }
  if (globalThis.openai && typeof globalThis.openai.callTool === "function") {
    const r = await globalThis.openai.callTool(name, args);
    return r && r.structuredContent;
  }
  throw new Error("Tool calls are not supported by this host");
}
function waText(url) { return COMPANY_WA + "?text=" + encodeURIComponent("Hello, I'm interested in this property: " + url); }

function badgeFor(p) {
  if (p.completion === "off_plan") return "Off Plan";
  if (p.purpose === "rent") return "For Rent";
  if (p.purpose === "sale") return "For Sale";
  return null;
}

function propertyCard(p) {
  const card = el("article", "sv-card");
  const ph = el("div", "sv-ph");
  if (p.photo) ph.appendChild(img(p.photo, p.title));
  const badge = badgeFor(p);
  if (badge) ph.appendChild(el("span", "sv-badge", badge));
  card.appendChild(ph);
  const body = el("div", "sv-body");
  body.appendChild(el("div", "sv-title", p.title));
  if (p.location && p.location.label) body.appendChild(el("div", "sv-loc", p.location.label));
  body.appendChild(el("div", "sv-price", p.price_label || "Price on request"));
  const meta = el("div", "sv-meta");
  [p.bedrooms_label, p.bathrooms !== null && p.bathrooms !== undefined ? p.bathrooms + " bath" + (p.bathrooms === 1 ? "" : "s") : null, p.property_type]
    .filter(Boolean).forEach((m) => meta.appendChild(el("span", "", m)));
  body.appendChild(meta);
  const actions = el("div", "sv-actions");
  actions.appendChild(btn("Details", () => showPropertyDetail(p.slug), true));
  actions.appendChild(btn("Website", () => openLink(p.url)));
  actions.appendChild(btn("WhatsApp", () => openLink(waText(p.url))));
  body.appendChild(actions);
  card.appendChild(body);
  return card;
}

function offplanCard(p) {
  const card = el("article", "sv-card");
  const ph = el("div", "sv-ph");
  if (p.image) ph.appendChild(img(p.image, p.title));
  ph.appendChild(el("span", "sv-badge", "Off Plan"));
  card.appendChild(ph);
  const body = el("div", "sv-body");
  body.appendChild(el("div", "sv-title", p.title));
  if (p.location) body.appendChild(el("div", "sv-loc", p.location));
  body.appendChild(el("div", "sv-price", p.starting_price_label ? "From " + p.starting_price_label : "Price on request"));
  const meta = el("div", "sv-meta");
  [p.developer, p.handover ? "Handover " + p.handover : null].filter(Boolean).forEach((m) => meta.appendChild(el("span", "", m)));
  body.appendChild(meta);
  const actions = el("div", "sv-actions");
  actions.appendChild(btn("Details", () => showOffplanDetail(p.slug), true));
  actions.appendChild(btn("Website", () => openLink(p.url)));
  actions.appendChild(btn("WhatsApp", () => openLink(waText(p.url))));
  body.appendChild(actions);
  card.appendChild(body);
  return card;
}

function message(cls, text) { const d = el("div", cls, text); return d; }

function header(title, sub) {
  const h = el("div", "sv-head");
  h.appendChild(el("h2", "", title));
  if (sub) h.appendChild(el("span", "sv-sub", sub));
  return h;
}

function backButton() {
  if (!history.length) return null;
  const b = btn("← Back to results", () => { const prev = history.pop(); render(prev, true); });
  b.classList.add("sv-back");
  return b;
}

function renderList(data, kind) {
  const frag = document.createDocumentFragment();
  const pg = data.pagination;
  const sub = pg && pg.total_results ? pg.total_results + " result" + (pg.total_results === 1 ? "" : "s") + (pg.total_pages > 1 ? " · page " + pg.page + " of " + pg.total_pages : "") : "";
  frag.appendChild(header(kind === "offplan" ? "Off-plan projects" : "Savoir listings", sub));
  if (data.status === "error" || data.status === "invalid_input") {
    frag.appendChild(message("sv-error", (data.error && data.error.message) || "The search could not be completed."));
    return frag;
  }
  if (!data.items || !data.items.length) {
    frag.appendChild(message("sv-empty", data.status === "no_results" ? "No listings matched these filters." : "No more results."));
  } else {
    const row = el("div", "sv-row");
    data.items.forEach((p) => row.appendChild(kind === "offplan" ? offplanCard(p) : propertyCard(p)));
    frag.appendChild(row);
  }
  const foot = el("div", "sv-foot");
  foot.appendChild(el("span", "sv-disc", "Prices and availability to be confirmed with Savoir."));
  if (pg && pg.has_more && lastInput) {
    foot.appendChild(btn("More results", async (ev) => {
      ev.currentTarget.disabled = true;
      try {
        const args = Object.assign({}, lastInput, { page: pg.page + 1 });
        const next = await callTool(kind === "offplan" ? "search_offplan_projects" : "search_properties", args);
        if (next) { lastInput = args; render(next); }
      } catch (e) { ask("Show more results (page " + (pg.page + 1) + ")"); }
    }));
  }
  frag.appendChild(foot);
  if (data.notes && data.notes.length) frag.appendChild(el("div", "sv-notes", data.notes.join(" ")));
  return frag;
}

function fact(label, value) {
  if (value === null || value === undefined || value === "") return null;
  const f = el("div", "sv-fact"); f.appendChild(el("b", "", label)); f.appendChild(document.createTextNode(String(value))); return f;
}

function renderPropertyDetail(data) {
  const frag = document.createDocumentFragment();
  const back = backButton(); if (back) frag.appendChild(back);
  const p = data.property;
  if (!p) { frag.appendChild(message(data.status === "not_found" ? "sv-empty" : "sv-error", (data.error && data.error.message) || "Listing unavailable.")); return frag; }
  const box = el("div", "sv-detail");
  if (p.photos && p.photos.length) { const g = el("div", "sv-gallery"); p.photos.forEach((u) => g.appendChild(img(u, p.title))); box.appendChild(g); }
  const body = el("div", "sv-dbody");
  body.appendChild(el("h2", "sv-dtitle", p.title));
  if (p.location && p.location.label) body.appendChild(el("div", "sv-loc", [p.building, p.location.label].filter(Boolean).join(", ")));
  body.appendChild(el("div", "sv-price", p.price_label || "Price on request"));
  const facts = el("div", "sv-facts");
  [fact("Status", badgeFor(p)), fact("Type", p.property_type), fact("Bedrooms", p.bedrooms_label), fact("Bathrooms", p.bathrooms),
   fact("Size", p.size_sqft ? new Intl.NumberFormat("en-US").format(p.size_sqft) + " sq ft" : null), fact("Reference", p.reference_number), fact("Permit", p.permit_number)]
    .filter(Boolean).forEach((f) => facts.appendChild(f));
  body.appendChild(facts);
  if (p.amenities && p.amenities.length) { const c = el("div", "sv-chips"); p.amenities.forEach((a) => c.appendChild(el("span", "", a))); body.appendChild(c); }
  const agent = el("div", "sv-agent");
  agent.appendChild(el("div", "", p.agent ? "Agent: " + p.agent.name : "Savoir Properties"));
  const acts = el("div", "sv-actions");
  acts.appendChild(btn("View on website", () => openLink(p.url), true));
  const wa = p.agent && p.agent.phone ? "https://wa.me/" + p.agent.phone.replace(/\D/g, "") + "?text=" + encodeURIComponent("Hello, I'm interested in this property: " + p.url) : waText(p.url);
  acts.appendChild(btn("WhatsApp", () => openLink(wa)));
  if (p.agent && p.agent.email) acts.appendChild(btn("Email", () => openLink("mailto:" + p.agent.email + "?subject=" + encodeURIComponent("Inquiry: " + p.title) + "&body=" + encodeURIComponent(p.url))));
  acts.appendChild(btn("Ask Savoir", () => ask("I'd like to send an inquiry to Savoir about \"" + p.title + "\" (property slug " + p.slug + ").")));
  agent.appendChild(acts);
  body.appendChild(agent);
  body.appendChild(el("div", "sv-disc", "Prices and availability to be confirmed with Savoir. A viewing is only arranged once a Savoir consultant confirms it."));
  box.appendChild(body);
  frag.appendChild(box);
  if (p.similar_properties && p.similar_properties.length) {
    frag.appendChild(header("Similar listings"));
    const row = el("div", "sv-row"); p.similar_properties.forEach((s) => row.appendChild(propertyCard(s))); frag.appendChild(row);
  }
  return frag;
}

function renderOffplanDetail(data) {
  const frag = document.createDocumentFragment();
  const back = backButton(); if (back) frag.appendChild(back);
  const p = data.project;
  if (!p) { frag.appendChild(message(data.status === "not_found" ? "sv-empty" : "sv-error", (data.error && data.error.message) || "Project unavailable.")); return frag; }
  const box = el("div", "sv-detail");
  if (p.images && p.images.length) { const g = el("div", "sv-gallery"); p.images.forEach((u) => g.appendChild(img(u, p.title))); box.appendChild(g); }
  const body = el("div", "sv-dbody");
  body.appendChild(el("h2", "sv-dtitle", p.title));
  if (p.location) body.appendChild(el("div", "sv-loc", p.location));
  body.appendChild(el("div", "sv-price", p.starting_price_label ? "From " + p.starting_price_label : "Price on request"));
  const facts = el("div", "sv-facts");
  [fact("Developer", p.developer), fact("Handover", p.handover), fact("Area", p.area), fact("Unit sizes", p.unit_sizes), fact("Title", p.title_type)]
    .filter(Boolean).forEach((f) => facts.appendChild(f));
  body.appendChild(facts);
  if (p.payment_plan) {
    const plan = el("div", "sv-plan");
    [["Down payment", p.payment_plan.down_payment], ["During construction", p.payment_plan.during_construction], ["On handover", p.payment_plan.on_handover]]
      .filter((x) => x[1]).forEach((x) => { const d = el("div"); d.appendChild(el("b", "", x[1])); d.appendChild(document.createTextNode(x[0])); plan.appendChild(d); });
    body.appendChild(plan);
  }
  if (p.amenities && p.amenities.length) { const c = el("div", "sv-chips"); p.amenities.forEach((a) => c.appendChild(el("span", "", a))); body.appendChild(c); }
  const acts = el("div", "sv-actions");
  acts.appendChild(btn("View on website", () => openLink(p.url), true));
  acts.appendChild(btn("WhatsApp", () => openLink(waText(p.url))));
  if (p.video_url) acts.appendChild(btn("Video", () => openLink(p.video_url)));
  acts.appendChild(btn("Ask Savoir", () => ask("I'd like to send an inquiry to Savoir about the off-plan project \"" + p.title + "\" (slug " + p.slug + ").")));
  body.appendChild(acts);
  body.appendChild(el("div", "sv-disc", "Off-plan details are as published and may change."));
  box.appendChild(body);
  frag.appendChild(box);
  return frag;
}

let current = null;
function render(data, fromHistory) {
  if (!data || typeof data !== "object" || !data.view) return;
  if (!fromHistory && current && (data.view === "property_detail" || data.view === "offplan_detail") && (current.view === "property_list" || current.view === "offplan_list" || current.view === "property_detail")) {
    history.push(current);
  }
  current = data;
  let frag;
  if (data.view === "property_list") frag = renderList(data, "property");
  else if (data.view === "offplan_list") frag = renderList(data, "offplan");
  else if (data.view === "property_detail") frag = renderPropertyDetail(data);
  else if (data.view === "offplan_detail") frag = renderOffplanDetail(data);
  else return;
  root.replaceChildren(frag);
}

async function showPropertyDetail(slug) {
  try { const d = await callTool("get_property_details", { slug }); if (d) render(d); }
  catch (e) { ask("Show me the details of Savoir property " + slug); }
}
async function showOffplanDetail(slug) {
  try { const d = await callTool("get_offplan_project_details", { slug }); if (d) render(d); }
  catch (e) { ask("Show me the details of the off-plan project " + slug); }
}

function applyTheme(ctx) {
  const theme = ctx && ctx.theme;
  if (theme === "dark" || theme === "light") document.documentElement.setAttribute("data-theme", theme);
  try { if (ctx && ctx.styles && ctx.styles.variables && SV && SV.applyHostStyleVariables) SV.applyHostStyleVariables(ctx.styles.variables); } catch (e) {}
}

async function start() {
  // ChatGPT's window.openai bridge (compatibility path): render immediately if data is already there.
  const oa = globalThis.openai;
  if (oa) {
    lastInput = oa.toolInput || null;
    if (oa.theme) applyTheme({ theme: oa.theme });
    if (oa.toolOutput) render(oa.toolOutput);
    window.addEventListener("openai:set_globals", () => { if (globalThis.openai && globalThis.openai.toolOutput) render(globalThis.openai.toolOutput); });
  }
  // MCP Apps standard bridge. Handlers are set before connect so no notification is missed.
  if (SV && SV.App) {
    const candidate = new SV.App({ name: "savoir-listings", version: "1.0.0" }, {}, { autoResize: true });
    candidate.ontoolinput = (p) => { lastInput = (p && p.arguments) || null; };
    candidate.ontoolresult = (r) => { history = []; render(r && r.structuredContent); };
    candidate.onhostcontextchanged = (ctx) => applyTheme(ctx);
    try {
      await Promise.race([candidate.connect(), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000))]);
      app = candidate;
      applyTheme(app.getHostContext());
    } catch (e) {
      if (!current) root.replaceChildren(el("div", "sv-empty", "Open the results in the chat to see listing details."));
    }
  }
}
start();
`;
