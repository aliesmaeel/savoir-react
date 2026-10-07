// Savoir Properties listing cards (MCP Apps UI). Plain ES module, no dependencies.
// Security: every CMS/user string is inserted with textContent (never innerHTML).
const SV = globalThis.__savoirMcpApps;
const I18N = JSON.parse(document.getElementById("sv-i18n").textContent);
const CFG = JSON.parse(document.getElementById("sv-config").textContent);
const root = document.getElementById("root");
const live = document.getElementById("sv-live");

const state = {
  app: null,
  caps: {},
  lang: "en",
  shortlistId: null,
  saved: new Set(), // "kind:slug"
  compare: [], // [{kind, slug, title}]
  lastSearch: null, // last search_properties / search_offplan_projects / get_area_guide input
  current: null,
  history: [],
  notice: null, // visible status bar {msg, kind, action, until}
  linkPanel: null, // {url, code} when no host API could open a link
  lastError: null, // short code of the last failed host request
  // Navigation lifecycle. A card is bound to one tool result (its origin). Hosts may deliver that result
  // again at any time (ChatGPT's openai:set_globals can carry a full snapshot whose toolOutput is a
  // re-serialised copy), so results are compared by content, and once the customer has opened another
  // view, host deliveries never replace it.
  seenResults: new Set(), // canonical keys of every tool result the host delivered
  originKey: null, // canonical key of the card's own tool result
  userNavigated: false, // the customer opened a view from a button
  lastCall: null, // {name, args} of the last successful card tool call
  navCalls: [], // restorable call per history entry (null when not restorable), parallel to state.history
  // Map view (results only).
  viewMode: "list", // "list" | "map"
  fullMap: false,
  mapSel: null, // "kind:slug" selected on the map / in the cards
  mapArea: null, // area selected on the map
  mapInst: null,
  mapView: null, // last centre/zoom per result, so redraws keep the customer's view
  pendingMap: null,
  mapFailed: null,
  nav: null, // the restorable call behind the current view (saved in widget state for card reloads)
};
// Views that can be reopened by calling their tool again after the host reloads the card. Messages
// (new reference code) and shortlist writes are not repeated automatically.
const RESTORABLE = new Set(["get_property_details", "get_offplan_project_details", "compare_listings", "get_shortlist", "search_properties", "search_offplan_projects", "get_area_guide"]);
/** Order-independent identity of a JSON value. */
function canonical(v) {
  if (Array.isArray(v)) return "[" + v.map(canonical).join(",") + "]";
  if (v && typeof v === "object") return "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + canonical(v[k])).join(",") + "}";
  return JSON.stringify(v === undefined ? null : v);
}
/**
 * Identity of a tool result for host re-deliveries: the view and what it shows (listings, page,
 * shortlist and share link, message reference). Re-serialised copies of the same result - reordered,
 * with fields added or dropped - share this identity; a genuinely new result does not.
 */
function resultIdentity(sc) {
  const slugs = (list) => (Array.isArray(list) ? list.map((i) => i && (i.slug || (i.property && i.property.slug) || (i.project && i.project.slug))) : []);
  const id = { view: sc.view || null, status: sc.status || null };
  switch (sc.view) {
    case "property_list":
    case "offplan_list":
      id.items = slugs(sc.items);
      id.page = sc.pagination ? sc.pagination.page : null;
      id.alternatives = Array.isArray(sc.alternatives) ? sc.alternatives.map((a) => a && a.kind) : [];
      break;
    case "property_detail":
      id.slug = sc.property ? sc.property.slug : null;
      break;
    case "offplan_detail":
      id.slug = sc.project ? sc.project.slug : null;
      id.schedule = sc.payment_schedule ? sc.payment_schedule.stages.map((s) => s.amount_aed) : null;
      break;
    case "compare":
      id.items = slugs(sc.items);
      break;
    case "shortlist":
      id.shortlist = sc.shortlist ? sc.shortlist.shortlist_id : null;
      id.items = sc.shortlist ? slugs(sc.shortlist.items) : [];
      id.share = sc.shortlist ? sc.shortlist.share_url || null : null;
      break;
    case "inquiry":
      id.ref = sc.handoff ? sc.handoff.reference_code : null;
      break;
    case "area_guide":
      id.areas = sc.guide && Array.isArray(sc.guide.areas) ? sc.guide.areas.map((a) => a.area) : [];
      break;
    default:
      return canonical(sc);
  }
  return canonical(id);
}
function shortHash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

// ---------- i18n & formatting ----------
function t(key, vars) {
  let s = (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
  if (vars) for (const k of Object.keys(vars)) s = s.split("{" + k + "}").join(String(vars[k]));
  return s;
}
function setLocale(loc) {
  const l = String(loc || "").toLowerCase();
  state.lang = l.startsWith("ar") ? "ar" : "en";
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
}
function nf() {
  return new Intl.NumberFormat(state.lang === "ar" ? "ar-AE-u-nu-latn" : "en-AE", { maximumFractionDigits: 0 });
}
function aed(n) {
  return n === null || n === undefined ? null : "AED " + nf().format(n);
}
function when(iso) {
  try {
    return new Intl.DateTimeFormat(state.lang === "ar" ? "ar-AE-u-nu-latn" : "en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dubai" }).format(new Date(iso));
  } catch (e) {
    return iso;
  }
}
/** Property type in the UI language (CMS labels are English). */
function typeLabel(s) {
  if (!s) return s;
  const map = I18N[state.lang] && I18N[state.lang].types;
  return (map && map[s]) || s;
}
function bedsLabel(n) {
  if (n === null || n === undefined) return null;
  return n === 0 ? t("studio") : t("beds", { n: n });
}

// ---------- DOM helpers ----------
function h(tag, attrs) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const k of Object.keys(attrs)) {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = String(v);
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : String(v));
    }
  }
  for (let i = 2; i < arguments.length; i++) {
    const c = arguments[i];
    if (c === null || c === undefined || c === false) continue;
    if (Array.isArray(c)) c.forEach((x) => x && el.appendChild(x));
    else el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return el;
}
function img(src, alt) {
  if (!src) return null;
  const i = h("img", { src: src, alt: alt || "", loading: "lazy", referrerpolicy: "no-referrer" });
  i.addEventListener("error", () => (i.style.visibility = "hidden"));
  return i;
}
function btn(label, onClick, opts) {
  opts = opts || {};
  const cls = "sv-btn" + (opts.primary ? " primary" : "") + (opts.ghost ? " ghost" : "") + (opts.danger ? " danger" : "") + (opts.small ? " small" : "") + (opts.grow ? " grow" : "");
  return h("button", { type: "button", class: cls, "aria-label": opts.aria || null, disabled: opts.disabled || null, onclick: onClick }, label);
}
function announce(msg) {
  live.textContent = "";
  setTimeout(() => (live.textContent = msg), 30);
}
const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.2C.8 8.3 3 4.5 6.7 4.5c2 0 3.5 1.1 4.3 2.4.8-1.3 2.3-2.4 4.3-2.4 3.7 0 5.9 3.8 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>';
const HEART_O = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 20s-7-4.3-9-8.6C1.6 8.3 3.6 5.5 6.7 5.5c1.9 0 3.4 1.1 4.2 2.6h2.2c.8-1.5 2.3-2.6 4.2-2.6 3.1 0 5.1 2.8 3.7 5.9C19 15.7 12 20 12 20z"/></svg>';


// ---------- host bridge ----------
// Every host request is time-limited and checked: a host that refuses or ignores a request must
// never leave a button doing nothing. Failures end in a visible message (see notice / linkPanel).
function withTimeout(p, ms, code) {
  return Promise.race([Promise.resolve(p), new Promise((_, reject) => setTimeout(() => reject(new Error(code)), ms))]);
}
function openaiApi(fn) {
  const o = globalThis.openai;
  return o && typeof o[fn] === "function" ? o : null;
}
function hostCan(cap) {
  return !!(state.app && state.caps && state.caps[cap]);
}
function errCode(e) {
  return String((e && e.message) || "failed").replace(/[^a-z0-9-]/gi, "-").slice(0, 40);
}
/** Open an external link. Returns true when a host API accepted it; otherwise shows the link to copy. */
async function openLink(url) {
  // https only (plus local development servers); mailto/tel for contact buttons.
  if (!/^(https:|mailto:|tel:|http:\/\/(127\.0\.0\.1|localhost)[:/])/.test(url)) return false;
  const tried = [];
  // ChatGPT: window.openai.openExternal (called first, while the click still counts as a user gesture).
  const o = openaiApi("openExternal");
  if (o) {
    try {
      await withTimeout(o.openExternal({ href: url }), 4000, "openExternal-timeout");
      return true;
    } catch (e) {
      tried.push(errCode(e));
    }
  }
  // MCP Apps standard: ui/open-link.
  if (state.app) {
    try {
      const r = await withTimeout(state.app.openLink({ url: url }), hostCan("openLinks") ? 5000 : 2500, "open-link-timeout");
      if (!r || !r.isError) return true;
      tried.push("open-link-refused");
    } catch (e) {
      tried.push(errCode(e));
    }
  }
  // Last resort: a plain popup (blocked in most sandboxed hosts; window.open then returns null).
  try {
    const w = window.open(url, "_blank");
    if (w) {
      try { w.opener = null; } catch (e) {}
      return true;
    }
    tried.push("popup-blocked");
  } catch (e) {
    tried.push("popup-error");
  }
  showLinkPanel(url, tried.join(","));
  return false;
}
/** Post a follow-up message as the customer. Returns true only when the host accepted it. */
async function sendMessage(text) {
  if (state.app) {
    try {
      const r = await withTimeout(state.app.sendMessage({ role: "user", content: [{ type: "text", text: text }] }), hostCan("message") ? 5000 : 2500, "message-timeout");
      if (!r || !r.isError) return true;
    } catch (e) {}
  }
  const o = openaiApi("sendFollowUpMessage");
  if (o) {
    try {
      await withTimeout(o.sendFollowUpMessage({ prompt: text }), 5000, "followup-timeout");
      return true;
    } catch (e) {}
  }
  return false;
}
/** Ask the assistant to do something the card itself cannot, and say truthfully whether that worked. */
async function askAssistant(text) {
  const ok = await sendMessage(text);
  notice(ok ? t("askedChat") : t("notAvailableHost"), ok ? "ok" : "error");
  return ok;
}
function canCallTools() {
  return !!state.app || !!openaiApi("callTool");
}
async function rawCall(name, args) {
  let firstError = null;
  if (state.app) {
    try {
      return await withTimeout(state.app.callServerTool({ name: name, arguments: args }), hostCan("serverTools") ? 30000 : 10000, "tools-call-timeout");
    } catch (e) {
      firstError = e;
    }
  }
  const o = openaiApi("callTool");
  if (o) return withTimeout(o.callTool(name, args), 30000, "openai-callTool-timeout");
  throw firstError || new Error("no-tool-bridge");
}
/** Call a server tool with a loading state; renders a retryable error on failure. */
async function callTool(name, args, opts) {
  opts = opts || {};
  if (!canCallTools()) {
    if (opts.fallbackMessage) await askAssistant(opts.fallbackMessage);
    else notice(t("notAvailableHost"), "error");
    return null;
  }
  root.setAttribute("data-loading", t("loading"));
  root.classList.add("sv-loading");
  root.setAttribute("aria-busy", "true");
  try {
    const r = await rawCall(name, args);
    const sc = r && r.structuredContent;
    if (!sc) throw new Error(r && r.isError ? "tool-error" : "empty-result");
    ingest(sc);
    state.lastCall = { name: name, args: args };
    // A success supersedes an earlier error message.
    if (state.notice && state.notice.kind === "error") {
      state.notice = null;
      const el = document.getElementById("sv-notice");
      if (el) el.remove();
    }
    return sc;
  } catch (e) {
    state.lastError = errCode(e);
    if (!opts.silentError) notice(t("error") + " (" + state.lastError + ")", "error", { label: t("retry"), fn: () => callTool(name, args, opts).then((sc) => sc && opts.render !== false && navigate(sc, opts.push)) });
    return null;
  } finally {
    root.classList.remove("sv-loading");
    root.removeAttribute("aria-busy");
  }
}
/** Shown when no host API could open a link: the customer can still copy it. Stays until dismissed. */
function showLinkPanel(url, code) {
  state.linkPanel = { url: url, code: code };
  if (state.current) rerender();
  else placeNotice();
}
function linkPanelNode() {
  const p = state.linkPanel;
  if (!p) return null;
  const input = h("input", { id: "sv-link-fallback", type: "text", readonly: true, value: p.url, "aria-label": t("linkBlocked") });
  return h(
    "div",
    { id: "sv-linkpanel", class: "sv-notice error", role: "alert" },
    h("span", { text: t("linkBlocked") + " (" + p.code + ")" }),
    h("div", { class: "sv-share", style: "flex:1 1 100%" }, input, btn(t("copyLink"), () => copyWithFeedback(p.url, input), { small: true, primary: true }), btn(t("dismiss"), () => {
      state.linkPanel = null;
      rerender();
    }, { small: true, ghost: true })),
  );
}
/** Visible status bar (success or error) that survives re-renders for a few seconds. */
function notice(msg, kind, action) {
  state.notice = { msg: msg, kind: kind || "ok", action: action || null, until: Date.now() + 8000 };
  announce(msg);
  if (state.current) rerender();
  else placeNotice();
  setTimeout(() => {
    if (state.notice && state.notice.until <= Date.now()) {
      state.notice = null;
      const el = document.getElementById("sv-notice");
      if (el) el.remove();
    }
  }, 8100);
}
function noticeNode() {
  const n = state.notice;
  if (!n || n.until <= Date.now()) return null;
  return h("div", { id: "sv-notice", class: "sv-notice " + n.kind, role: n.kind === "error" ? "alert" : "status" }, h("span", { text: n.msg }), n.action ? btn(n.action.label, n.action.fn, { small: true }) : null);
}
function placeNotice() {
  for (const id of ["sv-notice", "sv-linkpanel"]) {
    const old = document.getElementById(id);
    if (old) old.remove();
  }
  const node = noticeNode();
  if (node) root.prepend(node);
  const panel = linkPanelNode();
  if (panel) root.prepend(panel);
}
/** Copy text; returns true only if the browser confirmed the copy. */
async function copyText(text, inputEl) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {}
  try {
    if (inputEl) {
      inputEl.focus();
      inputEl.select();
      return document.execCommand("copy") === true;
    }
  } catch (e) {}
  return false;
}
async function copyWithFeedback(text, inputEl) {
  if (await copyText(text, inputEl)) return notice(t("copied"), "ok");
  notice(t("copyFailed"), "error");
  const again = inputEl && inputEl.id ? document.getElementById(inputEl.id) : null;
  if (again) {
    again.focus();
    again.select();
  }
}
function updateModelContext() {
  if (!state.app || !state.caps.updateModelContext) return;
  const lines = [];
  if (state.shortlistId) lines.push("The customer's shortlist_id is " + state.shortlistId + " (" + state.saved.size + " saved). Pass it to Savoir tools to keep using this shortlist.");
  if (state.compare.length) lines.push("Selected for comparison in the cards: " + state.compare.map((c) => c.title + " (" + c.kind + " " + c.slug + ")").join("; ") + ".");
  if (!lines.length) return;
  state.app.updateModelContext({ content: [{ type: "text", text: lines.join("\n") }] }).catch(() => {});
}
function persist() {
  const oa = globalThis.openai;
  if (oa && typeof oa.setWidgetState === "function") {
    try {
      oa.setWidgetState({ shortlistId: state.shortlistId, compare: state.compare, nav: state.nav, origin: state.originKey ? shortHash(state.originKey) : null });
    } catch (e) {}
  }
}

