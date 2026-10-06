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
};

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
  return h("button", { type: "button", class: "sv-btn" + (opts.primary ? " primary" : "") + (opts.small ? " small" : ""), "aria-label": opts.aria || null, disabled: opts.disabled || null, onclick: onClick }, label);
}
function announce(msg) {
  live.textContent = "";
  setTimeout(() => (live.textContent = msg), 30);
}
const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.2C.8 8.3 3 4.5 6.7 4.5c2 0 3.5 1.1 4.3 2.4.8-1.3 2.3-2.4 4.3-2.4 3.7 0 5.9 3.8 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>';
const HEART_O = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 20s-7-4.3-9-8.6C1.6 8.3 3.6 5.5 6.7 5.5c1.9 0 3.4 1.1 4.2 2.6h2.2c.8-1.5 2.3-2.6 4.2-2.6 3.1 0 5.1 2.8 3.7 5.9C19 15.7 12 20 12 20z"/></svg>';

function brand(title, sub) {
  return h("div", { class: "sv-brand" }, h("div", null, h("div", { class: "ttl", text: title }), sub ? h("div", { class: "sub", text: sub }) : null), h("img", { src: CFG.logoUrl, alt: "Savoir Properties" }));
}

// ---------- host bridge ----------
async function openLink(url) {
  // https only (plus local development servers); mailto/tel for contact buttons.
  if (!/^(https:|mailto:|tel:|http:\/\/(127\.0\.0\.1|localhost)[:/])/.test(url)) return;
  try {
    if (state.app) {
      const r = await state.app.openLink({ url: url });
      if (!r || !r.isError) return;
    }
  } catch (e) {}
  const oa = globalThis.openai;
  if (oa && typeof oa.openExternal === "function") return oa.openExternal({ href: url });
  window.open(url, "_blank", "noopener,noreferrer");
}
async function sendMessage(text) {
  try {
    if (state.app) return await state.app.sendMessage({ role: "user", content: [{ type: "text", text: text }] });
  } catch (e) {}
  const oa = globalThis.openai;
  if (oa && typeof oa.sendFollowUpMessage === "function") oa.sendFollowUpMessage({ prompt: text });
}
function canCallTools() {
  return !!(state.app || (globalThis.openai && typeof globalThis.openai.callTool === "function"));
}
async function rawCall(name, args) {
  if (state.app) return state.app.callServerTool({ name: name, arguments: args });
  return globalThis.openai.callTool(name, args);
}
/** Call a server tool with a loading state; renders a retryable error on failure. */
async function callTool(name, args, opts) {
  opts = opts || {};
  if (!canCallTools()) {
    announce(t("notAvailableHost"));
    if (opts.fallbackMessage) sendMessage(opts.fallbackMessage);
    return null;
  }
  root.classList.add("sv-loading");
  root.setAttribute("aria-busy", "true");
  try {
    const r = await rawCall(name, args);
    const sc = r && r.structuredContent;
    if (!sc) throw new Error("empty");
    ingest(sc);
    return sc;
  } catch (e) {
    if (!opts.silentError) showError(() => callTool(name, args, opts).then((sc) => sc && opts.render !== false && navigate(sc, opts.push)));
    return null;
  } finally {
    root.classList.remove("sv-loading");
    root.removeAttribute("aria-busy");
  }
}
function showError(retry) {
  const bar = h("div", { class: "sv-error", role: "alert" }, h("span", { text: t("error") }), btn(t("retry"), () => retry(), { small: true }));
  root.prepend(bar);
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
  const old = document.getElementById("sv-notice");
  if (old) old.remove();
  const node = noticeNode();
  if (node) root.prepend(node);
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
      oa.setWidgetState({ shortlistId: state.shortlistId, compare: state.compare });
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
    // The host cannot run tools from the card: ask the assistant instead, and claim nothing.
    sendMessage((wasSaved ? "Remove from my shortlist: " : "Save to my shortlist: ") + ref.title + " (" + ref.kind + " " + ref.slug + ")");
    return;
  }
  const sc = await callTool("update_shortlist", args, { render: false, silentError: true });
  const retry = { label: t("retry"), fn: () => toggleSave(ref, btnEl) };
  if (!sc) return notice(wasSaved ? t("removeFailed") : t("saveFailed"), "error", retry);
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
  if (push && state.current) state.history.push(state.current);
  if (state.history.length > 10) state.history.shift();
  state.current = sc;
  render(sc);
}
function rerender() {
  if (state.current) render(state.current);
}
function backButton() {
  if (!state.history.length) return null;
  return btn("← " + t("back"), () => {
    state.current = state.history.pop();
    render(state.current);
  }, { small: true });
}
function topRow() {
  const b = backButton();
  const n = state.shortlistId ? state.saved.size : 0;
  const sl = btn(t("viewShortlist", { n: n }), openShortlist, { small: true });
  sl.classList.add("sv-mylist");
  return h("div", { class: "sv-foot", style: "margin-bottom:8px" }, b || h("span"), sl);
}

