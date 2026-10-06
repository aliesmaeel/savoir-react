/**
 * Browser verification of the widget through the official MCP Apps host bridge
 * (AppBridge + PostMessageTransport) with live tool results from a running server,
 * under the CSP the server declares. This is a SIMULATED host — it does not prove
 * behaviour inside ChatGPT or Claude.
 *
 *   npm run dev   (or a built server)       then   npm run preview:widget
 * Env: MCP_URL (default http://127.0.0.1:8787/mcp), PREVIEW_OUT, BROWSER_PATH
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
const bridge = new AppBridge(null, { name: "preview-host", version: "1.0.0" }, { openLinks: {}, serverTools: {}, updateModelContext: { text: {} } },
  { hostContext: { theme: q.get("theme") || "light", locale: q.get("locale") || "en-US", platform: q.get("platform") || "web" } });
bridge.oncalltool = async (params) => { window.__calls.push(params.name); return (await fetch("/call-tool", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) })).json(); };
bridge.onopenlink = async ({ url }) => { window.__opened.push(url); return {}; };
bridge.onmessage = async (p) => { window.__messages.push(p); return {}; };
bridge.onupdatemodelcontext = async (p) => { window.__context.push(p); return {}; };
bridge.oninitialized = async () => {
  const init = await (await fetch("/initial")).json();
  bridge.sendToolInput({ arguments: init.args });
  bridge.sendToolResult(init.result);
};
await bridge.connect(new PostMessageTransport(iframe.contentWindow, iframe.contentWindow));
iframe.src = "/widget";
`;

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
  const res = await client.readResource({ uri: "ui://savoir/listings-v2.html" });
  const widget = res.contents[0] as { text?: string; mimeType?: string };
  if (!widget?.text) throw new Error("widget resource empty");
  console.log(`widget resource: ${widget.mimeType}, ${(widget.text.length / 1024).toFixed(0)} KiB`);

  let initial: { args: Record<string, unknown>; result: unknown } = { args: {}, result: {} };
  const setInitial = async (name: string, args: Record<string, unknown>) => {
    initial = { args, result: await client.callTool({ name, arguments: args }) };
  };
  const hostJs = (await build({ stdin: { contents: HOST_SCRIPT, resolveDir: process.cwd(), loader: "js" }, bundle: true, format: "esm", write: false, platform: "browser" })).outputFiles[0]!.text;
  const csp = ["default-src 'none'", "script-src 'unsafe-inline'", "style-src 'unsafe-inline'", `img-src data: ${[...DEFAULT_IMAGE_HOSTS.map((h) => `https://${h}`), "https://savoirproperties.com"].join(" ")}`, "connect-src 'none'"].join("; ");

  const server = createServer(async (req, res) => {
    if (req.url?.startsWith("/widget")) {
      res.writeHead(200, { "Content-Type": "text/html", "Content-Security-Policy": csp });
      res.end(widget.text);
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
      const r = await client.callTool({ name: p.name, arguments: p.arguments ?? {} });
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

  const open = async (q: string, vw = 800, vh = 800): Promise<{ page: Page; f: FrameLocator }> => {
    const page = await browser.newPage({ viewport: { width: vw, height: vh } });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
    await page.goto(`http://127.0.0.1:${port}/?${q}`);
    return { page, f: page.frameLocator("iframe") };
  };
  const g = <T>(page: Page, expr: string) => page.evaluate(expr) as Promise<T>;
  const shot = (page: Page, name: string) => page.screenshot({ path: join(OUT, `${name}.png`) });
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
      await f.locator(".sv-heart").first().click();
      await f.locator('.sv-heart[aria-pressed="true"]').first().waitFor({ timeout: 15000 });
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
      check(opened[0]!.startsWith("https://wa.me/971505074686?text=") && decodeURIComponent(opened[0]!.split("text=")[1]!) === msg, "WhatsApp link carries exactly the shown message");
      await f.getByRole("button", { name: "← Back" }).click();
      await f.getByRole("button", { name: "← Back" }).click();
      await f.getByRole("button", { name: /Shortlist \(1\)/ }).click();
      await f.locator(".sv-li").first().waitFor({ timeout: 15000 });
      await f.getByRole("button", { name: "Create share link" }).click();
      await f.locator('input[readonly][value^="http"]').waitFor({ timeout: 15000 });
      const share = await f.locator('input[readonly][value^="http"]').inputValue();
      check(/\/s\/[A-Za-z0-9_-]{22}$/.test(share), "share link created");
      const sharePage = await fetch(share);
      check(sharePage.status === 200, "share page reachable");
      await shot(page, "A4-shortlist");
      await f.getByRole("button", { name: "Delete shortlist" }).click();
      await f.getByRole("button", { name: "Yes, delete" }).click();
      await f.locator(".sv-empty", { hasText: "Shortlist deleted." }).waitFor({ timeout: 15000 });
      check((await fetch(share)).status === 404, "deleting the shortlist kills the share link");
      await page.close();
    }

    // ---------- B: area guide → search ----------
    console.log("B. Area guide → search here");
    await setInitial("get_area_guide", { purpose: "buy", budget_max_aed: 3_000_000, bedrooms: 2, limit: 4 });
    {
      const { page, f } = await open("theme=light&locale=en-US");
      await f.locator(".sv-li").first().waitFor({ timeout: 20000 });
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
      await f.locator(".sv-detail table.sv-cmp").waitFor({ timeout: 20000 });
      const sched = await f.locator(".sv-detail table.sv-cmp").innerText();
      check(/AED/.test(sched) && /%/.test(sched), "payment schedule rendered from the quoted price");
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