// ---------- state from tool results ----------
function ingest(sc) {
  if (!sc) return;
  if (sc.shortlist_id) state.shortlistId = sc.shortlist_id;
  if (sc.view === "shortlist" && sc.shortlist) {
    state.shortlistId = sc.shortlist.shortlist_id;
    state.saved = new Set(sc.shortlist.items.map((i) => i.kind + ":" + i.slug));
  }
  if (sc.view === "shortlist" && sc.status === "ok" && sc.deleted) {
    state.shortlistId = null;
    state.saved = new Set();
  }
  const mark = (kind, list) => (list || []).forEach((i) => i.saved && state.saved.add(kind + ":" + i.slug));
  if (sc.view === "property_list") mark("property", sc.items);
  if (sc.view === "offplan_list") mark("offplan", sc.items);
  if (sc.view === "property_detail" && sc.saved && sc.property) state.saved.add("property:" + sc.property.slug);
  if (sc.view === "offplan_detail" && sc.saved && sc.project) state.saved.add("offplan:" + sc.project.slug);
}

function requirementsFromSearch() {
  const s = state.lastSearch;
  if (!s) return undefined;
  const r = {};
  if (s.purpose) r.purpose = s.purpose;
  if (typeof s.max_price_aed === "number") r.budget_max_aed = s.max_price_aed;
  if (typeof s.min_price_aed === "number") r.budget_min_aed = s.min_price_aed;
  if (typeof s.budget_max_aed === "number") r.budget_max_aed = s.budget_max_aed;
  if (s.bedrooms === "studio") r.bedrooms = 0;
  else if (typeof s.bedrooms === "number") r.bedrooms = s.bedrooms;
  if (Array.isArray(s.areas) && s.areas.length) r.areas = s.areas;
  if (s.completion) r.completion = s.completion;
  if (Array.isArray(s.must_have) && s.must_have.length) r.must_have = s.must_have;
  return Object.keys(r).length ? r : undefined;
}

// ---------- actions ----------
async function toggleSave(ref, btnEl, retried) {
  const key = ref.kind + ":" + ref.slug;
  const wasSaved = state.saved.has(key);
  const args = { add: wasSaved ? undefined : [{ kind: ref.kind, slug: ref.slug }], remove: wasSaved ? [{ kind: ref.kind, slug: ref.slug }] : undefined };
  if (state.shortlistId) args.shortlist_id = state.shortlistId;
  if (!canCallTools()) {
    // The host cannot run tools from the card: ask the assistant instead, and claim nothing more.
    await askAssistant((wasSaved ? "Remove from my shortlist: " : "Save to my shortlist: ") + ref.title + " (" + ref.kind + " " + ref.slug + ")");
    return;
  }
  const sc = await callTool("update_shortlist", args, { render: false, silentError: true });
  const retry = { label: t("retry"), fn: () => toggleSave(ref, btnEl) };
  if (!sc) return notice((wasSaved ? t("removeFailed") : t("saveFailed")) + " (" + (state.lastError || "failed") + ")", "error", retry);
  if (sc.status === "not_found" && !retried) {
    // The previous shortlist expired or was deleted: start a new one, and say so.
    state.shortlistId = null;
    state.saved = new Set();
    await toggleSave(ref, btnEl, true);
    if (state.saved.has(key)) notice(t("savedTo") + " " + t("expiredNew"), "ok", { label: t("viewList"), fn: openShortlist });
    return;
  }
  const change = sc.change || { added: [], removed: [] };
  const confirmed = sc.status === "ok" && (wasSaved ? change.removed.indexOf(ref.slug) >= 0 : change.added.indexOf(ref.slug) >= 0);
  if (!confirmed) {
    const why = sc.status === "ok" && sc.rejected && sc.rejected.indexOf(ref.slug) >= 0 ? t("notSavedWhy") : (sc.error && sc.error.message) || "";
    return notice((wasSaved ? t("removeFailed") : t("saveFailed")) + (why ? " " + why : ""), "error", retry);
  }
  updateModelContext();
  persist();
  if (state.current && state.current.view === "shortlist") state.current = Object.assign({}, sc, { change: undefined });
  if (!retried) notice(wasSaved ? t("removedFrom") : t("savedTo"), "ok", { label: t("viewList"), fn: openShortlist });
}
function toggleCompare(ref, checked) {
  const key = ref.kind + ":" + ref.slug;
  state.compare = state.compare.filter((c) => c.kind + ":" + c.slug !== key);
  if (checked) {
    if (state.compare.length >= 4) state.compare.shift();
    state.compare.push(ref);
  }
  updateModelContext();
  persist();
  rerender();
}
async function openCompare(items) {
  const sc = await callTool("compare_listings", { items: items.map((c) => ({ kind: c.kind, slug: c.slug })), requirements: requirementsFromSearch() }, { fallbackMessage: "Compare these listings: " + items.map((c) => c.title + " (" + c.slug + ")").join(", ") });
  if (sc) navigate(sc, true);
}
async function prepareMessage(refs) {
  const sc = await callTool(
    "prepare_inquiry",
    { listings: refs.map((r) => ({ kind: r.kind, slug: r.slug })), requirements: requirementsFromSearch(), language: state.lang },
    { fallbackMessage: "Prepare a message to Savoir about: " + refs.map((r) => r.title).join(", ") },
  );
  if (sc) navigate(sc, true);
}
async function openDetail(kind, slug, title) {
  const name = kind === "offplan" ? "get_offplan_project_details" : "get_property_details";
  const args = { slug: slug };
  if (state.shortlistId) args.shortlist_id = state.shortlistId;
  const sc = await callTool(name, args, { fallbackMessage: "Show me the details of " + title + " (" + slug + ")" });
  if (sc) navigate(sc, true);
}
async function openShortlist() {
  if (!state.shortlistId) return notice(t("shortlistEmpty"), "ok");
  const sc = await callTool("get_shortlist", { shortlist_id: state.shortlistId });
  if (sc) navigate(sc, true);
}
async function runSearch(tool, args) {
  state.lastSearch = args;
  const sc = await callTool(tool, args, { fallbackMessage: "Search Savoir listings: " + JSON.stringify(args) });
  if (sc) navigate(sc, true);
}

// ---------- navigation ----------
function navigate(sc, push) {
  const previous = state.current;
  const call = state.lastCall && RESTORABLE.has(state.lastCall.name) ? state.lastCall : null;
  state.lastCall = null;
  state.userNavigated = true;
  // History first: the new view's Back button depends on it.
  const pushed = !!(push && previous);
  const prevNav = state.nav;
  if (pushed) {
    state.history.push(previous);
    state.navCalls.push(prevNav);
    if (state.history.length > 10) {
      state.history.shift();
      state.navCalls.shift();
    }
  }
  try {
    state.current = sc;
    render(sc);
  } catch (e) {
    // Never leave the customer on a half-drawn or silently unchanged card.
    if (pushed) {
      state.history.pop();
      state.navCalls.pop();
    }
    state.current = previous;
    if (previous) render(previous);
    notice(t("navFailed") + " (render-error)", "error");
    return;
  }
  if (call) state.nav = call; // otherwise (message view, in-place updates) keep the last restorable view
  persist();
  scrollToTop();
}
function scrollToTop() {
  try {
    window.scrollTo({ top: 0, behavior: "auto" });
    root.scrollIntoView({ block: "start" });
  } catch (e) {}
}
function rerender() {
  if (state.current) render(state.current);
}
function backButton() {
  if (!state.history.length) return null;
  return btn((state.lang === "ar" ? "→ " : "← ") + t("back"), () => {
    state.current = state.history.pop();
    state.nav = state.navCalls.pop() || null;
    render(state.current);
    persist();
    scrollToTop();
  }, { small: true, ghost: true, aria: "← " + t("back") });
}
/** Small heart icon built with DOM calls (static path data, no markup strings). */
function heartSvg(filled) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", "M12 20s-7-4.3-9-8.6C1.6 8.3 3.6 5.5 6.7 5.5c1.9 0 3.4 1.1 4.2 2.6h2.2c.8-1.5 2.3-2.6 4.2-2.6 3.1 0 5.1 2.8 3.7 5.9C19 15.7 12 20 12 20z");
  path.setAttribute("fill", filled ? "currentColor" : "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  svg.appendChild(path);
  return svg;
}
function myShortlistButton() {
  const n = state.shortlistId ? state.saved.size : 0;
  const b = h("button", { type: "button", class: "sv-pill sv-mylist", onclick: openShortlist });
  b.append(heartSvg(n > 0), document.createTextNode(t("viewShortlist", { n: n })));
  return b;
}
/** View header: Back, a short title, and the always-visible "My shortlist (n)" control. */
function header(title, sub, opts) {
  opts = opts || {};
  return h(
    "header",
    { class: "sv-hd" },
    h("div", { class: "sv-hd-l" }, backButton(), title ? h("div", { class: "sv-hd-t" }, h("h1", { text: title }), sub ? h("p", { text: sub }) : null) : null),
    opts.noShortlist ? null : myShortlistButton(),
  );
}
/** Quiet footer: the Savoir wordmark plus data freshness. */
function footer(iso, extra) {
  const plate = h("span", { class: "sv-brand" }, h("img", { src: CFG.logoUrl, alt: "Savoir Properties", onerror: () => (plate.hidden = true) }));
  return h("footer", { class: "sv-ft" }, plate, h("span", { class: "sv-ft-t", text: (iso ? t("asOf", { t: when(iso) }) + " · " : "") + t("disclaimer") }), extra || null);
}
/** CMS titles use " | " as a separator; show them as readable text. */
function cleanTitle(s) {
  return String(s || "").replace(/\s*\|\s*/g, " · ").replace(/\s+/g, " ").trim();
}
function disclosure(label, body, open) {
  return h("details", { class: "sv-disc", open: open || null }, h("summary", { text: label }), h("div", { class: "sv-disc-body" }, body));
}
function dl(pairs) {
  return h("dl", { class: "sv-dl" }, pairs.filter(Boolean).map((p) => h("div", null, h("dt", { text: p[0] }), h("dd", { text: p[1] === null || p[1] === undefined || p[1] === "" ? t("na") : String(p[1]) }))));
}
function errorBox(d) {
  return h("div", { class: "sv-error", role: "alert" }, h("span", { text: (d.error && d.error.message) || t("error") }));
}