// ---------- components ----------
function badgeFor(p) {
  if (p.completion === "off_plan") return t("offPlan");
  if (p.purpose === "rent") return t("forRent");
  if (p.purpose === "sale") return t("forSale");
  return null;
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
function compareCheck(ref) {
  const checked = state.compare.some((c) => c.kind === ref.kind && c.slug === ref.slug);
  const input = h("input", { type: "checkbox", checked: checked || null, "aria-label": t("compare") + ": " + ref.title });
  input.addEventListener("change", () => toggleCompare(ref, input.checked));
  return h("label", { class: "sv-check" }, input, t("compare"));
}
function waFor(url) {
  return CFG.companyWa + "?text=" + encodeURIComponent((state.lang === "ar" ? "مرحباً، أرغب في الاستفسار عن هذا العقار: " : "Hello, I'm interested in this property: ") + url);
}

function propertyCard(p) {
  const ref = { kind: "property", slug: p.slug, title: p.title };
  const sel = state.compare.some((c) => c.kind === "property" && c.slug === p.slug);
  const meta = [bedsLabel(p.bedrooms), p.bathrooms !== null && p.bathrooms !== undefined ? t("baths", { n: p.bathrooms }) : null, typeLabel(p.property_type)].filter(Boolean);
  const chips = p.amenity_check
    ? h("div", { class: "sv-chips" }, p.amenity_check.matched.map((k) => h("span", { class: "ok", text: "✓ " + k.replace(/_/g, " ") })), p.amenity_check.not_listed.map((k) => h("span", { class: "no", text: t("notListed") + ": " + k.replace(/_/g, " ") })))
    : null;
  return h(
    "article",
    { class: "sv-card" + (sel ? " selected" : ""), "aria-label": p.title },
    h("div", { class: "sv-ph" }, img(p.photo, p.title), badgeFor(p) ? h("span", { class: "sv-badge", text: badgeFor(p) }) : null, heart(ref)),
    h(
      "div",
      { class: "sv-body" },
      h("div", { class: "sv-title", text: p.title }),
      p.location && p.location.label ? h("div", { class: "sv-loc", text: p.location.label }) : null,
      h("div", { class: "sv-price", text: aed(p.price) || t("priceOnRequest") }),
      h("div", { class: "sv-meta" }, meta.map((m) => h("span", { text: m }))),
      chips,
      h("div", { class: "sv-actions" }, btn(t("details"), () => openDetail("property", p.slug, p.title), { primary: true, aria: t("details") + ": " + p.title }), btn(t("whatsapp"), () => openLink((p.links && p.links.whatsapp) || waFor(p.url)), { aria: t("whatsapp") + ": " + p.title }), compareCheck(ref)),
    ),
  );
}
function offplanCard(p) {
  const ref = { kind: "offplan", slug: p.slug, title: p.title };
  return h(
    "article",
    { class: "sv-card", "aria-label": p.title },
    h("div", { class: "sv-ph" }, img(p.image, p.title), h("span", { class: "sv-badge", text: t("offPlan") }), heart(ref)),
    h(
      "div",
      { class: "sv-body" },
      h("div", { class: "sv-title", text: p.title }),
      p.location ? h("div", { class: "sv-loc", text: p.location }) : null,
      h("div", { class: "sv-price", text: p.starting_price_aed ? t("from", { p: aed(p.starting_price_aed) }) : t("priceOnRequest") }),
      h("div", { class: "sv-meta" }, [p.developer, p.handover ? t("handover", { h: p.handover }) : null].filter(Boolean).map((m) => h("span", { text: m }))),
      h("div", { class: "sv-actions" }, btn(t("details"), () => openDetail("offplan", p.slug, p.title), { primary: true, aria: t("details") + ": " + p.title }), btn(t("whatsapp"), () => openLink((p.links && p.links.whatsapp) || waFor(p.url))), compareCheck(ref)),
    ),
  );
}
function compareBar() {
  if (!state.compare.length) return null;
  return h(
    "div",
    { class: "sv-bar", role: "region", "aria-label": t("compare") },
    h("span", { class: "sv-sub", text: state.compare.length < 2 ? t("compareHint") : state.compare.map((c) => c.title).join(" · ") }),
    h("div", { class: "sv-actions", style: "padding:0" }, btn(t("clear"), () => toggleCompareClear(), { small: true }), btn(t("compareN", { n: state.compare.length }), () => openCompare(state.compare), { primary: true, small: true, disabled: state.compare.length < 2 })),
  );
}
function toggleCompareClear() {
  state.compare = [];
  updateModelContext();
  persist();
  rerender();
}
function asOf(iso) {
  return iso ? h("div", { class: "sv-note", text: t("asOf", { t: when(iso) }) + " · " + t("disclaimer") }) : h("div", { class: "sv-note", text: t("disclaimer") });
}
function fact(label, value) {
  const f = h("div", { class: "sv-fact" }, h("b", { text: label }));
  f.appendChild(document.createTextNode(value === null || value === undefined || value === "" ? t("na") : String(value)));
  return f;
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

// ---------- views ----------
function renderPropertyList(d) {
  const pg = d.pagination;
  const sub = pg && pg.total_results ? (pg.total_results === 1 ? t("result1") : t("results", { n: nf().format(pg.total_results) })) + (pg.total_pages > 1 ? " · " + t("pageOf", { p: pg.page, t: pg.total_pages }) : "") : "";
  const out = [brand(t("listings"), sub), topRow()];
  if (d.status === "error" || d.status === "invalid_input") {
    out.push(h("div", { class: "sv-error", role: "alert" }, h("span", { text: (d.error && d.error.message) || t("error") })));
    return out;
  }
  if (!d.items.length) {
    out.push(h("div", { class: "sv-empty", text: t("noResults") }));
    if (d.alternatives && d.alternatives.length) {
      out.push(h("h3", { class: "sv-sub", style: "margin:10px 2px 0;font-size:13px", text: t("alternatives") }));
      d.alternatives.forEach((a) =>
        out.push(
          h(
            "div",
            { class: "sv-alt" },
            h("h3", { text: a.description }),
            h("div", { class: "sv-sub", text: t("nListings", { n: a.total_results }) }),
            h("div", { class: "sv-mini" }, a.sample.map((s) => h("div", null, h("b", { text: s.title }), h("br"), (aed(s.price) || t("priceOnRequest")) + (s.location && s.location.label ? " · " + s.location.label : "")))),
            h("div", { class: "sv-actions" }, btn(t("showThese"), () => runSearch("search_properties", a.search_args), { primary: true, small: true })),
          ),
        ),
      );
    }
  } else {
    out.push(h("div", { class: "sv-row" }, d.items.map(propertyCard)));
    if (d.amenity_note) out.push(h("div", { class: "sv-note", text: t("amenNote") }));
  }
  const foot = h("div", { class: "sv-foot" }, asOf(d.data_as_of));
  if (pg && pg.has_more && state.lastSearch) foot.appendChild(btn(t("more"), () => runSearch("search_properties", Object.assign({}, state.lastSearch, { page: pg.page + 1 })), { small: true }));
  out.push(foot, compareBar());
  return out;
}

function renderOffplanList(d) {
  const pg = d.pagination;
  const sub = pg && pg.total_results ? t("results", { n: pg.total_results }) : "";
  const out = [brand(t("offplan"), sub), topRow()];
  if (d.status === "error") return out.concat(h("div", { class: "sv-error", role: "alert" }, h("span", { text: (d.error && d.error.message) || t("error") })));
  if (!d.items.length) out.push(h("div", { class: "sv-empty", text: t("noResults") }));
  else out.push(h("div", { class: "sv-row" }, d.items.map(offplanCard)));
  if (d.notes && d.notes.length) out.push(h("div", { class: "sv-note", text: d.notes.join(" ") }));
  const foot = h("div", { class: "sv-foot" }, asOf(d.data_as_of));
  if (pg && pg.has_more && state.lastSearch) foot.appendChild(btn(t("more"), () => runSearch("search_offplan_projects", Object.assign({}, state.lastSearch, { page: pg.page + 1 })), { small: true }));
  out.push(foot, compareBar());
  return out;
}

function renderPropertyDetail(d) {
  const out = [topRow()];
  const p = d.property;
  if (!p) return out.concat(h("div", { class: d.status === "not_found" ? "sv-empty" : "sv-error", text: (d.error && d.error.message) || t("error") }));
  const ref = { kind: "property", slug: p.slug, title: p.title };
  const saved = state.saved.has("property:" + p.slug);
  const facts = [
    fact(t("rStatus"), badgeFor(p)),
    fact(t("rType"), typeLabel(p.property_type)),
    fact(t("rBeds"), p.bedrooms === 0 ? t("studio") : p.bedrooms),
    fact(t("rBaths"), p.bathrooms),
    fact(t("rSize"), p.size_sqft ? t("sqft", { n: nf().format(p.size_sqft) }) : null),
    fact(t("rPpsf"), p.purpose === "rent" ? t("naRent") : p.price_per_sqft_aed ? aed(p.price_per_sqft_aed) : null),
    p.reference_number ? fact(t("rRef"), p.reference_number) : null,
    p.permit_number ? fact(t("rPermit"), p.permit_number) : null,
  ].filter(Boolean);
  const wa = d.links ? d.links.whatsapp : p.agent && p.agent.whatsapp_url ? p.agent.whatsapp_url + "?text=" + encodeURIComponent("Hello, I'm interested in this property: " + p.url) : waFor(p.url);
  const site = d.links ? d.links.website : p.url;
  out.push(
    h(
      "div",
      { class: "sv-detail" },
      gallery(p.photos, p.title),
      h(
        "div",
        { class: "sv-dbody" },
        h("h2", { class: "sv-dtitle", text: p.title }),
        h("div", { class: "sv-loc", text: [p.building, p.location && p.location.label].filter(Boolean).join(", ") }),
        h("div", { class: "sv-price", text: aed(p.price) || t("priceOnRequest") }),
        h("div", { class: "sv-facts" }, facts),
        p.amenities && p.amenities.length ? h("div", { class: "sv-chips" }, p.amenities.map((a) => h("span", { text: a }))) : null,
        h(
          "div",
          { class: "sv-agent" },
          h("div", { text: p.agent ? t("agent") + ": " + p.agent.name : "Savoir Properties" }),
          h(
            "div",
            { class: "sv-actions", style: "padding:0" },
            btn(saved ? "♥ " + t("unsave") : "♡ " + t("save"), () => toggleSave(ref), { small: true }),
            btn(t("prepare"), () => prepareMessage([ref]), { primary: true, small: true }),
            btn(t("whatsapp"), () => openLink(wa), { small: true }),
            btn(t("website"), () => openLink(site), { small: true }),
          ),
        ),
        h("label", { class: "sv-check" }, (() => {
          const c = h("input", { type: "checkbox", checked: state.compare.some((x) => x.slug === p.slug) || null });
          c.addEventListener("change", () => toggleCompare(ref, c.checked));
          return c;
        })(), t("compare")),
        asOf(d.data_as_of),
      ),
    ),
  );
  if (p.similar_properties && p.similar_properties.length) out.push(h("div", { class: "sv-head" }, h("h2", { text: t("similar") })), h("div", { class: "sv-row" }, p.similar_properties.map((s) => propertyCard(Object.assign({ saved: false, amenity_check: null }, s)))));
  out.push(compareBar());
  return out;
}

function renderOffplanDetail(d) {
  const out = [topRow()];
  const p = d.project;
  if (!p) return out.concat(h("div", { class: d.status === "not_found" ? "sv-empty" : "sv-error", text: (d.error && d.error.message) || t("error") }));
  const ref = { kind: "offplan", slug: p.slug, title: p.title };
  const saved = state.saved.has("offplan:" + p.slug);
  const plan = p.payment_plan
    ? h("div", { class: "sv-plan", role: "list", "aria-label": t("plan") }, [[t("down"), p.payment_plan.down_payment], [t("during"), p.payment_plan.during_construction], [t("onHandover"), p.payment_plan.on_handover]].map((x) => h("div", { role: "listitem" }, h("b", { text: x[1] || "—" }), x[0])))
    : null;
  const priceInput = h("input", { type: "number", inputmode: "numeric", min: "10000", step: "1000", placeholder: t("calcPh"), "aria-label": t("calcPh") });
  const calc = p.payment_plan
    ? h("div", null, h("div", { class: "sv-sub", text: t("calcTitle") }), h("div", { class: "sv-calc" }, priceInput, btn(t("calcBtn"), async () => {
        const v = Number(priceInput.value);
        if (!v || v < 10000) return priceInput.focus();
        const args = { slug: p.slug, unit_price_aed: v };
        if (state.shortlistId) args.shortlist_id = state.shortlistId;
        const sc = await callTool("get_offplan_project_details", args);
        if (sc) navigate(sc, false);
      }, { small: true })))
    : null;
  const sched = d.payment_schedule
    ? h("div", { class: "sv-table-wrap" }, h("table", { class: "sv-cmp" }, h("tbody", null, d.payment_schedule.stages.map((s) => h("tr", null, h("th", { scope: "row", text: s.label }), h("td", { text: s.percent + "% = " + aed(s.amount_aed) }))))), h("div", { class: "sv-note", style: "padding:0 8px", text: d.payment_schedule.notes.join(" ") }))
    : d.payment_schedule_note
      ? h("div", { class: "sv-note", text: d.payment_schedule_note })
      : null;
  out.push(
    h(
      "div",
      { class: "sv-detail" },
      gallery(p.images, p.title),
      h(
        "div",
        { class: "sv-dbody" },
        h("h2", { class: "sv-dtitle", text: p.title }),
        h("div", { class: "sv-loc", text: [p.location, p.area].filter(Boolean).join(" — ") }),
        h("div", { class: "sv-price", text: p.starting_price_aed ? t("from", { p: aed(p.starting_price_aed) }) : t("priceOnRequest") }),
        h("div", { class: "sv-facts" }, [fact(t("rDev"), p.developer), fact(t("rHandover"), p.handover), fact(t("rUnits"), p.unit_sizes), fact(t("rLifestyle"), p.lifestyle), fact(t("rTitleType"), p.title_type)]),
        plan,
        calc,
        sched,
        p.amenities && p.amenities.length ? h("div", { class: "sv-chips" }, p.amenities.map((a) => h("span", { text: a }))) : null,
        h(
          "div",
          { class: "sv-actions" },
          btn(saved ? "♥ " + t("unsave") : "♡ " + t("save"), () => toggleSave(ref), { small: true }),
          btn(t("prepare"), () => prepareMessage([ref]), { primary: true, small: true }),
          btn(t("whatsapp"), () => openLink(d.links ? d.links.whatsapp : waFor(p.url)), { small: true }),
          btn(t("website"), () => openLink(d.links ? d.links.website : p.url), { small: true }),
          p.video_url ? btn(t("video"), () => openLink(p.video_url), { small: true }) : null,
        ),
        asOf(d.data_as_of),
      ),
    ),
  );
  return out;
}

function renderCompare(d) {
  const out = [topRow(), brand(t("compareTitle"))];
  if (d.status !== "ok") return out.concat(h("div", { class: "sv-error", role: "alert" }, h("span", { text: (d.error && d.error.message) || t("error") })));
  const cols = d.items;
  const na = () => h("span", { class: "na", text: t("na") });
  const cell = (v) => (v === null || v === undefined || v === "" ? na() : document.createTextNode(String(v)));
  const props = cols.map((c) => c.property || c.project);
  const head = h("tr", null, h("th", { scope: "col" }), cols.map((c) => {
    const x = c.property || c.project;
    if (!x) return h("th", { scope: "col", text: c.slug + " — " + t("unavailable") });
    return h("th", { scope: "col" }, img(x.photos ? x.photos[0] : x.image, x.title), x.title);
  }));
  const row = (label, fn) => h("tr", null, h("th", { scope: "row", text: label }), cols.map((c) => h("td", null, fn(c))));
  const rows = [];
  const anyProp = cols.some((c) => c.property);
  const anyOff = cols.some((c) => c.project);
  rows.push(row(t("rPrice"), (c) => (c.property ? cell(aed(c.property.price) || null) : c.project ? cell(c.project.starting_price_aed ? t("from", { p: aed(c.project.starting_price_aed) }) : null) : na())));
  if (anyProp) {
    rows.push(row(t("rPpsf"), (c) => (c.property ? (c.property.purpose === "rent" ? h("span", { class: "na", text: t("naRent") }) : cell(c.property.price_per_sqft_aed ? aed(c.property.price_per_sqft_aed) : null)) : na())));
    rows.push(row(t("rBeds"), (c) => cell(c.property ? bedsLabel(c.property.bedrooms) : null)));
    rows.push(row(t("rBaths"), (c) => cell(c.property ? c.property.bathrooms : null)));
    rows.push(row(t("rSize"), (c) => cell(c.property && c.property.size_sqft ? t("sqft", { n: nf().format(c.property.size_sqft) }) : null)));
    rows.push(row(t("rType"), (c) => cell(c.property ? typeLabel(c.property.property_type) : null)));
    rows.push(row(t("rStatus"), (c) => cell(c.property ? badgeFor(c.property) : c.project ? t("offPlan") : null)));
  }
  rows.push(row(t("rLoc"), (c) => cell(c.property ? [c.property.building, c.property.location.label].filter(Boolean).join(", ") : c.project ? c.project.location : null)));
  if (anyOff) {
    rows.push(row(t("rDev"), (c) => cell(c.project ? c.project.developer : null)));
    rows.push(row(t("rHandover"), (c) => cell(c.project ? c.project.handover : null)));
    rows.push(row(t("rPlan"), (c) => cell(c.project && c.project.payment_plan ? [c.project.payment_plan.down_payment, c.project.payment_plan.during_construction, c.project.payment_plan.on_handover].map((x) => x || "—").join(" / ") : null)));
    rows.push(row(t("rUnits"), (c) => cell(c.project ? c.project.unit_sizes : null)));
  }
  rows.push(row(t("rAmen"), (c) => {
    const a = (c.property && c.property.amenities) || (c.project && c.project.amenities) || [];
    return a.length ? document.createTextNode(a.join(", ")) : na();
  }));
  if (anyProp) rows.push(row(t("rAgent"), (c) => cell(c.property ? (c.property.agent ? c.property.agent.name : "Savoir Properties") : null)));
  if (cols.some((c) => c.suitability && c.suitability.summary !== "no_requirements")) {
    rows.push(row(t("rFit"), (c) => {
      const s = c.suitability;
      if (!s || s.summary === "no_requirements") return na();
      return h("div", null, h("span", { class: "sv-fit " + s.summary, text: t(s.summary) }), h("ul", { class: "sv-fitlist" }, s.checks.map((k) => h("li", { text: k.requirement + ": " + t(k.fit === "meets" ? "yes" : k.fit === "does_not_meet" ? "no" : "unknown") + " (" + k.detail + ")" }))));
    }));
  }
  out.push(h("div", { class: "sv-table-wrap" }, h("table", { class: "sv-cmp" }, h("caption", { class: "sr", text: t("compareTitle") }), h("thead", null, head), h("tbody", null, rows))));
  const available = cols.filter((c) => c.available).map((c) => ({ kind: c.kind, slug: c.slug, title: (c.property || c.project).title }));
  out.push(h("div", { class: "sv-foot" }, asOf(d.data_as_of), available.length ? btn(t("prepareThese"), () => prepareMessage(available.slice(0, 4)), { primary: true, small: true }) : null));
  return out;
}

function renderShortlist(d) {
  const out = [backButton()];
  const s = d.shortlist;
  out.push(brand(t("shortlist"), s ? (s.items.length === 1 ? t("shortlistCount1") : t("shortlistCountN", { n: s.items.length })) : ""));
  if (!s) return out.concat(h("div", { class: "sv-empty", text: (d.error && d.error.message) || t("shortlistEmpty") }));
  // Changes made by the assistant (the card's own changes use notice()).
  if (d.change && d.change.added.length) out.push(h("div", { class: "sv-notice ok", role: "status", text: t("savedTo") }));
  if (d.change && d.change.removed.length) out.push(h("div", { class: "sv-notice ok", role: "status", text: t("removedFrom") }));
  if (d.rejected && d.rejected.length) out.push(h("div", { class: "sv-notice error", role: "alert", text: t("saveFailed") + " " + t("notSavedWhy") }));
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
            h("div", null, h("div", { class: "t", text: i.title || i.slug }), h("div", { class: "sv-sub", text: [i.price_label, i.location_label, i.bedrooms_label].filter(Boolean).join(" · ") }), h("div", { class: "sv-sub", text: t("asSaved") })),
            h("div", { class: "sv-actions", style: "padding:0;flex-direction:column" }, btn(t("details"), () => openDetail(i.kind, i.slug, i.title || i.slug), { small: true }), btn(t("remove"), () => toggleSave({ kind: i.kind, slug: i.slug, title: i.title || i.slug }), { small: true, aria: t("remove") + ": " + (i.title || i.slug) })),
          ),
        ),
      ),
    );
  const refs = s.items.map((i) => ({ kind: i.kind, slug: i.slug, title: i.title || i.slug }));
  const actions = h(
    "div",
    { class: "sv-actions" },
    refs.length >= 2 ? btn(t("compareN", { n: Math.min(4, refs.length) }), () => openCompare(refs.slice(0, 4)), { small: true }) : null,
    refs.length ? btn(t("prepareSaved"), () => prepareMessage(refs.slice(0, 4)), { primary: true, small: true }) : null,
  );
  out.push(actions);
  // share link
  if (s.share_url) {
    const input = h("input", { id: "sv-share-url", type: "text", readonly: true, value: s.share_url, "aria-label": t("share"), style: "flex:1 1 220px;min-height:32px;border:1px solid var(--sv-line);border-radius:8px;padding:4px 8px;background:var(--sv-bg);color:var(--sv-fg)" });
    out.push(
      h("div", { class: "sv-calc", style: "margin-top:8px" }, input, btn(t("copyLink"), () => copyWithFeedback(s.share_url, input), { small: true, primary: true }), btn(t("openLink"), () => openLink(s.share_url), { small: true }), btn(t("stopShare"), async () => {
        const sc = await callTool("share_shortlist", { shortlist_id: s.shortlist_id, action: "stop_sharing" });
        if (sc) navigate(sc, false);
      }, { small: true })),
      h("div", { class: "sv-note", text: t("shareNote") }),
    );
  } else if (s.items.length) {
    out.push(h("div", { class: "sv-actions" }, btn(t("createShare"), async () => {
      const sc = await callTool("share_shortlist", { shortlist_id: s.shortlist_id, action: "share" });
      if (sc) navigate(sc, false);
    }, { small: true })));
  }
  // delete with inline confirmation
  const confirmBox = h("div", { class: "sv-confirm", hidden: true }, h("span", { text: t("deleteQ") }), btn(t("yesDelete"), async () => {
    if (!canCallTools()) return;
    try {
      await rawCall("delete_shortlist", { shortlist_id: s.shortlist_id });
    } catch (e) {
      return showError(() => {});
    }
    state.shortlistId = null;
    state.saved = new Set();
    updateModelContext();
    persist();
    root.replaceChildren(brand(t("shortlist")), h("div", { class: "sv-empty", text: t("deleted") }));
    announce(t("deleted"));
  }, { small: true }), btn(t("cancel"), () => (confirmBox.hidden = true), { small: true }));
  out.push(h("div", { class: "sv-note", text: t("persists") }), h("div", { class: "sv-note", text: t("reopen") }), h("div", { class: "sv-foot" }, h("span"), btn(t("delete"), () => (confirmBox.hidden = false), { small: true })), confirmBox);
  return out;
}

