/**
 * Browser verification of the widget through the official MCP Apps host bridge
 * (AppBridge + PostMessageTransport) with live tool results from a running server,
 * under the CSP the server declares. This is a SIMULATED host — it does not prove
 * behaviour inside ChatGPT or Claude.
 *
 *   npm run dev   (or a built server)       then   npm run preview:widget
 * Env: MCP_URL (default http://127.0.0.1:8787/mcp), PREVIEW_OUT, BROWSER_PATH, PREVIEW_WIDGET_URI
 */
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { build } from "esbuild";
import { existsSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { join, resolve } from "node:path";
import { chromium, type Page, type FrameLocator } from "playwright-core";
import { DEFAULT_IMAGE_HOSTS } from "../src/config.js";

const MCP_URL = process.env.MCP_URL ?? "http://127.0.0.1:8787/mcp";
const OUT = resolve(process.env.PREVIEW_OUT ?? "preview-output");
const BROWSERS = [process.env.BROWSER_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].filter((p): p is string => !!p);

const HOST_SCRIPT = `
import { AppBridge, PostMessageTransport } from "@modelcontextprotocol/ext-apps/app-bridge";
window.__opened = []; window.__messages = []; window.__context = []; window.__calls = [];
const q = new URLSearchParams(location.search);
const iframe = document.createElement("iframe");
iframe.style.cssText = "width:" + (q.get("w") || "760") + "px;height:" + (q.get("h") || "760") + "px;border:1px solid #ccc";
document.body.appendChild(iframe);
// Host profiles. "full": everything supported. "chatgpt": no ui/open-link, a window.openai layer in the
// frame, no tool-input notification, sandboxed without popups. "hostile": link requests and tool calls
// never answered, sandboxed without popups. All are simulations, not real hosts.
const profile = q.get("host") || "full";
if (profile !== "full") iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms");
const caps = profile === "full" ? { openLinks: {}, serverTools: {}, updateModelContext: { text: {} }, message: { text: {} } }
  : profile === "chatgpt" ? { serverTools: {}, updateModelContext: { text: {} }, message: { text: {} } }
  : { updateModelContext: { text: {} } };
const bridge = new AppBridge(null, { name: "preview-host", version: "1.0.0" }, caps,
  { hostContext: { theme: q.get("theme") || "light", locale: q.get("locale") || "en-US", platform: q.get("platform") || "web" } });
bridge.oncalltool = async (params) => {
  window.__calls.push(params.name);
  if (profile === "hostile") return new Promise(() => {});
  return (await fetch("/call-tool", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) })).json();
};
if (profile === "full") bridge.onopenlink = async ({ url }) => { window.__opened.push(url); return {}; };
if (profile === "hostile") bridge.onopenlink = () => new Promise(() => {});
// Like real hosts, grow the frame to the height the app reports (capped so runaway layouts show up).
bridge.onsizechange = ({ height }) => { if (height) iframe.style.height = Math.min(Math.ceil(height) + 2, 3000) + "px"; };
bridge.onmessage = async (p) => { window.__messages.push(p); return {}; };
bridge.onupdatemodelcontext = async (p) => { window.__context.push(p); return {}; };
bridge.oninitialized = async () => {
  const init = await (await fetch("/initial")).json();
  if (profile === "full") bridge.sendToolInput({ arguments: init.args });
  bridge.sendToolResult(init.result);
};
await bridge.connect(new PostMessageTransport(iframe.contentWindow, iframe.contentWindow));
iframe.src = profile === "chatgpt" ? "/widget?shim=openai" : "/widget";
`;

// Simulated subset of ChatGPT's window.openai (records what the card asks for).
const OPENAI_SHIM = `<script>window.openai = {
  widgetState: null, setWidgetState(s) { this.widgetState = s; },
  openExternal(o) { parent.__opened.push(o.href); },
  sendFollowUpMessage(o) { parent.__messages.push({ prompt: o.prompt }); },
  callTool(name, args) { parent.__calls.push("openai:" + name); return fetch("/call-tool", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, arguments: args }) }).then((r) => r.json()); },
};</script>`;

let failures = 0;
const check = (ok: unknown, msg: string) => {
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${msg}`);
  if (!ok) failures++;
};

async function main() {
  const browserPath = BROWSERS.find((p) => existsSync(p));
  if (!browserPath) throw new Error("No local Chrome/Edge found; set BROWSER_PATH");
  mkdirSync(OUT, { recursive: true });

  const client = new Client({ name: "widget-preview", version: "2.0.0" });
  await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
  // PREVIEW_WIDGET_URI lets the run simulate a host that cached an older tool list (e.g. listings-v1).
  const res = await client.readResource({ uri: process.env.PREVIEW_WIDGET_URI ?? "ui://savoir/listings-v2.html" });
  const widget = res.contents[0] as { text?: string; mimeType?: string };
  if (!widget?.text) throw new Error("widget resource empty");
  console.log(`widget resource: ${widget.mimeType}, ${(widget.text.length / 1024).toFixed(0)} KiB`);

  let initial: { args: Record<string, unknown>; result: unknown } = { args: {}, result: {} };
  // Simulated failures for the card's next update_shortlist call: a tool error, or a store rejection.
  let failNextSave: null | "error" | "rejected" = null;
  const setInitial = async (name: string, args: Record<string, unknown>) => {
    initial = { args, result: await client.callTool({ name, arguments: args }) };
  };
  const hostJs = (await build({ stdin: { contents: HOST_SCRIPT, resolveDir: process.cwd(), loader: "js" }, bundle: true, format: "esm", write: false, platform: "browser" })).outputFiles[0]!.text;
  const csp = ["default-src 'none'", "script-src 'unsafe-inline'", "style-src 'unsafe-inline'", `img-src data: ${[...DEFAULT_IMAGE_HOSTS.map((h) => `https://${h}`), "https://savoirproperties.com"].join(" ")}`, "connect-src 'none'"].join("; ");

  const server = createServer(async (req, res) => {
    if (req.url?.startsWith("/widget")) {
      res.writeHead(200, { "Content-Type": "text/html", "Content-Security-Policy": csp });
      res.end(req.url.includes("shim=openai") ? (widget.text ?? "").replace("<head>", "<head>" + OPENAI_SHIM) : widget.text);
    } else if (req.url === "/host.js") {
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.end(hostJs);
    } else if (req.url === "/initial") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(initial));
    } else if (req.url === "/call-tool" && req.method === "POST") {
      let body = "";
      for await (const chunk of req) body += chunk;
      const p = JSON.parse(body) as { name: string; arguments?: Record<string, unknown> };
      let r: unknown;
      if (p.name === "update_shortlist" && failNextSave === "error") {
        r = { isError: true, content: [{ type: "text", text: "simulated failure" }] };
      } else if (p.name === "update_shortlist" && failNextSave === "rejected") {
        const slug = ((p.arguments?.add as Array<{ slug: string }> | undefined) ?? [])[0]?.slug ?? "x";
        r = { content: [], structuredContent: { view: "shortlist", status: "ok", shortlist: { shortlist_id: "A".repeat(22), items: [], share_url: null, expires_at: new Date().toISOString(), updated_at: new Date().toISOString() }, rejected: [slug], change: { created: true, added: [], removed: [] }, error: null } };
      } else r = await client.callTool({ name: p.name, arguments: p.arguments ?? {} });
      if (p.name === "update_shortlist") failNextSave = null;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(r));
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<!doctype html><html><body style="margin:8px;font-family:sans-serif"><script type="module" src="/host.js"></script></body></html>`);
    }
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const port = (server.address() as { port: number }).port;
  const browser = await chromium.launch({ executablePath: browserPath, headless: true });
  const errors: string[] = [];

  const open = async (q: string, vw = 800, vh = 800, touch = false): Promise<{ page: Page; f: FrameLocator }> => {
    const page = await browser.newPage({ viewport: { width: vw, height: vh }, ...(touch ? { isMobile: true, hasTouch: true } : {}) });
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin: `http://127.0.0.1:${port}` }).catch(() => {});
    page.on("pageerror", (e) => errors.push(e.message));
    // Chrome logs a console error when a sandboxed frame's popup is blocked; the "hostile" profile provokes
    // that on purpose and checks the visible fallback instead.
    page.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && !(q.includes("host=hostile") && /Blocked opening .* sandboxed frame/.test(m.text())) && errors.push(m.text()));
    await page.goto(`http://127.0.0.1:${port}/?${q}`);
    return { page, f: page.frameLocator("iframe") };
  };
  const g = <T>(page: Page, expr: string) => page.evaluate(expr) as Promise<T>;
  const AUDIT_JS = String.raw`(minT) => {
      const parse = (c) => { const m = c.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; };
      const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
      const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      const over = (top, under) => ({ r: top.r * top.a + under.r * (1 - top.a), g: top.g * top.a + under.g * (1 - top.a), b: top.b * top.a + under.b * (1 - top.a), a: 1 });
      // Background behind an element: composite translucent layers; over a photo assume worst case (black or white).
      const bgOf = (el) => {
        const layers = [];
        for (let n = el; n; n = n.parentElement) {
          const c = parse(getComputedStyle(n).backgroundColor);
          if (c.a > 0) layers.push(c);
          if (c.a >= 1) { return [layers.reduceRight((acc, l) => (acc ? over(l, acc) : l), null)]; }
          if (n.classList.contains("sv-ph") || n.classList.contains("sv-gal")) {
            return [{ r: 0, g: 0, b: 0, a: 1 }, { r: 255, g: 255, b: 255, a: 1 }].map((base) => layers.reduceRight((acc, l) => over(l, acc), base));
          }
        }
        return [{ r: 255, g: 255, b: 255, a: 1 }];
      };
      const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && !el.closest("[hidden]") && !el.closest(".sr"); };
      const label = (el) => (el.tagName.toLowerCase() + "." + (el.getAttribute("class") || "").split(" ")[0] + " \"" + (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 28) + "\"");
      let minFont = 99, minFontAt = "", minRatio = 99, minRatioAt = "";
      const lowContrast = [];
      const seen = new Set();
      for (const el of Array.from(document.querySelectorAll("#root *"))) {
        const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!own || !vis(el)) continue;
        const cs = getComputedStyle(el);
        const size = parseFloat(cs.fontSize);
        if (size < minFont) { minFont = size; minFontAt = label(el); }
        const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
        const fg = parse(cs.color);
        for (const bg of bgOf(el)) {
          const r = ratio(fg.a < 1 ? over(fg, bg) : fg, bg);
          if (r < minRatio) { minRatio = r; minRatioAt = label(el); }
          if (r < (large ? 3 : 4.5)) { const k = label(el) + " " + r.toFixed(2); if (!seen.has(k)) { seen.add(k); lowContrast.push(k); } break; }
        }
      }
      const smallTargets = [];
      let minTarget = 99;
      for (const el of Array.from(document.querySelectorAll("#root button, #root summary, #root label.sv-chk, #root a, #root input:not([type=checkbox])"))) {
        if (!vis(el)) continue;
        const r = el.getBoundingClientRect();
        const m = Math.min(r.width, r.height);
        if (m < minTarget) minTarget = m;
        if (m < minT - 0.5) smallTargets.push(label(el) + " " + Math.round(r.width) + "x" + Math.round(r.height));
      }
      return { minFont, minFontAt, minRatio, minRatioAt, lowContrast, smallTargets, minTarget, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
}`;
  type Audit = { minFont: number; minFontAt: string; minRatio: number; minRatioAt: string; lowContrast: string[]; smallTargets: string[]; minTarget: number; overflow: number };
  /** Text size, contrast (WCAG 2.x ratio vs the composited background) and tap-target sizes of visible elements. */
  const audit = async (page: Page, minTarget: number): Promise<Audit> => {
    const frame = page.frames().find((fr) => fr.url().includes("/widget"))!;
    return frame.evaluate(`(${AUDIT_JS})(${minTarget})`) as Promise<Audit>;
  };
  const shot = (page: Page, name: string) => page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });
  const waitImgs = async (f: FrameLocator) => {
    const imgs = f.locator(".sv-card img, .sv-gal img, .sv-brand img");
    for (let i = 0; i < 40; i++) {
      const done = await imgs.evaluateAll((els) => els.every((e) => (e as HTMLImageElement).complete));
      if (done) break;
      await new Promise((r) => setTimeout(r, 250));
    }
    return imgs.evaluateAll((els) => els.filter((e) => (e as HTMLImageElement).naturalWidth > 0).length);
  };

  try {
    // ---------- A: full journey, English, desktop ----------
    console.log("A. English desktop: list → save → compare → message → shortlist → share → delete");
    await setInitial("search_properties", { areas: ["Dubai Marina"], purpose: "buy", page_size: 4 });
    {
      const { page, f } = await open("theme=light&locale=en-US&w=780&h=780");
      await f.locator(".sv-card").first().waitFor({ timeout: 20000 });
      check((await waitImgs(f)) > 0, "listing photos load under the declared CSP");
      const logoOk = await f.locator(".sv-brand img").evaluate(
        (e) =>
          new Promise<boolean>((res) => {
            const i = e as HTMLImageElement;
            if (i.complete) return res(i.naturalWidth > 0);
            i.addEventListener("load", () => res(true));
            i.addEventListener("error", () => res(false));
            setTimeout(() => res(i.naturalWidth > 0), 10000);
          }),
      );
      check(logoOk, "official Savoir logo loads");
      await shot(page, "A1-list");
      check(await f.getByRole("button", { name: "My shortlist (0)" }).isVisible(), "'My shortlist (0)' button visible before saving");
      await f.locator(".sv-heart").first().click();
      await f.locator('.sv-heart[aria-pressed="true"]').first().waitFor({ timeout: 15000 });
      check(await f.locator(".sv-notice.ok", { hasText: "Saved to your shortlist." }).getByRole("button", { name: "View shortlist" }).isVisible(), "'Saved to your shortlist.' shown after a confirmed save, with View shortlist");
      check(await f.getByRole("button", { name: "My shortlist (1)" }).first().isVisible(), "'My shortlist (1)' count updates");
      await shot(page, "A1b-saved");
      await f.getByRole("button", { name: /^Details:/ }).first().click();
      await f.locator(".sv-detail").waitFor({ timeout: 20000 });
      await waitImgs(f);
      await shot(page, "A1c-detail");
      await f.getByRole("button", { name: "← Back" }).click();
      await f.locator(".sv-card").first().waitFor({ timeout: 10000 });
      const ctx = await g<Array<{ content: Array<{ text: string }> }>>(page, "window.__context");
      check(ctx.some((c) => /shortlist_id is [A-Za-z0-9_-]{22}/.test(c.content[0]!.text)), "saving tells the model the shortlist_id (updateModelContext)");
      const boxes = f.locator('.sv-card input[type="checkbox"]');
      await boxes.nth(0).check();
      await boxes.nth(1).check();
      await f.getByRole("button", { name: "Compare (2)" }).click();
      await f.locator("table.sv-cmp").waitFor({ timeout: 20000 });
      const rows = await f.locator("table.sv-cmp tbody th").allTextContents();
      check(rows.includes("Price per sq ft") && rows.includes("Your requirements"), `comparison rows: ${rows.join(", ")}`);
      await shot(page, "A2-compare");
      await f.getByRole("button", { name: "Message about these" }).click();
      await f.locator("textarea.sv-msg").waitFor({ timeout: 20000 });
      const msg = await f.locator("textarea.sv-msg").inputValue();
      check(/Hello Savoir Properties/.test(msg) && /SAV-[2-9A-HJKMNP-Z]{6}/.test(msg), "handoff message shown with reference code");
      await shot(page, "A3-message");
      await f.getByRole("button", { name: "Send on WhatsApp" }).click();
      await page.waitForFunction("window.__opened.length >= 1");
      const opened = await g<string[]>(page, "window.__opened");
      // With analytics on, the button is a signed /go/ link that redirects to WhatsApp.
      let target = opened[0]!;
      if (/\/go\//.test(target)) {
        const hop = await fetch(target, { redirect: "manual", headers: { "user-agent": "Mozilla/5.0 preview-click" } });
        check(hop.status === 302, "WhatsApp button goes through a counted /go/ redirect");
        target = hop.headers.get("location") ?? "";
      }
      check(target.startsWith("https://wa.me/971505074686?text=") && decodeURIComponent(target.split("text=")[1]!) === msg, "WhatsApp link carries exactly the shown message");
      await f.getByRole("button", { name: "← Back" }).click();
      await f.getByRole("button", { name: "← Back" }).click();
      await f.getByRole("button", { name: "My shortlist (1)" }).first().click();
      await f.locator(".sv-li").first().waitFor({ timeout: 15000 });
      await f.getByRole("button", { name: "Create share link" }).click();
      await f.locator('input[readonly][value^="http"]').waitFor({ timeout: 15000 });
      const share = await f.locator('input[readonly][value^="http"]').inputValue();
      check(/\/s\/[A-Za-z0-9_-]{22}$/.test(share), "share link created");
      const sharePage = await fetch(share);
      check(sharePage.status === 200, "share page reachable");
      for (const [name, w] of [["A5-share-page", 900], ["A5b-share-page-mobile", 390]] as const) {
        const sp = await browser.newPage({ viewport: { width: w, height: 800 } });
        await sp.goto(share);
        await sp.waitForLoadState("networkidle").catch(() => {});
        await sp.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });
        await sp.close();
      }
      await f.getByText("About your shortlist").click();
      const listText = await f.locator("#root").innerText();
      check(/30 days after your last change/.test(listText) && /Show my shortlist/.test(listText) && /a new chat won't find it/.test(listText), "explains 30-day lifetime, how to reopen, and no cross-chat access");
      await f.getByRole("button", { name: "Copy link" }).click();
      const copyNotice = f.locator(".sv-notice", { hasText: /Copied|Couldn't copy/ });
      await copyNotice.waitFor({ timeout: 5000 });
      const copyMsg = await copyNotice.innerText();
      const copiedText = await page.evaluate(() => navigator.clipboard.readText().catch(() => "")).catch(() => "");
      check((/Copied/.test(copyMsg) && copiedText === share) || /Couldn't copy automatically/.test(copyMsg), `copy link reports the real outcome ("${copyMsg.split("\n")[0]}")`);
      check(await f.getByRole("button", { name: "Open link" }).isVisible(), "'Open link' button offered next to the share link");
      check(!(await f.locator(".sv-confirm").isVisible()), "delete confirmation stays hidden until Delete is pressed");
      await shot(page, "A4-shortlist");
      await f.getByRole("button", { name: "Delete shortlist" }).click();
      await f.getByRole("button", { name: "Yes, delete" }).click();
      await f.locator(".sv-empty", { hasText: "Shortlist deleted." }).waitFor({ timeout: 15000 });
      check((await fetch(share)).status === 404, "deleting the shortlist kills the share link");
      await page.close();
    }

    // ---------- A2: failed saves and removing from the shortlist view ----------
    console.log("A2. Save failures show an error (never success); remove from the shortlist view");
    await setInitial("search_properties", { areas: ["Dubai Marina"], purpose: "buy", page_size: 3 });
    {
      const { page, f } = await open("theme=dark&locale=en-US&w=780&h=780");
      await f.locator(".sv-card").first().waitFor({ timeout: 20000 });
      const heart0 = f.locator(".sv-heart").first();
      failNextSave = "error";
      await heart0.click();
      await f.locator(".sv-notice.error").waitFor({ timeout: 15000 });
      check(/Couldn't save this listing/.test(await f.locator(".sv-notice.error").innerText()), "tool failure → 'Couldn't save' error");
      check((await f.locator(".sv-notice.ok").count()) === 0 && (await heart0.getAttribute("aria-pressed")) === "false", "tool failure → no success message and heart stays empty");
      await shot(page, "A2a-save-error");
      failNextSave = "rejected";
      await heart0.click();
      await f.locator(".sv-notice.error", { hasText: "no longer be available" }).waitFor({ timeout: 15000 });
      check((await f.locator(".sv-notice.ok").count()) === 0 && (await heart0.getAttribute("aria-pressed")) === "false", "server rejected the listing → error, no success, heart stays empty");
      await f.locator(".sv-notice.error").getByRole("button", { name: "Try again" }).click();
      await f.locator(".sv-notice.ok", { hasText: "Saved to your shortlist." }).waitFor({ timeout: 15000 });
      check((await heart0.getAttribute("aria-pressed")) === "true", "retry after a failure saves for real");
      await f.locator(".sv-heart").nth(1).click();
      await f.getByRole("button", { name: "My shortlist (2)" }).first().waitFor({ timeout: 15000 });
      await f.getByRole("button", { name: "My shortlist (2)" }).first().click();
      await f.locator(".sv-li").nth(1).waitFor({ timeout: 15000 });
      await f.getByRole("button", { name: /^Remove:/ }).first().click();
      await f.locator(".sv-notice.ok", { hasText: "Removed from your shortlist." }).waitFor({ timeout: 15000 });
      check((await f.locator(".sv-li").count()) === 1, "remove updates the shortlist view immediately (1 left)");
      await shot(page, "A2b-removed");
      await page.close();
    }

    // ---------- F: readability and tap targets at real ChatGPT / phone widths ----------
    console.log("F. Text size, contrast and tap targets (ChatGPT desktop 760px light; phone 390px dark; phone 360px light, touch)");
    for (const cfg of [
      { name: "desktop-760-light", w: 760, theme: "light", touch: false, minTarget: 24 },
      { name: "phone-390-dark", w: 390, theme: "dark", touch: true, minTarget: 44 },
      { name: "phone-360-light", w: 360, theme: "light", touch: true, minTarget: 44 },
    ]) {
      await setInitial("search_properties", { areas: ["Dubai Marina"], purpose: "buy", page_size: 3 });
      const { page, f } = await open(`theme=${cfg.theme}&locale=en-US&w=${cfg.w - 20}&h=700`, cfg.w, 800, cfg.touch);
      await f.locator(".sv-card").first().waitFor({ timeout: 20000 });
      await waitImgs(f);
      const results: Array<[string, Audit]> = [["results", await audit(page, cfg.minTarget)]];
      const status = await f.locator(".sv-card .sv-badge").first().innerText();
      check(/Ready|Off-plan/.test(status), `${cfg.name}: result card shows ready/off-plan status ("${status}")`);
      check((await f.locator(".sv-row .sv-flag").count()) === 0, `${cfg.name}: search results carry no purpose flags`);
      await f.locator(".sv-heart").first().click();
      await f.locator('.sv-heart[aria-pressed="true"]').first().waitFor({ timeout: 15000 });
      await f.getByRole("button", { name: /^Details:/ }).first().click();
      await f.locator(".sv-detail").waitFor({ timeout: 20000 });
      await f.getByText("More details").click();
      await waitImgs(f);
      const dstatus = await f.locator(".sv-status").innerText();
      check(/Ready|Off-plan/.test(dstatus), `${cfg.name}: detail shows ready/off-plan status ("${dstatus}")`);
      check(await f.getByRole("button", { name: "Contact Savoir" }).isVisible(), `${cfg.name}: main detail action reads "Contact Savoir"`);
      results.push(["details", await audit(page, cfg.minTarget)]);
      if (cfg.name === "desktop-760-light") {
        const flags = await f.locator(".sv-similar .sv-flag").allInnerTexts();
        const purposes = await f.locator(".sv-similar .sv-card .sv-badge").allInnerTexts();
        const selfPurpose = /For sale/.test(dstatus) ? "For sale" : "For rent";
        const differing = purposes.filter((p) => !p.startsWith(selfPurpose)).length;
        check(flags.length === differing && (differing === 0 || /unlike this listing/.test(flags[0]!)), `similar listings: ${differing} with a different purpose, ${flags.length} flagged ("${flags[0] ?? "none needed"}")`);
        await shot(page, "F1-detail-similar");
      }
      await f.getByRole("button", { name: "← Back" }).click();
      await f.locator(".sv-card").first().waitFor({ timeout: 10000 });
      const boxes = f.locator('.sv-card input[type="checkbox"]');
      await boxes.nth(0).check();
      await boxes.nth(1).check();
      await f.getByRole("button", { name: "Compare (2)" }).click();
      await f.locator("table.sv-cmp").waitFor({ timeout: 20000 });
      await f.getByRole("button", { name: "Show all details" }).click();
      await waitImgs(f);
      results.push(["comparison", await audit(page, cfg.minTarget)]);
      await f.getByRole("button", { name: /^My shortlist \(1\)/ }).first().click();
      await f.locator(".sv-li").first().waitFor({ timeout: 15000 });
      check(await f.getByRole("button", { name: "Ask about my shortlist" }).isVisible(), `${cfg.name}: shortlist action reads "Ask about my shortlist"`);
      await f.getByText("About your shortlist").click();
      results.push(["shortlist", await audit(page, cfg.minTarget)]);
      await shot(page, `F-${cfg.name}-shortlist`);
      for (const [view, a] of results) {
        check(a.minFont >= 12, `${cfg.name} ${view}: smallest text ${a.minFont}px (${a.minFontAt})`);
        check(a.lowContrast.length === 0, `${cfg.name} ${view}: text contrast ≥ 4.5:1 (lowest ${a.minRatio.toFixed(1)}:1, ${a.minRatioAt})${a.lowContrast.length ? " — low: " + a.lowContrast.slice(0, 4).join(" | ") : ""}`);
        check(a.smallTargets.length === 0, `${cfg.name} ${view}: tap targets ≥ ${cfg.minTarget}px (smallest ${Math.round(a.minTarget)}px)${a.smallTargets.length ? " — " + a.smallTargets.slice(0, 4).join(" | ") : ""}`);
        check(a.overflow <= 0, `${cfg.name} ${view}: no sideways scroll`);
      }
      // clean up the shortlist this run created
      await f.getByRole("button", { name: "Delete shortlist" }).click();
      await f.getByRole("button", { name: "Yes, delete" }).click();
      await f.locator(".sv-empty", { hasText: "Shortlist deleted." }).waitFor({ timeout: 15000 });
      await page.close();
    }

    // ---------- G: every button, ChatGPT-like host (simulated) ----------
    console.log("G. Button audit in a ChatGPT-like simulated host (window.openai, no ui/open-link, no tool input, sandboxed)");
    {
      await setInitial("search_properties", { areas: ["Dubai Marina"], purpose: "buy", page_size: 3 });
      const { page, f } = await open("host=chatgpt&theme=light&locale=en-US&w=740&h=700", 760, 900);
      const calls = () => g<string[]>(page, "window.__calls.slice()");
      const opened = () => g<string[]>(page, "window.__opened.slice()");
      const msgs = () => g<Array<{ prompt?: string }>>(page, "window.__messages.slice()");
      const newCall = async (name: string, before: number) => (await calls()).slice(before).includes(name);
      const notLoading = async () => (await f.locator("#root.sv-loading").count()) === 0;
      await f.locator(".sv-card").first().waitFor({ timeout: 20000 });
      let n = (await calls()).length;
      // Heart: save then unsave
      const heart0 = f.locator(".sv-row .sv-heart").first();
      await heart0.click();
      await f.locator(".sv-notice.ok", { hasText: "Saved to your shortlist." }).waitFor({ timeout: 15000 });
      check((await newCall("update_shortlist", n)) && (await heart0.getAttribute("aria-pressed")) === "true" && (await f.getByRole("button", { name: "My shortlist (1)" }).first().isVisible()), "G heart save → update_shortlist, filled heart, count 1");
      n = (await calls()).length;
      await heart0.click();
      await f.locator(".sv-notice.ok", { hasText: "Removed from your shortlist." }).waitFor({ timeout: 15000 });
      check((await newCall("update_shortlist", n)) && (await heart0.getAttribute("aria-pressed")) === "false" && (await f.getByRole("button", { name: "My shortlist (0)" }).first().isVisible()), "G heart unsave → update_shortlist, empty heart, count 0");
      // More results without tool input → asks the assistant for the next page
      await f.getByRole("button", { name: "More results" }).click();
      await f.locator(".sv-notice.ok", { hasText: "Sent to the chat" }).waitFor({ timeout: 8000 });
      check((await msgs()).some((m) => /page 2/.test(JSON.stringify(m))), "G More results (no tool input) → asks the assistant for page 2 and says so");
      // Card WhatsApp → openExternal
      let o = (await opened()).length;
      await f.locator(".sv-row .sv-card").first().getByRole("button", { name: /^WhatsApp:/ }).click();
      await page.waitForFunction((k) => (window as any).__opened.length > k, o, { timeout: 5000 });
      check(/\/go\/|wa\.me/.test((await opened())[o]!) && (await f.locator("#sv-linkpanel").count()) === 0, "G card WhatsApp → window.openai.openExternal (no fallback panel)");
      // Details, photo arrows, More details, Website, WhatsApp, Save, Contact Savoir, Back
      n = (await calls()).length;
      await f.getByRole("button", { name: /^Details:/ }).first().click();
      await f.locator(".sv-detail").waitFor({ timeout: 20000 });
      check(await newCall("get_property_details", n), "G Details → get_property_details, detail view shown");
      const count = f.locator(".sv-gal .count");
      const c0 = await count.innerText();
      await f.locator(".sv-gal .next").click();
      const c1 = await count.innerText();
      await f.locator(".sv-gal .prev").click();
      const c2 = await count.innerText();
      check(/^1 \//.test(c0) && /^2 \//.test(c1) && /^1 \//.test(c2), `G photo arrows → ${c0} → ${c1} → ${c2}`);
      await f.getByText("More details").click();
      check(await f.locator(".sv-dl").first().isVisible(), "G More details → facts shown");
      o = (await opened()).length;
      await f.getByRole("button", { name: "Website" }).click();
      await page.waitForFunction((k) => (window as any).__opened.length > k, o, { timeout: 5000 });
      check(/savoirproperties\.com|\/go\//.test((await opened())[o]!), "G detail Website → openExternal");
      o = (await opened()).length;
      await f.locator(".sv-detail .sv-actions").getByRole("button", { name: "WhatsApp", exact: true }).click();
      await page.waitForFunction((k) => (window as any).__opened.length > k, o, { timeout: 5000 });
      check(/\/go\/|wa\.me/.test((await opened())[o]!), "G detail WhatsApp → openExternal");
      n = (await calls()).length;
      const saveBtn = f.locator(".sv-detail .sv-actions button[aria-pressed]");
      await saveBtn.click();
      await f.locator(".sv-notice.ok", { hasText: "Saved to your shortlist." }).waitFor({ timeout: 15000 });
      check((await newCall("update_shortlist", n)) && (await saveBtn.getAttribute("aria-pressed")) === "true", "G detail Save → update_shortlist, shows Saved");
      n = (await calls()).length;
      await f.getByRole("button", { name: "Contact Savoir" }).click();
      await f.locator("textarea.sv-msg").waitFor({ timeout: 20000 });
      check(await newCall("prepare_inquiry", n), "G Contact Savoir → prepare_inquiry, message shown");
      o = (await opened()).length;
      await f.getByRole("button", { name: "Send on WhatsApp" }).click();
      await page.waitForFunction((k) => (window as any).__opened.length > k, o, { timeout: 5000 });
      o = (await opened()).length;
      await f.getByRole("button", { name: "Send by email" }).click();
      await page.waitForFunction((k) => (window as any).__opened.length > k, o, { timeout: 5000 });
      check(/^mailto:/.test((await opened())[o]!), "G message: Send on WhatsApp and Send by email → openExternal");
      await f.getByRole("button", { name: "Copy" }).click();
      const copyNote = await f.locator(".sv-notice", { hasText: /Copied|Couldn't copy/ }).innerText({ timeout: 5000 });
      check(/Copied|Couldn't copy/.test(copyNote), `G message Copy → reports outcome ("${copyNote.split("\n")[0]}")`);
      await f.getByRole("button", { name: "← Back" }).click();
      await f.locator(".sv-detail").waitFor({ timeout: 5000 });
      await f.getByRole("button", { name: "← Back" }).click();
      await f.locator(".sv-row .sv-card").first().waitFor({ timeout: 5000 });
      check(true, "G Back → detail, then results");
      // Compare tray: select, clear, select again, compare view, show all, Why
      const boxes = f.locator('.sv-row .sv-card input[type="checkbox"]');
      await boxes.nth(0).check();
      await boxes.nth(1).check();
      await f.locator(".sv-bar").getByRole("button", { name: "Clear" }).click();
      check((await f.locator(".sv-bar").count()) === 0 && !(await boxes.nth(0).isChecked()), "G compare tray Clear → selection cleared");
      await boxes.nth(0).check();
      await boxes.nth(1).check();
      n = (await calls()).length;
      await f.getByRole("button", { name: "Compare (2)" }).click();
      await f.locator("table.sv-cmp").waitFor({ timeout: 20000 });
      check(await newCall("compare_listings", n), "G Compare (2) → compare_listings, comparison shown");
      const more = f.locator("#sv-cmp-more");
      await f.getByRole("button", { name: "Show all details" }).click();
      const shown = await more.isVisible();
      await f.getByRole("button", { name: "Show fewer details" }).click();
      check(shown && !(await more.isVisible()), "G Show all / Show fewer details → extra rows toggle");
      const whyCount = await f.locator(".sv-fitd").count();
      if (whyCount) {
        await f.locator(".sv-fitd summary").first().click();
        check(await f.locator(".sv-fitlist").first().isVisible(), "G Why → requirement checks shown");
      }
      n = (await calls()).length;
      await f.getByRole("button", { name: "Message about these" }).click();
      await f.locator("textarea.sv-msg").waitFor({ timeout: 20000 });
      check(await newCall("prepare_inquiry", n), "G comparison Message about these → prepare_inquiry");
      // Shortlist: open, Remove, Ask about my shortlist, compare from shortlist, share/copy/open/stop, delete cancel/confirm
      await f.getByRole("button", { name: "← Back" }).click();
      await f.locator("table.sv-cmp").waitFor({ timeout: 5000 });
      await f.getByRole("button", { name: "← Back" }).click();
      await f.locator(".sv-row .sv-card").first().waitFor({ timeout: 5000 });
      await f.locator(".sv-row .sv-heart").nth(1).click();
      await f.getByRole("button", { name: "My shortlist (2)" }).first().waitFor({ timeout: 15000 });
      n = (await calls()).length;
      await f.getByRole("button", { name: "My shortlist (2)" }).first().click();
      await f.locator(".sv-li").nth(1).waitFor({ timeout: 15000 });
      check(await newCall("get_shortlist", n), "G My shortlist → get_shortlist, 2 listings shown");
      n = (await calls()).length;
      await f.locator(".sv-li").first().locator("..").locator("..").getByRole("button", { name: "Compare (2)" }).click().catch(() => f.getByRole("button", { name: "Compare (2)" }).first().click());
      await f.locator("table.sv-cmp").waitFor({ timeout: 20000 });
      check(await newCall("compare_listings", n), "G shortlist Compare (2) → compare_listings");
      await f.getByRole("button", { name: "← Back" }).click();
      await f.locator(".sv-li").first().waitFor({ timeout: 5000 });
      n = (await calls()).length;
      await f.getByRole("button", { name: "Ask about my shortlist" }).click();
      await f.locator("textarea.sv-msg").waitFor({ timeout: 20000 });
      check(await newCall("prepare_inquiry", n), "G Ask about my shortlist → prepare_inquiry");
      await f.getByRole("button", { name: "← Back" }).click();
      await f.locator(".sv-li").first().waitFor({ timeout: 5000 });
      n = (await calls()).length;
      await f.getByRole("button", { name: "Create share link" }).click();
      await f.locator("#sv-share-url").waitFor({ timeout: 15000 });
      check(await newCall("share_shortlist", n), "G Create share link → share_shortlist, link shown");
      await f.getByRole("button", { name: "Copy link" }).click();
      const cl = await f.locator(".sv-notice", { hasText: /Copied|Couldn't copy/ }).innerText({ timeout: 5000 });
      check(/Copied|Couldn't copy/.test(cl), `G Copy link → reports outcome ("${cl.split("\n")[0]}")`);
      o = (await opened()).length;
      await f.getByRole("button", { name: "Open link" }).click();
      await page.waitForFunction((k) => (window as any).__opened.length > k, o, { timeout: 5000 });
      check(/\/s\/[A-Za-z0-9_-]{22}$/.test((await opened())[o]!), "G Open link → openExternal with the share URL");
      n = (await calls()).length;
      await f.getByRole("button", { name: "Stop sharing" }).click();
      await f.getByRole("button", { name: "Create share link" }).waitFor({ timeout: 15000 });
      check(await newCall("share_shortlist", n), "G Stop sharing → share_shortlist, back to Create share link");
      n = (await calls()).length;
      await f.getByRole("button", { name: /^Remove:/ }).first().click();
      await f.locator(".sv-notice.ok", { hasText: "Removed from your shortlist." }).waitFor({ timeout: 15000 });
      check((await newCall("update_shortlist", n)) && (await f.locator(".sv-li").count()) === 1, "G Remove → update_shortlist, 1 listing left");
      await f.getByRole("button", { name: "Delete shortlist" }).click();
      await f.getByRole("button", { name: "Cancel" }).click();
      check(!(await f.locator(".sv-confirm").isVisible()), "G Delete → Cancel hides the confirmation");
      n = (await calls()).length;
      await f.getByRole("button", { name: "Delete shortlist" }).click();
      await f.getByRole("button", { name: "Yes, delete" }).click();
      await f.locator(".sv-empty", { hasText: "Shortlist deleted." }).waitFor({ timeout: 15000 });
      check(await newCall("delete_shortlist", n), "G Yes, delete → delete_shortlist confirmed by the server");
      check(await notLoading(), "G no loading state left behind");
      await page.close();
    }
    // Pagination with tool input (full host): More results loads page 2 through the tool
    {
      await setInitial("search_properties", { areas: ["Dubai Marina"], purpose: "buy", page_size: 3 });
      const { page, f } = await open("theme=light&locale=en-US&w=740&h=700", 760, 900);
      await f.locator(".sv-card").first().waitFor({ timeout: 20000 });
      const before = (await g<string[]>(page, "window.__calls.slice()")).length;
      await f.getByRole("button", { name: "More results" }).click();
      await f.locator(".sv-hd-t p", { hasText: "page 2 of" }).waitFor({ timeout: 20000 });
      check((await g<string[]>(page, "window.__calls.slice()")).slice(before).includes("search_properties"), "G More results (with tool input) → search_properties page 2");
      await page.close();
    }
    // Off-plan: invalid and valid calculator input, Website, Contact Savoir (ChatGPT-like host)
    {
      const opq = (await client.callTool({ name: "search_offplan_projects", arguments: { max_starting_price_aed: 1_500_000, page_size: 1 } })) as { structuredContent: { items: Array<{ slug: string }> } };
      await setInitial("get_offplan_project_details", { slug: opq.structuredContent.items[0]!.slug });
      const { page, f } = await open("host=chatgpt&theme=dark&locale=en-US&w=740&h=700", 760, 900);
      await f.locator(".sv-plan").waitFor({ timeout: 20000 });
      const before = (await g<string[]>(page, "window.__calls.slice()")).length;
      await f.getByRole("button", { name: "Calculate" }).click();
      await f.locator(".sv-notice.error", { hasText: "at least AED 10,000" }).waitFor({ timeout: 5000 });
      check((await g<string[]>(page, "window.__calls.slice()")).length === before, "G calculator empty → visible error, no tool call");
      await f.getByRole("spinbutton", { name: "Unit price (AED)" }).fill("2000000");
      await f.getByRole("button", { name: "Calculate" }).click();
      await f.locator("table.sv-sched").waitFor({ timeout: 20000 });
      check((await g<string[]>(page, "window.__calls.slice()")).slice(before).includes("get_offplan_project_details") && /AED 400,000/.test(await f.locator("table.sv-sched").innerText()), "G calculator 2,000,000 → get_offplan_project_details, schedule shown");
      const o = (await g<string[]>(page, "window.__opened.slice()")).length;
      await f.getByRole("button", { name: "Website" }).click();
      await page.waitForFunction((k) => (window as any).__opened.length > k, o, { timeout: 5000 });
      check(true, "G off-plan Website → openExternal");
      await page.close();
    }

    // ---------- H: a host that ignores requests (simulated) ----------
    console.log("H. Host that never answers link or tool requests (simulated): every action must end in a visible message");
    {
      await setInitial("search_properties", { areas: ["Dubai Marina"], purpose: "buy", page_size: 3 });
      const { page, f } = await open("host=hostile&theme=light&locale=en-US&w=740&h=700", 760, 900);
      await f.locator(".sv-card").first().waitFor({ timeout: 20000 });
      await f.locator(".sv-row .sv-card").first().getByRole("button", { name: /^WhatsApp:/ }).click();
      await f.locator("#sv-linkpanel").waitFor({ timeout: 8000 });
      const panel = await f.locator("#sv-linkpanel").innerText();
      check(/Couldn't open this link here/.test(panel) && (await f.locator("#sv-link-fallback").inputValue()).length > 10, `H WhatsApp unanswered → link panel with the URL to copy ("${panel.split("\n")[0]}")`);
      await f.getByRole("button", { name: "Dismiss" }).click();
      check((await f.locator("#sv-linkpanel").count()) === 0, "H link panel Dismiss → closes");
      const heart0 = f.locator(".sv-row .sv-heart").first();
      await heart0.click();
      await f.locator(".sv-notice.error", { hasText: "Couldn't save this listing" }).waitFor({ timeout: 16000 });
      check((await heart0.getAttribute("aria-pressed")) === "false" && (await f.locator(".sv-notice.ok").count()) === 0 && (await f.locator("#root.sv-loading").count()) === 0, "H heart unanswered → error after timeout, no success, heart empty, loading cleared");
      await f.getByRole("button", { name: /^Details:/ }).first().click();
      await f.locator(".sv-notice.error", { hasText: "Something went wrong" }).waitFor({ timeout: 16000 });
      check((await f.locator(".sv-detail").count()) === 0 && (await f.locator("#root.sv-loading").count()) === 0, "H Details unanswered → error with Try again, stays on results, loading cleared");
      await page.close();
    }

    // ---------- B: area guide → search ----------
    console.log("B. Area guide → search here");
    await setInitial("get_area_guide", { purpose: "buy", budget_max_aed: 3_000_000, bedrooms: 2, limit: 4 });
    {
      const { page, f } = await open("theme=light&locale=en-US");
      await f.locator(".sv-area").first().waitFor({ timeout: 20000 });
      await waitImgs(f);
      await shot(page, "B1-areas");
      await f.getByRole("button", { name: "Search here" }).first().click();
      await f.locator(".sv-card").first().waitFor({ timeout: 20000 });
      check(true, "area guide hands off to a real search");
      await page.close();
    }

    // ---------- C: off-plan calculator ----------
    console.log("C. Off-plan detail with a quoted unit price");
    const op = (await client.callTool({ name: "search_offplan_projects", arguments: { max_starting_price_aed: 1_500_000, page_size: 1 } })) as { structuredContent: { items: Array<{ slug: string }> } };
    await setInitial("get_offplan_project_details", { slug: op.structuredContent.items[0]!.slug });
    {
      const { page, f } = await open("theme=light&locale=en-US");
      await f.locator(".sv-plan").waitFor({ timeout: 20000 });
      await f.getByRole("spinbutton", { name: "Unit price (AED)" }).fill("1500000");
      await f.getByRole("button", { name: "Calculate" }).click();
      await f.locator(".sv-detail table.sv-sched").waitFor({ timeout: 20000 });
      const sched = await f.locator(".sv-detail table.sv-sched").innerText();
      check(/AED/.test(sched) && /%/.test(sched), "payment schedule rendered from the quoted price");
      await waitImgs(f);
      await shot(page, "C1-offplan-calc");
      await page.close();
    }

    // ---------- D: no results → alternatives ----------
    console.log("D. No exact match → alternatives");
    await setInitial("search_properties", { areas: ["Palm Jumeirah"], purpose: "rent", bedrooms: "studio", max_price_aed: 40_000 });
    {
      const { page, f } = await open("theme=light&locale=en-US");
      await f.locator(".sv-alt").first().waitFor({ timeout: 20000 });
      check(/do not match everything/.test(await f.locator("#root").innerText()), "alternatives labelled as not exact matches");
      await waitImgs(f);
      await shot(page, "D1-alternatives");
      await f.getByRole("button", { name: "Show these" }).first().click();
      await f.locator(".sv-card").first().waitFor({ timeout: 20000 });
      check(true, "alternative search runs from the card");
      await page.close();
    }

    // ---------- E: Arabic, RTL, mobile, dark ----------
    console.log("E. Arabic RTL, mobile width, dark theme");
    await setInitial("search_properties", { areas: ["Dubai Marina"], purpose: "buy", page_size: 3 });
    {
      const { page, f } = await open("theme=dark&locale=ar-AE&platform=mobile&w=380&h=780", 400, 800);
      await f.locator(".sv-card").first().waitFor({ timeout: 20000 });
      const dir = await f.locator("html").getAttribute("dir");
      check(dir === "rtl", `document direction is ${dir}`);
      check((await f.getByRole("button", { name: /^التفاصيل:/ }).count()) > 0, "Arabic labels shown");
      await waitImgs(f);
      await shot(page, "E1-ar-mobile-list");
      await f.getByRole("button", { name: /^التفاصيل:/ }).first().click();
      await f.locator(".sv-detail").waitFor({ timeout: 20000 });
      await waitImgs(f);
      await shot(page, "E2-ar-mobile-detail");
      const docW = await f.locator("html").evaluate((e) => e.scrollWidth);
      check(docW <= 382, `no horizontal page overflow on mobile (scrollWidth ${docW})`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
    await client.close();
  }
  check(errors.length === 0, `no console errors${errors.length ? ": " + errors.join(" | ") : ""}`);
  console.log(`\nscreenshots: ${OUT}`);
  console.log(failures ? `${failures} check(s) FAILED` : "Widget preview passed (simulated host — not a ChatGPT/Claude test)");
  process.exit(failures ? 1 : 0);
}

main().catch((err) => {
  console.error("preview failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