// ---------- components ----------
function purposeLabel(p) {
  return p.purpose === "rent" ? t("forRent") : p.purpose === "sale" ? t("forSale") : null;
}
function completionLabel(p) {
  return p.completion === "off_plan" ? t("offPlan") : p.completion === "ready" ? t("ready") : null;
}
/** Listing status shown in results, details and comparison, e.g. "For sale · Ready". */
function badgeFor(p) {
  return [purposeLabel(p), completionLabel(p)].filter(Boolean).join(" · ") || null;
}
function heart(ref) {
  const saved = state.saved.has(ref.kind + ":" + ref.slug);
  const b = h("button", { type: "button", class: "sv-heart", "aria-pressed": saved ? "true" : "false", "aria-label": (saved ? t("unsave") : t("save")) + ": " + ref.title });
  b.innerHTML = saved ? HEART : HEART_O; // static SVG markup, no data
  b.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSave(ref, b);
  });
  return b;
}
/** Save toggle for detail views (same action as the card heart). */
function saveButton(ref) {
  const saved = state.saved.has(ref.kind + ":" + ref.slug);
  const b = h("button", { type: "button", class: "sv-btn", "aria-pressed": saved ? "true" : "false", "aria-label": (saved ? t("unsave") : t("save")) + ": " + ref.title, onclick: () => toggleSave(ref) });
  const icon = heartSvg(saved);
  if (saved) icon.style.color = "var(--sv-heart)";
  b.append(icon, document.createTextNode(saved ? t("savedShort") : t("saveShort")));
  return b;
}
function compareCheck(ref) {
  const checked = state.compare.some((c) => c.kind === ref.kind && c.slug === ref.slug);
  const input = h("input", { type: "checkbox", checked: checked || null, "aria-label": t("compare") + ": " + ref.title });
  input.addEventListener("change", () => toggleCompare(ref, input.checked));
  return h("label", { class: "sv-chk" }, input, t("compare"));
}
function waFor(url) {
  return CFG.companyWa + "?text=" + encodeURIComponent((state.lang === "ar" ? "مرحباً، أرغب في الاستفسار عن هذا العقار: " : "Hello, I'm interested in this property: ") + url);
}
function card(o) {
  return h(
    "article",
    { class: "sv-card" + (o.selected ? " selected" : "") + (state.mapSel === o.ref.kind + ":" + o.ref.slug ? " mapsel" : ""), "aria-label": o.title, "data-key": o.ref.kind + ":" + o.ref.slug },
    h("div", { class: "sv-ph" }, img(o.photo, o.title), o.badge ? h("span", { class: "sv-badge", text: o.badge }) : null, heart(o.ref)),
    h(
      "div",
      { class: "sv-body" },
      h("div", { class: "sv-price", text: o.price }),
      h("div", { class: "sv-title", dir: "auto", text: cleanTitle(o.title), title: o.title }),
      o.loc ? h("div", { class: "sv-loc", dir: "auto", text: o.loc }) : null,
      o.meta ? h("div", { class: "sv-meta", text: o.meta }) : null,
      o.chips || null,
      o.flag ? h("div", { class: "sv-flag", text: o.flag }) : null,
      h("div", { class: "sv-card-actions" }, btn(t("details"), o.onDetails, { primary: true, grow: true, aria: t("details") + ": " + o.title }), btn(t("whatsapp"), o.onWa, { aria: t("whatsapp") + ": " + o.title })),
      h(
        "div",
        { class: "sv-card-sub" },
        compareCheck(o.ref),
        mapEnabled() ? (o.mapPoint ? btn(t("showOnMap"), () => selectOnMap(o.ref.kind + ":" + o.ref.slug), { small: true, ghost: true, aria: t("showOnMap") + ": " + o.title }) : h("span", { class: "sv-note", text: t("noMapShort") })) : null,
      ),
    ),
  );
}
function propertyCard(p, flag) {
  const ref = { kind: "property", slug: p.slug, title: p.title };
  const meta = [bedsLabel(p.bedrooms), p.bathrooms !== null && p.bathrooms !== undefined ? t("baths", { n: p.bathrooms }) : null, typeLabel(p.property_type)].filter(Boolean).join(" · ");
  const chips = p.amenity_check
    ? h("div", { class: "sv-chips" }, p.amenity_check.matched.map((k) => h("span", { class: "ok", text: "✓ " + k.replace(/_/g, " ") })), p.amenity_check.not_listed.map((k) => h("span", { class: "no", text: t("notListed") + ": " + k.replace(/_/g, " ") })))
    : null;
  return card({
    ref: ref,
    title: p.title,
    photo: p.photo,
    badge: badgeFor(p),
    price: aed(p.price) || t("priceOnRequest"),
    loc: p.location && p.location.label,
    meta: meta,
    chips: chips,
    flag: flag || null,
    mapPoint: p.map_point || null,
    selected: state.compare.some((c) => c.kind === "property" && c.slug === p.slug),
    onDetails: () => openDetail("property", p.slug, p.title),
    onWa: () => openLink((p.links && p.links.whatsapp) || waFor(p.url)),
  });
}
function offplanCard(p) {
  return card({
    ref: { kind: "offplan", slug: p.slug, title: p.title },
    title: p.title,
    photo: p.image,
    badge: t("offPlan"),
    price: p.starting_price_aed ? t("from", { p: aed(p.starting_price_aed) }) : t("priceOnRequest"),
    loc: p.location,
    meta: [p.developer, p.handover ? t("handover", { h: p.handover }) : null].filter(Boolean).join(" · "),
    selected: state.compare.some((c) => c.kind === "offplan" && c.slug === p.slug),
    mapPoint: p.map_point || null,
    onDetails: () => openDetail("offplan", p.slug, p.title),
    onWa: () => openLink((p.links && p.links.whatsapp) || waFor(p.url)),
  });
}
function compareBar() {
  if (!state.compare.length) return null;
  return h(
    "div",
    { class: "sv-bar", role: "region", "aria-label": t("compare") },
    h("span", { class: "sv-note", text: state.compare.length < 2 ? t("compareHint") : t("selectedN", { n: state.compare.length }) }),
    h("div", { class: "sv-actions" }, btn(t("clear"), () => toggleCompareClear(), { small: true, ghost: true }), btn(t("compareN", { n: state.compare.length }), () => openCompare(state.compare), { primary: true, small: true, disabled: state.compare.length < 2 })),
  );
}
function toggleCompareClear() {
  state.compare = [];
  updateModelContext();
  persist();
  rerender();
}
function gallery(urls, title) {
  if (!urls || !urls.length) return null;
  let i = 0;
  const pic = img(urls[0], title);
  const count = h("span", { class: "count", text: t("photoN", { i: 1, n: urls.length }) });
  const go = (d) => {
    i = (i + d + urls.length) % urls.length;
    pic.src = urls[i];
    count.textContent = t("photoN", { i: i + 1, n: urls.length });
  };
  const g = h("div", { class: "sv-gal", tabindex: "0", role: "group", "aria-label": title }, pic, urls.length > 1 ? h("button", { type: "button", class: "nav prev", "aria-label": t("prevPhoto"), onclick: () => go(-1) }, "‹") : null, urls.length > 1 ? h("button", { type: "button", class: "nav next", "aria-label": t("nextPhoto"), onclick: () => go(1) }, "›") : null, count);
  g.addEventListener("keydown", (e) => {
    const rtl = state.lang === "ar";
    if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
    if (e.key === "ArrowRight") go(rtl ? -1 : 1);
  });
  return g;
}
function moreButton(tool, pg) {
  if (!(pg && pg.has_more)) return null;
  // Without the original search input (some hosts do not share it), ask the assistant for the next page.
  const go = state.lastSearch ? () => runSearch(tool, Object.assign({}, state.lastSearch, { page: pg.page + 1 })) : () => askAssistant(t("moreAsk", { p: pg.page + 1 }));
  return h("div", { class: "sv-more" }, btn(t("more"), go, { small: true }));
}