function renderInquiry(d) {
  const out = [backButton(), brand(t("msgTitle"))];
  const x = d.handoff;
  if (!x) return out.concat(h("div", { class: "sv-error", role: "alert" }, h("span", { text: (d.error && d.error.message) || t("error") }), btn(t("whatsapp"), () => openLink(CFG.companyWa), { small: true })));
  const area = h("textarea", { id: "sv-handoff-msg", class: "sv-msg", readonly: true, dir: x.language === "ar" ? "rtl" : "ltr", "aria-label": t("msgTitle") });
  area.value = x.message;
  out.push(area, h("div", { class: "sv-note", text: x.shared_information }));
  if (x.unavailable && x.unavailable.length) out.push(h("div", { class: "sv-note", text: t("unavailable") + ": " + x.unavailable.map((u) => u.slug).join(", ") }));
  out.push(
    h(
      "div",
      { class: "sv-actions" },
      btn(t("sendWa"), () => openLink(x.channels.whatsapp_company), { primary: true }),
      x.channels.whatsapp_agent ? btn(t("sendWaAgent", { name: x.channels.whatsapp_agent.name }), () => openLink(x.channels.whatsapp_agent.url)) : null,
      btn(t("sendEmail"), () => openLink(x.channels.email)),
      btn(t("copy"), () => copyWithFeedback(x.message, area)),
    ),
    h("div", { class: "sv-note", text: t("notBooking") + " · " + x.reference_code }),
  );
  return out;
}