// ---------- map view ----------
// Every placed listing is shown at AREA level (its community centre); the CMS has no verified building
// positions. Listings are grouped into one marker per area ("JVC · 3 homes") with a soft area ring, so
// nothing looks like an exact building pin. Moving the map never changes the search. Leaflet is inlined
// by the server only when a tile provider is configured (CFG.map); otherwise, or if the map fails, the
// "Listings by area" list is the accessible fallback.
function mapEnabled() {
  return !!CFG.map;
}
const SHORT_AREA = {
  "Jumeirah Village Circle": "JVC",
  "Jumeirah Village Triangle": "JVT",
  "Jumeirah Lake Towers": "JLT",
  "Jumeirah Beach Residence": "JBR",
  "Mohammed Bin Rashid City": "MBR City",
  "Dubai Creek Harbour (The Lagoons)": "Dubai Creek Harbour",
  "Dubai South (Dubai World Central)": "Dubai South",
  "Dubai Investment Park (DIP)": "DIP",
  "Dubai Investment Park 2": "DIP",
  "Dubai Design District (D3)": "d3",
  "Al Rowaiyah, Dubailand": "Al Rowaiyah",
};
function areaShort(a) {
  return SHORT_AREA[a] || String(a || "").replace(/\s*\([^)]*\)/, "");
}
function countWord(n, kind) {
  if (kind === "offplan") return n === 1 ? t("project1") : t("projectsN", { n: n });
  return n === 1 ? t("home1") : t("homesN", { n: n });
}
function mapEntries(items, kind) {
  return items
    .filter((i) => i.map_point && typeof i.map_point.lat === "number" && typeof i.map_point.lng === "number")
    .map((i) => ({
      key: kind + ":" + i.slug,
      kind: kind,
      item: i,
      area: i.map_point.area || "—",
      lat: i.map_point.lat,
      lng: i.map_point.lng,
      radius: i.map_point.radius_m || 1000,
      price: kind === "offplan" ? i.starting_price_aed : i.price,
    }));
}
/** One group per area; all members share the area centre. */
function mapGroups(entries) {
  const by = new Map();
  for (const e of entries) {
    if (!by.has(e.area)) by.set(e.area, { id: e.area, area: e.area, lat: e.lat, lng: e.lng, radius: e.radius, kind: e.kind, entries: [] });
    by.get(e.area).entries.push(e);
  }
  return [...by.values()].map((g) => {
    const prices = g.entries.map((e) => e.price).filter((n) => typeof n === "number");
    g.min = prices.length ? Math.min(...prices) : null;
    g.max = prices.length ? Math.max(...prices) : null;
    return g;
  });
}
function priceRange(g) {
  if (g.min === null) return null;
  return g.min === g.max ? aed(g.min) : "AED " + aedShort(g.min) + " – " + aedShort(g.max);
}
function aedShort(n) {
  if (typeof n !== "number" || !isFinite(n)) return null;
  if (n >= 1e6) return (Math.round(n / 1e4) / 100).toString().replace(/(\.\d)0$/, "$1") + "M";
  if (n >= 1e3) return Math.round(n / 1e3) + "K";
  return String(Math.round(n));
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function viewToggle(d, entries) {
  if (!mapEnabled() || !entries.length) return null;
  const mk = (mode, label) => {
    const b = btn(label, () => setViewMode(mode), { small: true, ghost: state.viewMode !== mode });
    b.setAttribute("aria-pressed", state.viewMode === mode ? "true" : "false");
    b.classList.add("sv-seg");
    return b;
  };
  return h("div", { class: "sv-segs", role: "group", "aria-label": t("viewAs") }, mk("list", t("listTab")), mk("map", t("mapTab")));
}
function setViewMode(mode) {
  state.viewMode = mode;
  if (mode === "map" && window.innerWidth < 600) return enterFullMap();
  if (mode === "list" && state.fullMap) return exitFullMap();
  rerender();
}
async function requestDisplay(mode) {
  try {
    const o = globalThis.openai;
    if (o && typeof o.requestDisplayMode === "function") return await withTimeout(o.requestDisplayMode({ mode: mode }), 3000, "display-timeout");
    if (state.app && typeof state.app.requestDisplayMode === "function") return await withTimeout(state.app.requestDisplayMode({ mode: mode }), 3000, "display-timeout");
  } catch (e) {}
  return null;
}
function enterFullMap() {
  state.viewMode = "map";
  state.fullMap = true;
  rerender();
  requestDisplay("fullscreen"); // hosts that cannot go full screen still get the in-card full map
}
function exitFullMap() {
  state.fullMap = false;
  state.viewMode = "list";
  rerender();
  requestDisplay("inline");
}
function groupOfKey(key) {
  const m = state.mapInst;
  return m ? m.groups.find((g) => g.entries.some((e) => e.key === key)) : null;
}
/** Select an area (and optionally one listing in it). */
function selectArea(id, key) {
  state.mapArea = id;
  state.mapSel = key || null;
  const m = state.mapInst;
  const g = m && m.groups.find((x) => x.id === id);
  if (g && !key && g.entries.length === 1) state.mapSel = g.entries[0].key;
  if (m && g) {
    // Zoom in just enough for this area to stand alone (not merged into an "N areas" marker).
    const z = separateZoom(m.map, m.groups, g);
    if (z > m.map.getZoom()) m.map.setView([g.lat, g.lng], z);
    else m.map.panTo([g.lat, g.lng]);
  }
  refreshMarkers();
  refreshSelectionUi();
  keepSelectionVisible();
}
/** Keep the selected area marker in the part of the map that the docked preview does not cover. */
function keepSelectionVisible() {
  const m = state.mapInst;
  const g = m && m.groups.find((x) => x.id === state.mapArea);
  const pv = document.getElementById("sv-mapsel");
  if (!m || !g || !pv || pv.hidden) return;
  const size = m.map.getSize();
  const pvRect = pv.getBoundingClientRect();
  const mapRect = m.map.getContainer().getBoundingClientRect();
  const pt = m.map.latLngToContainerPoint([g.lat, g.lng]);
  const coversFullWidth = pvRect.width > mapRect.width * 0.7;
  if (coversFullWidth) {
    const freeH = pvRect.top - mapRect.top; // visible band above the preview
    const target = Math.max(40, freeH / 2);
    if (Math.abs(pt.y - target) > 8) m.map.panBy([0, pt.y - target]);
  } else {
    const freeX = pvRect.right - mapRect.left; // preview on the left: keep the marker to its right
    const targetX = freeX + (size.x - freeX) / 2;
    if (pt.x < freeX + 40) m.map.panBy([pt.x - targetX, 0]);
  }
}
function separateZoom(map, groups, g) {
  for (let z = map.getZoom(); z <= 15; z++) {
    const c = clustersAt(map, groups, z).find((x) => x.indexOf(g) >= 0);
    if (c && c.length === 1) return z;
  }
  return 15;
}
/**
 * Greedy screen-space merge: area labels whose centres are closer than a label's footprint
 * (about 120 x 40 px) would overlap, so they merge into one "N areas" marker.
 */
function clustersAt(map, groups, z) {
  const pts = groups.map((g) => ({ g: g, p: map.project([g.lat, g.lng], z) })).sort((a, b) => b.g.entries.length - a.g.entries.length);
  const out = [];
  for (const x of pts) {
    const hit = out.find((c) => Math.abs(c.p.x - x.p.x) < 120 && Math.abs(c.p.y - x.p.y) < 40);
    if (hit) {
      hit.members.push(x.g);
      const n = hit.members.length;
      hit.p = { x: (hit.p.x * (n - 1) + x.p.x) / n, y: (hit.p.y * (n - 1) + x.p.y) / n };
    } else out.push({ p: x.p, members: [x.g] });
  }
  return out.map((c) => c.members);
}
/** From a card's "Show on map" or the area list. */
function selectOnMap(key) {
  if (state.viewMode !== "map") {
    state.mapSel = key;
    state.mapArea = null; // resolved once the map is drawn
    state.viewMode = "map";
    if (window.innerWidth < 600) return enterFullMap();
    return rerender();
  }
  const g = groupOfKey(key);
  if (g) selectArea(g.id, key);
}
function clearMapSelection() {
  state.mapArea = null;
  state.mapSel = null;
  refreshMarkers();
  refreshSelectionUi();
}
function refreshSelectionUi() {
  const g = state.mapInst && state.mapInst.groups.find((x) => x.id === state.mapArea);
  const inArea = new Set(g ? g.entries.map((e) => e.key) : []);
  for (const c of document.querySelectorAll(".sv-card[data-key]")) {
    const k = c.getAttribute("data-key");
    c.classList.toggle("mapsel", k === state.mapSel);
    c.classList.toggle("mapgroup", k !== state.mapSel && inArea.has(k));
    if (k === state.mapSel && state.viewMode === "map") {
      try { c.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); } catch (e) {}
    }
  }
  const panel = document.getElementById("sv-mapsel");
  if (panel) {
    const nodes = previewNodes();
    panel.replaceChildren(...nodes);
    panel.hidden = nodes.length === 0;
  }
}
function previewNodes() {
  const m = state.mapInst;
  const g = m && m.groups.find((x) => x.id === state.mapArea);
  if (!g) return [];
  const e = state.mapSel ? g.entries.find((x) => x.key === state.mapSel) : null;
  const close = h("button", { type: "button", class: "sv-x", "aria-label": t("closeSel"), onclick: () => clearMapSelection() }, "×");
  if (e) {
    const it = e.item;
    const facts = e.kind === "offplan"
      ? [it.developer, it.handover ? t("handover", { h: it.handover }) : null].filter(Boolean).join(" · ")
      : [bedsLabel(it.bedrooms), it.bathrooms !== null && it.bathrooms !== undefined ? t("baths", { n: it.bathrooms }) : null, typeLabel(it.property_type)].filter(Boolean).join(" · ");
    const price = e.kind === "offplan" ? (it.starting_price_aed ? t("from", { p: aed(it.starting_price_aed) }) : t("priceOnRequest")) : aed(it.price) || t("priceOnRequest");
    return [
      h(
        "div",
        { class: "sv-pv-head" },
        g.entries.length > 1 ? btn((state.lang === "ar" ? "→ " : "← ") + areaShort(g.area) + " · " + countWord(g.entries.length, g.kind), () => { state.mapSel = null; refreshSelectionUi(); }, { small: true, ghost: true }) : h("span", { class: "sv-pv-tag", text: t("approxArea") + " · " + areaShort(g.area) }),
        close,
      ),
      h(
        "div",
        { class: "sv-pv-card" },
        img(e.kind === "offplan" ? it.image : it.photo, it.title) || h("span"),
        h(
          "div",
          { class: "sv-pv-body" },
          h("div", { class: "sv-price", text: price }),
          h("div", { class: "sv-title", dir: "auto", text: cleanTitle(it.title) }),
          facts ? h("div", { class: "sv-meta", text: facts }) : null,
          h("div", { class: "sv-pv-tag", dir: "auto", text: t("areaLabel", { a: g.area }) }),
        ),
      ),
      h("div", { class: "sv-actions" }, btn(t("details"), () => openDetail(e.kind, it.slug, it.title), { small: true, primary: true, aria: t("details") + ": " + it.title }), btn(t("whatsapp"), () => openLink((it.links && it.links.whatsapp) || waFor(it.url)), { small: true, aria: t("whatsapp") + ": " + it.title })),
    ];
  }
  const range = priceRange(g);
  return [
    h("div", { class: "sv-pv-head" }, h("span", { class: "sv-pv-tag", text: t("approxArea") }), close),
    h("div", { class: "sv-pv-title", dir: "auto", text: g.area + " · " + countWord(g.entries.length, g.kind) }),
    range ? h("div", { class: "sv-pv-range", text: range }) : null,
    h(
      "ul",
      { class: "sv-pv-list" },
      g.entries.map((x) =>
        h(
          "li",
          null,
          h(
            "button",
            { type: "button", class: "sv-pv-row", onclick: () => selectArea(g.id, x.key), "aria-label": t("select") + ": " + x.item.title },
            img(x.kind === "offplan" ? x.item.image : x.item.photo, "") || h("span", { class: "ph" }),
            h("span", { class: "tx" }, h("b", { text: (x.kind === "offplan" ? t("fromShort") + " " : "") + (aed(x.price) || t("priceOnRequest")) }), h("span", { dir: "auto", text: cleanTitle(x.item.title) })),
          ),
        ),
      ),
    ),
  ];
}
function areaList(groups, missing, kind) {
  const blocks = groups
    .slice()
    .sort((a, b) => a.area.localeCompare(b.area))
    .map((g) =>
      h(
        "div",
        { class: "sv-area-group" },
        h("div", { class: "t", dir: "auto", text: g.area + " · " + countWord(g.entries.length, kind) + (priceRange(g) ? " · " + priceRange(g) : "") }),
        h("ul", null, g.entries.map((e) => h("li", null, btn((aed(e.price) || t("priceOnRequest")) + " · " + cleanTitle(e.item.title), () => (state.mapFailed ? openDetail(e.kind, e.item.slug, e.item.title) : selectOnMap(e.key)), { small: true, ghost: true, aria: (state.mapFailed ? t("details") : t("showOnMap")) + ": " + e.item.title })))),
      ),
    );
  if (missing.length) blocks.push(h("div", { class: "sv-area-group" }, h("div", { class: "t", text: t("notOnMap") + " (" + missing.length + ")" }), h("ul", null, missing.map((i) => h("li", { dir: "auto", text: cleanTitle(i.title) })))));
  return disclosure(t("byArea") + " (" + t("approxAreas") + ")", blocks, !!state.mapFailed);
}
function mapCountLine(placed, onPage, total, kind) {
  const base = t("mapPageCount", { n: placed, p: countWord(onPage, kind) });
  return typeof total === "number" && total > onPage ? base + " · " + t("totalResults", { n: nf().format(total) }) : base;
}
function mapSection(d, kind, items) {
  const entries = mapEntries(items, kind);
  const groups = mapGroups(entries);
  const missing = items.filter((i) => !i.map_point);
  const total = d.pagination ? d.pagination.total_results : null;
  const countLine = mapCountLine(entries.length, items.length, total, kind);
  const mapEl = h("div", { class: "sv-map", role: "region", "aria-label": t("mapAria") });
  const frame = h(
    "div",
    { class: "sv-mapframe" },
    mapEl,
    h("div", { class: "sv-mapchip", "aria-hidden": "true", text: t("approxChip") }),
    h("div", { id: "sv-mapsel", class: "sv-preview", "aria-live": "polite", hidden: true }),
  );
  const wrap = h(
    "section",
    { class: "sv-mapwrap" + (state.fullMap ? " full" : ""), "aria-label": t("mapTitle") },
    state.fullMap ? h("div", { class: "sv-mapbar" }, btn((state.lang === "ar" ? "→ " : "← ") + t("backToList"), () => exitFullMap(), { small: true, primary: true }), h("span", { class: "sv-note", text: countLine })) : h("div", { class: "sv-maphead" }, h("span", { class: "sv-note", text: countLine }), state.mapFailed ? null : btn(t("mapFull"), () => enterFullMap(), { small: true, ghost: true })),
    state.mapFailed ? h("div", { class: "sv-notice error", role: "alert" }, h("span", { text: t("mapFailed") })) : frame,
    state.mapFailed ? null : h("div", { class: "sv-note", text: t("mapHintAreas") }),
    areaList(groups, missing, kind),
  );
  if (!state.mapFailed) state.pendingMap = { el: mapEl, entries: entries, groups: groups, key: resultIdentity(d) };
  return wrap;
}
function destroyMap() {
  const inst = state.mapInst;
  state.mapInst = null;
  if (!inst) return;
  // Stop pan/zoom animations first: removing a map mid-animation makes the engine touch detached DOM.
  try { inst.map.stop(); } catch (e) {}
  try { inst.map.off(); } catch (e) {}
  try { inst.map.remove(); } catch (e) {}
}
function mapFailed(code) {
  state.mapFailed = code || "failed";
  destroyMap();
  rerender();
}
function initPendingMap() {
  const p = state.pendingMap;
  state.pendingMap = null;
  if (!p) return;
  let done = false;
  const fail = (code) => {
    if (done) return;
    done = true;
    mapFailed(code);
  };
  try {
    const map = CFG.map.engine === "maplibre" ? maplibreEngine(p.el, fail) : leafletEngine(p.el, fail);
    if (!map || done) return;
    const inst = { map: map, entries: p.entries, groups: p.groups, key: p.key };
    state.mapInst = inst;
    if (state.mapSel && !state.mapArea) {
      const g = inst.groups.find((x) => x.entries.some((e) => e.key === state.mapSel));
      if (g) state.mapArea = g.id;
    }
    map.on("zoomend", () => refreshMarkers());
    map.on("moveend", () => { const c = map.getCenter(); state.mapView = { key: p.key, center: [c.lat, c.lng], zoom: map.getZoom() }; }); // never triggers a search
    if (state.mapView && state.mapView.key === p.key) map.setView(state.mapView.center, state.mapView.zoom);
    else fitToResults(inst);
    const selGroup = inst.groups.find((x) => x.id === state.mapArea);
    if (selGroup) {
      const z = separateZoom(map, inst.groups, selGroup);
      if (z > map.getZoom()) map.setView([selGroup.lat, selGroup.lng], z);
    }
    refreshMarkers();
    refreshSelectionUi();
    keepSelectionVisible();
  } catch (e) {
    fail("map-error");
  }
}
function fitToResults(inst) {
  const pts = inst.groups.map((g) => [g.lat, g.lng]);
  if (!pts.length) return inst.map.setView([25.15, 55.25], 10);
  if (pts.length === 1) return inst.map.setView(pts[0], 13);
  inst.map.fitBounds(pts, { padding: [56, 56], maxZoom: 13 });
}
function areaMarker(g, selected) {
  const el = h("div", { class: "sv-areamk" + (selected ? " sel" : ""), "data-area": g.id });
  el.append(h("span", { class: "ln" }, h("span", { class: "nm", dir: "auto", text: areaShort(g.area) }), h("span", { class: "ct", text: " · " + countWord(g.entries.length, g.kind) })));
  const range = priceRange(g);
  if (selected && range) el.append(h("span", { class: "pr", text: range }));
  return el;
}
/** Areas whose markers would overlap at this zoom merge into "2 areas · 7 homes"; a click zooms in. */
function mergeGroups(map, groups) {
  return clustersAt(map, groups, map.getZoom());
}
function refreshMarkers() {
  const inst = state.mapInst;
  if (!inst) return;
  // The ring says "somewhere in this area", not a building.
  inst.map.setRings(inst.groups.map((g) => ({ lat: g.lat, lng: g.lng, radius: g.radius, sel: g.id === state.mapArea })));
  const markers = [];
  for (const cluster of mergeGroups(inst.map, inst.groups)) {
    const lat = cluster.reduce((s, g) => s + g.lat, 0) / cluster.length;
    const lng = cluster.reduce((s, g) => s + g.lng, 0) / cluster.length;
    let el, label;
    if (cluster.length === 1) {
      const g = cluster[0];
      el = areaMarker(g, g.id === state.mapArea);
      label = g.area + ": " + countWord(g.entries.length, g.kind) + ", " + t("approxArea") + (priceRange(g) ? ", " + priceRange(g) : "");
    } else {
      const n = cluster.reduce((s, g) => s + g.entries.length, 0);
      el = h("div", { class: "sv-areamk multi" }, h("span", { class: "ln" }, h("span", { class: "nm", text: t("areasN", { n: cluster.length }) }), h("span", { class: "ct", text: " · " + countWord(n, cluster[0].kind) })));
      label = t("areasN", { n: cluster.length }) + ": " + cluster.map((g) => g.area).join(", ");
    }
    const onClick = () => {
      if (cluster.length === 1) return selectArea(cluster[0].id);
      inst.map.fitBounds(cluster.map((g) => [g.lat, g.lng]), { padding: [70, 70], maxZoom: 14 });
    };
    markers.push({ lat: lat, lng: lng, el: el, label: label, onClick: onClick, front: cluster.some((g) => g.id === state.mapArea) });
  }
  inst.map.setMarkers(markers);
}

// ---------- map engines ----------
// The area-group logic above talks to a small engine interface (Leaflet-style method names, Leaflet zoom
// units). Leaflet is the default; MapLibre GL is a prototype (CFG.map.engine === "maplibre").
//   getZoom, setView([lat,lng], z), panTo([lat,lng]), panBy([dx,dy]), fitBounds(points, {padding, maxZoom}),
//   getSize() {x,y}, getContainer(), getCenter() {lat,lng}, latLngToContainerPoint([lat,lng]) {x,y},
//   project([lat,lng], z) {x,y}, on(events, fn), setMarkers([{lat,lng,el,label,onClick,front}]),
//   setRings([{lat,lng,radius,sel}]), stop(), off(), remove()
function mercator(lat, lng, z) {
  const scale = 256 * Math.pow(2, z);
  const s = Math.min(Math.max(Math.sin((lat * Math.PI) / 180), -0.9999), 0.9999);
  return { x: ((lng + 180) / 360) * scale, y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * scale };
}
function leafletEngine(el, fail) {
  const L = globalThis.L;
  if (!L || !L.map) return fail("no-map-library");
  const map = L.map(el, { zoomControl: false, attributionControl: true, scrollWheelZoom: false, keyboard: true, worldCopyJump: false, minZoom: 9 });
  // Zoom buttons on the side opposite the "approximate areas" label (which follows the text direction).
  L.control.zoom({ position: state.lang === "ar" ? "topleft" : "topright" }).addTo(map);
  map.attributionControl.setPrefix("Leaflet");
  let loaded = 0, failed = 0;
  const tiles = L.tileLayer(CFG.map.url, { attribution: escapeHtml(CFG.map.attribution), subdomains: CFG.map.subdomains && CFG.map.subdomains.length ? CFG.map.subdomains : "abc", maxZoom: CFG.map.maxZoom || 18 });
  tiles.on("tileload", () => loaded++);
  tiles.on("tileerror", () => failed++);
  tiles.addTo(map);
  // Tiles blocked (CSP, network, provider key): fall back to the accessible area list.
  setTimeout(() => { if (state.mapInst && state.mapInst.map === eng && loaded === 0 && failed > 0) fail("tiles-unavailable"); }, 4000);
  map.on("click focus", () => map.scrollWheelZoom.enable()); // no scroll hijack until the customer uses the map
  const rings = L.layerGroup().addTo(map);
  const layer = L.layerGroup().addTo(map);
  const eng = {
    kind: "leaflet",
    getZoom: () => map.getZoom(),
    setView: (c, z) => map.setView(c, z, { animate: false }),
    panTo: (c) => map.panTo(c, { animate: false }),
    panBy: (d) => map.panBy(d, { animate: false }),
    fitBounds: (pts, o) => map.fitBounds(pts, { padding: o.padding, maxZoom: o.maxZoom, animate: false }),
    getSize: () => map.getSize(),
    getContainer: () => map.getContainer(),
    getCenter: () => map.getCenter(),
    latLngToContainerPoint: (c) => map.latLngToContainerPoint(c),
    project: (c, z) => mercator(c[0], c[1], z),
    on: (ev, fn) => map.on(ev, fn),
    setRings: (list) => {
      rings.clearLayers();
      for (const r of list) L.circle([r.lat, r.lng], { radius: r.radius, color: r.sel ? "#a8834a" : "#8a857d", weight: 1, dashArray: "4 4", fillColor: r.sel ? "#a8834a" : "#8a857d", fillOpacity: r.sel ? 0.1 : 0.04, interactive: false }).addTo(rings);
    },
    setMarkers: (list) => {
      layer.clearLayers();
      for (const m of list) {
        const marker = L.marker([m.lat, m.lng], { icon: L.divIcon({ html: m.el, className: "sv-mk-wrap", iconSize: null }), keyboard: true, title: m.label, alt: m.label, riseOnHover: true, zIndexOffset: m.front ? 1000 : 0 });
        marker.on("click", m.onClick);
        marker.addTo(layer);
        const icon = marker.getElement && marker.getElement();
        if (icon) icon.setAttribute("aria-label", m.label);
      }
    },
    stop: () => map.stop(),
    off: () => map.off(),
    remove: () => map.remove(),
  };
  return eng;
}
function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch (e) {
    return false;
  }
}
/** Hide clutter (road shields, minor road and path names, POI/airport labels) and label in the UI language. */
function simplifyStyle(map) {
  const name = state.lang === "ar" ? ["coalesce", ["get", "name:ar"], ["get", "name"]] : ["coalesce", ["get", "name:en"], ["get", "name_en"], ["get", "name:latin"], ["get", "name"]];
  for (const layer of map.getStyle().layers || []) {
    if (layer.type !== "symbol") continue;
    if (/shield|oneway|path|minor|airport|label_other|poi|housenumber|transit|aerialway|ferry/i.test(layer.id)) {
      map.setLayoutProperty(layer.id, "visibility", "none");
      continue;
    }
    const tf = layer.layout && layer.layout["text-field"];
    if (tf && /name/.test(JSON.stringify(tf))) {
      try { map.setLayoutProperty(layer.id, "text-field", name); } catch (e) {}
    }
  }
}
function ringPolygon(lat, lng, radius) {
  const pts = [];
  const dLat = radius / 111320;
  const dLng = radius / (111320 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * 2 * Math.PI;
    pts.push([lng + dLng * Math.cos(a), lat + dLat * Math.sin(a)]);
  }
  return pts;
}
let mlWorkerUrl = null;
function maplibreEngine(el, fail) {
  const ml = globalThis.maplibregl;
  if (!ml || !ml.Map) return fail("no-map-library");
  if (!webglAvailable()) return fail("webgl-unavailable");
  try {
    if (!mlWorkerUrl) {
      const src = document.getElementById("sv-ml-worker");
      mlWorkerUrl = URL.createObjectURL(new Blob([src ? src.textContent : ""], { type: "text/javascript" }));
      ml.setWorkerUrl(mlWorkerUrl);
      ml.setWorkerCount(1); // one worker is plenty for a small card
    }
  } catch (e) {
    return fail("worker-unavailable");
  }
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  let map;
  try {
    map = new ml.Map({
      container: el,
      style: dark && CFG.map.styleDark ? CFG.map.styleDark : CFG.map.style,
      center: [55.25, 25.15],
      zoom: 9,
      minZoom: 8,
      maxZoom: (CFG.map.maxZoom || 16) - 1,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      fadeDuration: 0,
    });
  } catch (e) {
    return fail("map-error");
  }
  map.touchZoomRotate.disableRotation();
  map.keyboard.disableRotation();
  map.scrollZoom.disable(); // no scroll hijack until the customer uses the map
  map.addControl(new ml.NavigationControl({ showCompass: false }), state.lang === "ar" ? "top-left" : "top-right");
  // The style carries the provider attribution (with links); the configured text is only used if it has none.
  map.addControl(new ml.AttributionControl({ compact: false }), "bottom-right");
  map.once("load", () => { const at = el.querySelector(".maplibregl-ctrl-attrib-inner"); if (at && !at.textContent.trim()) at.textContent = CFG.map.attribution; });
  let ready = false;
  let pendingRings = [];
  const markers = [];
  // Style, vector tiles, fonts or the worker blocked (CSP, network, WebGL limits): fall back to the area list.
  const timer = setTimeout(() => { if (!ready && state.mapInst && state.mapInst.map === eng) fail("map-timeout"); }, 9000);
  map.on("load", () => {
    ready = true;
    clearTimeout(timer);
    try {
      simplifyStyle(map);
      map.addSource("sv-rings", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      const firstSymbol = (map.getStyle().layers || []).find((l) => l.type === "symbol");
      map.addLayer({ id: "sv-rings-fill", type: "fill", source: "sv-rings", paint: { "fill-color": ["case", ["get", "sel"], "#a8834a", "#8a857d"], "fill-opacity": ["case", ["get", "sel"], 0.1, 0.04] } }, firstSymbol && firstSymbol.id);
      map.addLayer({ id: "sv-rings-line", type: "line", source: "sv-rings", paint: { "line-color": ["case", ["get", "sel"], "#a8834a", "#8a857d"], "line-width": 1, "line-dasharray": [3, 3] } }, firstSymbol && firstSymbol.id);
      eng.setRings(pendingRings);
    } catch (e) {}
    el.setAttribute("data-map-ready", "1");
  });
  map.once("idle", () => el.setAttribute("data-map-idle", "1"));
  map.on("error", (e) => {
    if (!ready && state.mapInst && state.mapInst.map === eng && e && e.error && /style|Failed to fetch|NetworkError|CSP|worker|Load failed/i.test(String(e.error.message || e.error))) fail("map-unavailable");
  });
  map.on("click", () => map.scrollZoom.enable());
  el.addEventListener("focusin", () => map.scrollZoom.enable());
  const eng = {
    kind: "maplibre",
    // MapLibre uses 512 px tiles: its zoom z equals Leaflet zoom z + 1. The shared code uses Leaflet units.
    getZoom: () => map.getZoom() + 1,
    setView: (c, z) => map.jumpTo({ center: [c[1], c[0]], zoom: z - 1 }),
    panTo: (c) => map.jumpTo({ center: [c[1], c[0]] }),
    panBy: (d) => map.panBy(d, { animate: false }),
    fitBounds: (pts, o) => {
      const lats = pts.map((p) => p[0]), lngs = pts.map((p) => p[1]);
      map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: o.padding ? o.padding[0] : 40, maxZoom: o.maxZoom - 1, animate: false });
    },
    getSize: () => ({ x: el.clientWidth, y: el.clientHeight }),
    getContainer: () => el,
    getCenter: () => { const c = map.getCenter(); return { lat: c.lat, lng: c.lng }; },
    latLngToContainerPoint: (c) => { const p = map.project([c[1], c[0]]); return { x: p.x, y: p.y }; },
    project: (c, z) => mercator(c[0], c[1], z),
    on: (ev, fn) => { for (const e of String(ev).split(/\s+/)) map.on(e, fn); },
    setRings: (list) => {
      pendingRings = list;
      const src = ready && map.getSource("sv-rings");
      if (!src) return;
      src.setData({ type: "FeatureCollection", features: list.map((r) => ({ type: "Feature", properties: { sel: !!r.sel }, geometry: { type: "Polygon", coordinates: [ringPolygon(r.lat, r.lng, r.radius)] } })) });
    },
    setMarkers: (list) => {
      while (markers.length) markers.pop().remove();
      for (const m of list) {
        const wrap = h("div", { class: "sv-mk-wrap sv-mk-ml", role: "button", tabindex: "0", "aria-label": m.label, title: m.label }, m.el);
        wrap.style.zIndex = m.front ? "2" : "1";
        wrap.addEventListener("click", (e) => { e.stopPropagation(); m.onClick(); });
        wrap.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); m.onClick(); } });
        markers.push(new ml.Marker({ element: wrap, anchor: "center" }).setLngLat([m.lng, m.lat]).addTo(map));
      }
    },
    stop: () => map.stop(),
    off: () => {},
    remove: () => { clearTimeout(timer); while (markers.length) markers.pop().remove(); map.remove(); },
  };
  return eng;
}