function renderAreaGuide(d) {
  const out = [topRow(), brand(t("areasTitle"))];
  const g = d.guide;
  if (!g) return out.concat(h("div", { class: "sv-error", role: "alert" }, h("span", { text: (d.error && d.error.message) || t("error") })));
  if (!g.areas.length) out.push(h("div", { class: "sv-empty", text: t("noResults") }));
  const input = state.lastSearch || {};
  out.push(
    h(
      "div",
      { class: "sv-list" },
      g.areas.map((a) =>
        h(
          "div",
          { class: "sv-li", style: "grid-template-columns:1fr auto" },
          h("div", null, h("div", { class: "t", text: a.area }), h("div", { class: "sv-sub", text: t("nListings", { n: a.matching_listings }) + (a.price_range_aed ? " · " + aed(a.price_range_aed.min) + " – " + aed(a.price_range_aed.max) : "") }), a.tags.length ? h("div", { class: "sv-chips" }, a.tags.map((x) => h("span", { text: x }))) : null, a.nearby.length ? h("div", { class: "sv-sub", text: t("nearby") + ": " + a.nearby.slice(0, 3).join(", ") }) : null),
          btn(t("searchHere"), () => {
            const args = { areas: [a.area] };
            if (input.purpose) args.purpose = input.purpose;
            if (typeof input.budget_max_aed === "number") args.max_price_aed = input.budget_max_aed;
            if (typeof input.budget_min_aed === "number") args.min_price_aed = input.budget_min_aed;
            if (typeof input.bedrooms === "number") args.bedrooms = input.bedrooms;
            runSearch("search_properties", args);
          }, { primary: true, small: true }),
        ),
      ),
    ),
    h("div", { class: "sv-note", text: t("editorial") }),
    asOf(g.data_as_of),
  );
  return out;
}

function render(d) {
  if (!d || typeof d !== "object") return;
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
  root.replaceChildren(...[noticeNode()].concat(nodes).filter(Boolean));
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

function onToolResult(sc, input) {
  if (input) state.lastSearch = input;
  ingest(sc);
  state.history = [];
  state.current = sc;
  render(sc);
}

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
    window.addEventListener("openai:set_globals", () => globalThis.openai && globalThis.openai.toolOutput && onToolResult(globalThis.openai.toolOutput, globalThis.openai.toolInput || null));
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