// ---------- views ----------
function renderPropertyList(d) {
  const pg = d.pagination;
  const sub = pg && pg.total_results ? (pg.total_results === 1 ? t("result1") : t("results", { n: nf().format(pg.total_results) })) + (pg.total_pages > 1 ? " · " + t("pageOf", { p: pg.page, t: pg.total_pages }) : "") : "";
  const out = [header(t("listings"), sub)];
  if (d.status === "error" || d.status === "invalid_input") return out.concat(errorBox(d), footer(d.data_as_of));
  if (!d.items.length) {
    out.push(h("div", { class: "sv-empty", text: t("noResults") }));
    if (d.alternatives && d.alternatives.length) {
      out.push(h("h2", { class: "sv-section-t", text: t("alternatives") }));
      d.alternatives.forEach((a) =>
        out.push(
          h(
            "div",
            { class: "sv-alt" },
            h("div", null, h("h3", { dir: "auto", text: a.description }), h("div", { class: "sv-note", text: t("nListings", { n: a.total_results }) })),
            h("div", { class: "sv-mini" }, a.sample.map((s) => h("div", null, h("b", { text: cleanTitle(s.title) }), " — " + (aed(s.price) || t("priceOnRequest")) + (s.location && s.location.label ? " · " + s.location.label : "")))),
            h("div", { class: "sv-actions" }, btn(t("showThese"), () => runSearch("search_properties", a.search_args), { primary: true, small: true })),
          ),
        ),
      );
    }
  } else {
    const entries = mapEntries(d.items, "property");
    out.push(viewToggle(d, entries));
    if (state.viewMode === "map" && mapEnabled() && entries.length) out.push(mapSection(d, "property", d.items));
    out.push(h("div", { class: "sv-row" }, d.items.map((p) => propertyCard(p))));
    if (d.amenity_note) out.push(h("div", { class: "sv-note", text: t("amenNote") }));
  }
  out.push(moreButton("search_properties", pg), footer(d.data_as_of), compareBar());
  return out;
}

function renderOffplanList(d) {
  const pg = d.pagination;
  const sub = pg && pg.total_results ? t("results", { n: pg.total_results }) : "";
  const out = [header(t("offplan"), sub)];
  if (d.status === "error") return out.concat(errorBox(d), footer(d.data_as_of));
  if (!d.items.length) out.push(h("div", { class: "sv-empty", text: t("noResults") }));
  else {
    const entries = mapEntries(d.items, "offplan");
    out.push(viewToggle(d, entries));
    if (state.viewMode === "map" && mapEnabled() && entries.length) out.push(mapSection(d, "offplan", d.items));
    out.push(h("div", { class: "sv-row" }, d.items.map((p) => offplanCard(p))));
  }
  if (d.notes && d.notes.length) out.push(h("div", { class: "sv-note", text: d.notes.join(" ") }));
  out.push(moreButton("search_offplan_projects", pg), footer(d.data_as_of), compareBar());
  return out;
}

function renderPropertyDetail(d) {
  const out = [header(null)];
  const p = d.property;
  if (!p) return out.concat(h("div", { class: d.status === "not_found" ? "sv-empty" : "sv-error", text: (d.error && d.error.message) || t("error") }));
  const ref = { kind: "property", slug: p.slug, title: p.title };
  const keyFacts = [bedsLabel(p.bedrooms), p.bathrooms !== null && p.bathrooms !== undefined ? t("baths", { n: p.bathrooms }) : null, p.size_sqft ? t("sqft", { n: nf().format(p.size_sqft) }) : null, typeLabel(p.property_type)].filter(Boolean).join(" · ");
  const ppsf = p.purpose !== "rent" && p.price_per_sqft_aed ? t("perSqft", { v: aed(p.price_per_sqft_aed) }) : null;
  const wa = d.links ? d.links.whatsapp : p.agent && p.agent.whatsapp_url ? p.agent.whatsapp_url + "?text=" + encodeURIComponent("Hello, I'm interested in this property: " + p.url) : waFor(p.url);
  const site = d.links ? d.links.website : p.url;
  const more = [
    dl([
      [t("rStatus"), badgeFor(p)],
      [t("rType"), typeLabel(p.property_type)],
      [t("rBeds"), p.bedrooms === 0 ? t("studio") : p.bedrooms],
      [t("rBaths"), p.bathrooms],
      [t("rSize"), p.size_sqft ? t("sqft", { n: nf().format(p.size_sqft) }) : null],
      [t("rPpsf"), p.purpose === "rent" ? t("naRent") : p.price_per_sqft_aed ? aed(p.price_per_sqft_aed) : null],
      p.reference_number ? [t("rRef"), p.reference_number] : null,
      p.permit_number ? [t("rPermit"), p.permit_number] : null,
      [t("agent"), p.agent ? p.agent.name : "Savoir Properties"],
    ]),
    p.amenities && p.amenities.length ? h("div", { class: "sv-chips" }, p.amenities.map((a) => h("span", { text: a }))) : null,
  ];
  out.push(
    h(
      "section",
      { class: "sv-detail", "aria-label": p.title },
      gallery(p.photos, p.title),
      h(
        "div",
        { class: "sv-dhead" },
        badgeFor(p) ? h("div", { class: "sv-status", text: badgeFor(p) }) : null,
        h("h2", { class: "sv-dtitle", dir: "auto", text: cleanTitle(p.title) }),
        h("div", { class: "sv-loc", dir: "auto", text: [p.building, p.location && p.location.label].filter(Boolean).join(", ") }),
        h("div", { class: "sv-dprice" }, h("span", { class: "sv-price", text: aed(p.price) || t("priceOnRequest") }), ppsf ? h("span", { class: "sv-note", text: ppsf }) : null),
        keyFacts ? h("div", { class: "sv-keyfacts", text: keyFacts }) : null,
      ),
      h("div", { class: "sv-actions" }, btn(t("prepare"), () => prepareMessage([ref]), { primary: true }), btn(t("whatsapp"), () => openLink(wa)), saveButton(ref)),
      h("div", { class: "sv-links" }, btn(t("website") + " ↗", () => openLink(site), { small: true, ghost: true, aria: t("website") }), (() => {
        const c = compareCheck(ref);
        return c;
      })()),
      disclosure(t("moreDetails"), more),
    ),
  );
  if (p.similar_properties && p.similar_properties.length) {
    const differs = (s) => !!(s.purpose && p.purpose && s.purpose !== p.purpose);
    const mixed = p.similar_properties.some(differs);
    const flagFor = (s) => (differs(s) ? t(s.purpose === "rent" ? "diffRent" : "diffSale") : null);
    out.push(
      h(
        "section",
        { class: "sv-similar" },
        h("h2", { class: "sv-section-t", text: t("similar") }),
        mixed ? h("div", { class: "sv-note", text: t(p.purpose === "sale" ? "similarMixedSale" : "similarMixedRent") }) : null,
        h("div", { class: "sv-row" }, p.similar_properties.map((s) => propertyCard(Object.assign({ saved: false, amenity_check: null }, s), flagFor(s)))),
      ),
    );
  }
  out.push(footer(d.data_as_of), compareBar());
  return out;
}

function pct(s) {
  const m = /(\d+(?:\.\d+)?)/.exec(String(s || ""));
  return m ? Number(m[1]) : 0;
}
function renderOffplanDetail(d) {
  const out = [header(null)];
  const p = d.project;
  if (!p) return out.concat(h("div", { class: d.status === "not_found" ? "sv-empty" : "sv-error", text: (d.error && d.error.message) || t("error") }));
  const ref = { kind: "offplan", slug: p.slug, title: p.title };
  let planBox = null;
  if (p.payment_plan) {
    const stages = [[t("down"), p.payment_plan.down_payment], [t("during"), p.payment_plan.during_construction], [t("onHandover"), p.payment_plan.on_handover]];
    const priceInput = h("input", { type: "number", inputmode: "numeric", min: "10000", step: "1000", placeholder: t("calcPh"), "aria-label": t("calcPh") });
    const sched = d.payment_schedule
      ? h("div", null, h("table", { class: "sv-sched" }, h("caption", { class: "sr", text: t("plan") }), h("tbody", null, d.payment_schedule.stages.map((s) => h("tr", null, h("th", { scope: "row", text: s.label }), h("td", { class: "pct", text: s.percent + "%" }), h("td", { text: aed(s.amount_aed) }))))), d.payment_schedule.notes.length ? h("div", { class: "sv-note", style: "margin-top:6px", text: d.payment_schedule.notes.join(" ") }) : null)
      : d.payment_schedule_note
        ? h("div", { class: "sv-note", text: d.payment_schedule_note })
        : null;
    planBox = h(
      "div",
      { class: "sv-planbox" },
      h("h3", { text: t("plan") }),
      h("div", { class: "sv-planbar", "aria-hidden": "true" }, stages.map((s) => h("span", { style: "flex:" + (pct(s[1]) || 1) }))),
      h("div", { class: "sv-plan", role: "list", "aria-label": t("plan") }, stages.map((x) => h("div", { role: "listitem" }, h("b", { text: x[1] || "—" }), x[0]))),
      h("div", { class: "sv-note", text: t("calcTitle") }),
      h("div", { class: "sv-calc" }, priceInput, btn(t("calcBtn"), async () => {
        const v = Number(priceInput.value);
        if (!v || v < 10000) {
          notice(t("calcInvalid"), "error");
          return priceInput.focus();
        }
        const args = { slug: p.slug, unit_price_aed: v };
        if (state.shortlistId) args.shortlist_id = state.shortlistId;
        const sc = await callTool("get_offplan_project_details", args);
        if (sc) navigate(sc, false);
      }, { small: true })),
      sched,
    );
  }
  const more = [
    dl([[t("rDev"), p.developer], [t("rHandover"), p.handover], [t("rUnits"), p.unit_sizes], [t("rLifestyle"), p.lifestyle], [t("rTitleType"), p.title_type]]),
    p.amenities && p.amenities.length ? h("div", { class: "sv-chips" }, p.amenities.map((a) => h("span", { text: a }))) : null,
  ];
  out.push(
    h(
      "section",
      { class: "sv-detail", "aria-label": p.title },
      gallery(p.images, p.title),
      h(
        "div",
        { class: "sv-dhead" },
        h("div", { class: "sv-status", text: t("offPlan") }),
        h("h2", { class: "sv-dtitle", dir: "auto", text: cleanTitle(p.title) }),
        h("div", { class: "sv-loc", dir: "auto", text: [p.location, p.area].filter(Boolean).join(" — ") }),
        h("div", { class: "sv-dprice" }, h("span", { class: "sv-price", text: p.starting_price_aed ? t("from", { p: aed(p.starting_price_aed) }) : t("priceOnRequest") })),
        h("div", { class: "sv-keyfacts", text: [p.developer, p.handover ? t("handover", { h: p.handover }) : null].filter(Boolean).join(" · ") }),
      ),
      h("div", { class: "sv-actions" }, btn(t("prepare"), () => prepareMessage([ref]), { primary: true }), btn(t("whatsapp"), () => openLink(d.links ? d.links.whatsapp : waFor(p.url))), saveButton(ref)),
      h("div", { class: "sv-links" }, btn(t("website") + " ↗", () => openLink(d.links ? d.links.website : p.url), { small: true, ghost: true, aria: t("website") }), p.video_url ? btn(t("video") + " ↗", () => openLink(p.video_url), { small: true, ghost: true, aria: t("video") }) : null),
      planBox,
      disclosure(t("moreDetails"), more),
    ),
  );
  out.push(footer(d.data_as_of));
  return out;
}

function renderCompare(d) {
  const out = [header(t("compareTitle"))];
  if (d.status !== "ok") return out.concat(errorBox(d));
  const cols = d.items;
  const na = () => h("span", { class: "na", text: t("na") });
  const cell = (v) => (v === null || v === undefined || v === "" ? na() : document.createTextNode(String(v)));
  const head = h("tr", null, h("th", { scope: "col" }, h("span", { class: "sr", text: t("compareTitle") })), cols.map((c) => {
    const x = c.property || c.project;
    if (!x) return h("th", { scope: "col", text: c.slug + " — " + t("unavailable") });
    return h("th", { scope: "col" }, img(x.photos ? x.photos[0] : x.image, x.title), h("span", { dir: "auto", text: cleanTitle(x.title) }));
  }));
  const row = (label, fn) => h("tr", null, h("th", { scope: "row", text: label }), cols.map((c) => h("td", null, fn(c))));
  const anyProp = cols.some((c) => c.property);
  const anyOff = cols.some((c) => c.project);
  const main = [];
  const extra = [];
  main.push(row(t("rPrice"), (c) => (c.property ? cell(aed(c.property.price) || null) : c.project ? cell(c.project.starting_price_aed ? t("from", { p: aed(c.project.starting_price_aed) }) : null) : na())));
  if (anyProp) {
    main.push(row(t("rPpsf"), (c) => (c.property ? (c.property.purpose === "rent" ? h("span", { class: "na", text: t("naRent") }) : cell(c.property.price_per_sqft_aed ? aed(c.property.price_per_sqft_aed) : null)) : na())));
    main.push(row(t("rBeds"), (c) => cell(c.property ? bedsLabel(c.property.bedrooms) : null)));
    main.push(row(t("rSize"), (c) => cell(c.property && c.property.size_sqft ? t("sqft", { n: nf().format(c.property.size_sqft) }) : null)));
  }
  main.push(row(t("rLoc"), (c) => cell(c.property ? [c.property.building, c.property.location.label].filter(Boolean).join(", ") : c.project ? c.project.location : null)));
  if (anyOff) {
    main.push(row(t("rHandover"), (c) => cell(c.project ? c.project.handover : null)));
    main.push(row(t("rPlan"), (c) => cell(c.project && c.project.payment_plan ? [c.project.payment_plan.down_payment, c.project.payment_plan.during_construction, c.project.payment_plan.on_handover].map((x) => x || "—").join(" / ") : null)));
  }
  if (cols.some((c) => c.suitability && c.suitability.summary !== "no_requirements")) {
    main.push(row(t("rFit"), (c) => {
      const s = c.suitability;
      if (!s || s.summary === "no_requirements") return na();
      return h("div", null, h("span", { class: "sv-fit " + s.summary, text: t(s.summary) }), h("details", { class: "sv-fitd" }, h("summary", { text: t("why") }), h("ul", { class: "sv-fitlist" }, s.checks.map((k) => h("li", { text: k.requirement + ": " + t(k.fit === "meets" ? "yes" : k.fit === "does_not_meet" ? "no" : "unknown") + " (" + k.detail + ")" })))));
    }));
  }
  if (anyProp) {
    extra.push(row(t("rBaths"), (c) => cell(c.property ? c.property.bathrooms : null)));
    extra.push(row(t("rType"), (c) => cell(c.property ? typeLabel(c.property.property_type) : null)));
    extra.push(row(t("rStatus"), (c) => cell(c.property ? badgeFor(c.property) : c.project ? t("offPlan") : null)));
  }
  if (anyOff) {
    extra.push(row(t("rDev"), (c) => cell(c.project ? c.project.developer : null)));
    extra.push(row(t("rUnits"), (c) => cell(c.project ? c.project.unit_sizes : null)));
  }
  extra.push(row(t("rAmen"), (c) => {
    const a = (c.property && c.property.amenities) || (c.project && c.project.amenities) || [];
    return a.length ? document.createTextNode(a.join(", ")) : na();
  }));
  if (anyProp) extra.push(row(t("rAgent"), (c) => cell(c.property ? (c.property.agent ? c.property.agent.name : "Savoir Properties") : null)));
  const extraBody = h("tbody", { id: "sv-cmp-more", hidden: true }, extra);
  const toggle = btn(t("showAll"), () => {
    extraBody.hidden = !extraBody.hidden;
    toggle.setAttribute("aria-expanded", String(!extraBody.hidden));
    toggle.textContent = extraBody.hidden ? t("showAll") : t("showFewer");
  }, { small: true, ghost: true });
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "sv-cmp-more");
  out.push(h("div", { class: "sv-table-wrap" }, h("table", { class: "sv-cmp", style: "min-width:" + (120 + cols.length * 180) + "px" }, h("caption", { class: "sr", text: t("compareTitle") }), h("thead", null, head), h("tbody", null, main), extraBody)));
  const available = cols.filter((c) => c.available).map((c) => ({ kind: c.kind, slug: c.slug, title: (c.property || c.project).title }));
  out.push(h("div", { class: "sv-actions", style: "justify-content:space-between" }, toggle, available.length ? btn(t("prepareThese"), () => prepareMessage(available.slice(0, 4)), { primary: true }) : null));
  out.push(footer(d.data_as_of));
  return out;
}

function renderShortlist(d) {
  const s = d.shortlist;
  const out = [header(t("shortlist"), s ? (s.items.length === 1 ? t("shortlistCount1") : t("shortlistCountN", { n: s.items.length })) : "", { noShortlist: true })];
  if (!s) return out.concat(h("div", { class: "sv-empty", text: (d.error && d.error.message) || t("shortlistEmpty") }));
  // Changes made by the assistant (the card's own changes use notice()).
  if (d.change && d.change.added.length) out.push(h("div", { class: "sv-notice ok", role: "status" }, h("span", { text: t("savedTo") })));
  if (d.change && d.change.removed.length) out.push(h("div", { class: "sv-notice ok", role: "status" }, h("span", { text: t("removedFrom") })));
  if (d.rejected && d.rejected.length) out.push(h("div", { class: "sv-notice error", role: "alert" }, h("span", { text: t("saveFailed") + " " + t("notSavedWhy") })));
  if (!s.items.length) out.push(h("div", { class: "sv-empty", text: t("shortlistEmpty") }));
  else
    out.push(
      h(
        "div",
        { class: "sv-list" },
        s.items.map((i) =>
          h(
            "div",
            { class: "sv-li" },
            img(i.photo, i.title) || h("span"),
            h("div", null, h("div", { class: "t", dir: "auto", text: cleanTitle(i.title || i.slug) }), h("div", { class: "s", text: [i.price_label, i.location_label, i.bedrooms_label].filter(Boolean).join(" · ") }), h("div", { class: "s", text: t("asSaved") })),
            h("div", { class: "sv-li-act" }, btn(t("details"), () => openDetail(i.kind, i.slug, i.title || i.slug), { small: true, aria: t("details") + ": " + (i.title || i.slug) }), btn(t("remove"), () => toggleSave({ kind: i.kind, slug: i.slug, title: i.title || i.slug }), { small: true, ghost: true, aria: t("remove") + ": " + (i.title || i.slug) })),
          ),
        ),
      ),
    );
  const refs = s.items.map((i) => ({ kind: i.kind, slug: i.slug, title: i.title || i.slug }));
  if (refs.length) out.push(h("div", { class: "sv-actions" }, btn(t("prepareSaved"), () => prepareMessage(refs.slice(0, 4)), { primary: true }), refs.length >= 2 ? btn(t("compareN", { n: Math.min(4, refs.length) }), () => openCompare(refs.slice(0, 4))) : null));
  // share link
  if (s.share_url) {
    const input = h("input", { id: "sv-share-url", type: "text", readonly: true, value: s.share_url, "aria-label": t("shareTitle") });
    out.push(
      h(
        "div",
        { class: "sv-card2" },
        h("h3", { text: t("shareTitle") }),
        h("div", { class: "sv-share" }, input, btn(t("copyLink"), () => copyWithFeedback(s.share_url, input), { small: true, primary: true }), btn(t("openLink"), () => openLink(s.share_url), { small: true })),
        h("div", { class: "sv-actions", style: "justify-content:space-between" }, h("span", { class: "sv-note", text: t("shareNote") }), btn(t("stopShare"), async () => {
          const sc = await callTool("share_shortlist", { shortlist_id: s.shortlist_id, action: "stop_sharing" });
          if (sc) navigate(sc, false);
        }, { small: true, ghost: true })),
      ),
    );
  } else if (s.items.length) {
    out.push(
      h(
        "div",
        { class: "sv-card2" },
        h("h3", { text: t("shareTitle") }),
        h("div", { class: "sv-actions", style: "justify-content:space-between" }, h("span", { class: "sv-note", text: t("shareIntro") }), btn(t("createShare"), async () => {
          const sc = await callTool("share_shortlist", { shortlist_id: s.shortlist_id, action: "share" });
          if (sc) navigate(sc, false);
        }, { small: true })),
      ),
    );
  }
  // how long it lasts, then delete with inline confirmation
  out.push(h("div", { class: "sv-note", text: t("keptShort") }), disclosure(t("aboutShortlist"), [h("div", { class: "sv-note", text: t("persists") }), h("div", { class: "sv-note", text: t("reopen") })]));
  const confirmBox = h("div", { class: "sv-confirm", hidden: true }, h("span", { text: t("deleteQ") }), btn(t("yesDelete"), async () => {
    if (!canCallTools()) return notice(t("notAvailableHost"), "error");
    let r;
    try {
      r = await rawCall("delete_shortlist", { shortlist_id: s.shortlist_id });
    } catch (e) {
      return notice(t("deleteFailed") + " (" + errCode(e) + ")", "error");
    }
    const sc = r && r.structuredContent;
    if (!sc || sc.deleted !== true) return notice(t("deleteFailed") + " (" + ((sc && sc.status) || "no-result") + ")", "error");
    state.shortlistId = null;
    state.saved = new Set();
    updateModelContext();
    persist();
    state.current = null;
    root.replaceChildren(header(t("shortlist"), "", { noShortlist: true }), h("div", { class: "sv-empty", text: t("deleted") }));
    announce(t("deleted"));
  }, { small: true, primary: true }), btn(t("cancel"), () => (confirmBox.hidden = true), { small: true, ghost: true }));
  out.push(h("div", { class: "sv-endrow" }, btn(t("delete"), () => (confirmBox.hidden = false), { small: true, danger: true })), confirmBox);
  return out;
}

function renderInquiry(d) {
  const out = [header(t("msgTitle"))];
  const x = d.handoff;
  if (!x) return out.concat(h("div", { class: "sv-error", role: "alert" }, h("span", { text: (d.error && d.error.message) || t("error") }), btn(t("whatsapp"), () => openLink(CFG.companyWa), { small: true })));
  const area = h("textarea", { id: "sv-handoff-msg", class: "sv-msg", readonly: true, dir: x.language === "ar" ? "rtl" : "ltr", "aria-label": t("msgTitle") });
  area.value = x.message;
  out.push(area);
  if (x.unavailable && x.unavailable.length) out.push(h("div", { class: "sv-note", text: t("unavailable") + ": " + x.unavailable.map((u) => u.slug).join(", ") }));
  out.push(
    h(
      "div",
      { class: "sv-actions" },
      btn(t("sendWa"), () => openLink(x.channels.whatsapp_company), { primary: true }),
      x.channels.whatsapp_agent ? btn(t("sendWaAgent", { name: x.channels.whatsapp_agent.name }), () => openLink(x.channels.whatsapp_agent.url)) : null,
      btn(t("sendEmail"), () => openLink(x.channels.email), { ghost: true }),
      btn(t("copy"), () => copyWithFeedback(x.message, area), { ghost: true }),
    ),
    h("div", { class: "sv-note", text: t("notBooking") + " · " + x.reference_code }),
    h("div", { class: "sv-note", text: x.shared_information }),
  );
  return out;
}

function renderAreaGuide(d) {
  const out = [header(t("areasTitle"))];
  const g = d.guide;
  if (!g) return out.concat(errorBox(d));
  if (!g.areas.length) out.push(h("div", { class: "sv-empty", text: t("noResults") }));
  const input = state.lastSearch || {};
  if (g.areas.length)
    out.push(
      h(
        "div",
        { class: "sv-list" },
        g.areas.map((a) =>
          h(
            "div",
            { class: "sv-area" },
            h("div", null, h("div", { class: "t", text: a.area }), h("div", { class: "s", text: t("nListings", { n: a.matching_listings }) + (a.price_range_aed ? " · " + aed(a.price_range_aed.min) + " – " + aed(a.price_range_aed.max) : "") }), a.tags.length ? h("div", { class: "sv-chips" }, a.tags.map((x) => h("span", { text: x }))) : null, a.nearby.length ? h("div", { class: "s", text: t("nearby") + ": " + a.nearby.slice(0, 3).join(", ") }) : null),
            btn(t("searchHere"), () => {
              const args = { areas: [a.area] };
              if (input.purpose) args.purpose = input.purpose;
              if (typeof input.budget_max_aed === "number") args.max_price_aed = input.budget_max_aed;
              if (typeof input.budget_min_aed === "number") args.min_price_aed = input.budget_min_aed;
              if (typeof input.bedrooms === "number") args.bedrooms = input.bedrooms;
              runSearch("search_properties", args);
            }, { small: true }),
          ),
        ),
      ),
    );
  out.push(h("div", { class: "sv-note", text: t("editorial") }), footer(g.data_as_of));
  return out;
}

function render(d) {
  if (!d || typeof d !== "object") return;
  state.pendingMap = null;
  let nodes;
  switch (d.view) {
    case "property_list": nodes = renderPropertyList(d); break;
    case "offplan_list": nodes = renderOffplanList(d); break;
    case "property_detail": nodes = renderPropertyDetail(d); break;
    case "offplan_detail": nodes = renderOffplanDetail(d); break;
    case "compare": nodes = renderCompare(d); break;
    case "shortlist": nodes = renderShortlist(d); break;
    case "inquiry": nodes = renderInquiry(d); break;
    case "area_guide": nodes = renderAreaGuide(d); break;
    default: return;
  }
  destroyMap();
  const pending = state.pendingMap;
  root.replaceChildren(...[linkPanelNode(), noticeNode()].concat(nodes).filter(Boolean));
  if (pending) initPendingMap();
  else state.pendingMap = null;
}

// ---------- startup ----------
function applyHostContext(ctx) {
  if (!ctx) return;
  if (ctx.theme === "dark" || ctx.theme === "light") document.documentElement.setAttribute("data-theme", ctx.theme);
  if (ctx.locale) {
    const before = state.lang;
    setLocale(ctx.locale);
    if (before !== state.lang) rerender();
  }
  try {
    if (ctx.styles && ctx.styles.variables && SV && SV.applyHostStyleVariables) SV.applyHostStyleVariables(ctx.styles.variables);
  } catch (e) {}
}

/**
 * A tool result delivered by the host (not by a card button).
 * - Stale: same identity as a result already delivered (hosts re-send the original, e.g. ChatGPT's
 *   openai:set_globals snapshots). Ignored, so it can never undo the customer's navigation.
 * - Genuinely new: a different identity. Shown, and the card starts again from it.
 */
function onToolResult(sc, input) {
  if (!sc || typeof sc !== "object") return;
  let key;
  try {
    key = resultIdentity(sc);
  } catch (e) {
    return;
  }
  if (state.seenResults.has(key)) {
    if (input && !state.lastSearch) state.lastSearch = input;
    return;
  }
  state.seenResults.add(key);
  const first = !state.originKey;
  state.originKey = key;
  if (input) state.lastSearch = input;
  ingest(sc);
  state.history = [];
  state.navCalls = [];
  state.nav = null;
  state.userNavigated = false;
  state.mapSel = null;
  state.mapArea = null;
  state.mapFailed = null;
  state.current = sc;
  render(sc);
  if (first) restoreNavigation();
  else persist();
}
/** After a card reload, reopen the view the customer had opened (saved in the host's widget state). */
async function restoreNavigation() {
  const o = globalThis.openai;
  const ws = o && o.widgetState;
  if (!ws || !ws.nav || !RESTORABLE.has(ws.nav.name) || ws.origin !== shortHash(state.originKey)) return;
  const sc = await callTool(ws.nav.name, ws.nav.args || {}, { silentError: true });
  if (!sc) return notice(t("restoreFailed") + " (" + (state.lastError || "failed") + ")", "error", { label: t("retry"), fn: () => restoreNavigation() });
  if (!state.userNavigated || (state.current && resultIdentity(state.current) === state.originKey)) navigate(sc, true);
}

function reportUiError(code) {
  try {
    notice(t("error") + " (" + code + ")", "error");
  } catch (e) {}
}
window.addEventListener("error", (e) => {
  // Benign browser notices (e.g. ResizeObserver loop) are not failures of an action.
  if (e && /ResizeObserver/.test(String(e.message || ""))) return;
  reportUiError("ui-error");
});
window.addEventListener("unhandledrejection", () => reportUiError("ui-promise"));

async function start() {
  setLocale(document.documentElement.lang || navigator.language);
  const oa = globalThis.openai;
  if (oa) {
    if (oa.widgetState && typeof oa.widgetState === "object") {
      state.shortlistId = oa.widgetState.shortlistId || null;
      state.compare = Array.isArray(oa.widgetState.compare) ? oa.widgetState.compare.slice(0, 4) : [];
    }
    if (oa.locale) setLocale(oa.locale);
    if (oa.theme) applyHostContext({ theme: oa.theme });
    if (oa.toolOutput) onToolResult(oa.toolOutput, oa.toolInput || null);
    window.addEventListener("openai:set_globals", (e) => {
      // Only a changed tool result matters; theme, height and widget-state updates must not re-render the card.
      const changed = (e && e.detail && e.detail.globals) || {};
      const o = globalThis.openai;
      if (changed.theme && (changed.theme === "dark" || changed.theme === "light")) applyHostContext({ theme: changed.theme });
      if (!("toolOutput" in changed) || !o || !o.toolOutput) return;
      onToolResult(o.toolOutput, o.toolInput || null);
    });
  }
  if (SV && SV.App) {
    let pendingInput = null;
    const candidate = new SV.App({ name: "savoir-listings", version: "2.0.0" }, {}, { autoResize: true });
    candidate.ontoolinput = (p) => (pendingInput = (p && p.arguments) || null);
    candidate.ontoolresult = (r) => onToolResult(r && r.structuredContent, pendingInput);
    candidate.onhostcontextchanged = (ctx) => applyHostContext(ctx);
    try {
      await Promise.race([candidate.connect(), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000))]);
      state.app = candidate;
      state.caps = candidate.getHostCapabilities() || {};
      applyHostContext(candidate.getHostContext());
    } catch (e) {
      if (!state.current) root.replaceChildren(h("div", { class: "sv-empty", text: t("notAvailableHost") }));
    }
  }
}
start();
