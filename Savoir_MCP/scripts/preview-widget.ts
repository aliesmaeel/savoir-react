/**
 * Render the listing widget in a real browser through the official MCP Apps
 * host bridge (AppBridge + PostMessageTransport), using live tool results from
 * a running server, under a CSP equivalent to the one declared in _meta.ui.csp.
 *
 *   npm run dev                         # in another terminal
 *   npm run preview:widget              # writes screenshots to ./preview-output
 *
 * Requires a local Chrome or Edge (set BROWSER_PATH to override).
 * Read-only: calls search_properties, get_property_details and search_offplan_projects only.
 */
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { build } from "esbuild";
import { existsSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { join, resolve } from "node:path";
import { chromium } from "playwright-core";
import { DEFAULT_IMAGE_HOSTS } from "../src/config.js";

const MCP_URL = process.env.MCP_URL ?? "http://127.0.0.1:8787/mcp";
const OUT = resolve(process.env.PREVIEW_OUT ?? "preview-output");
const BROWSERS = [
  process.env.BROWSER_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter((p): p is string => !!p);

const HOST_SCRIPT = `
import { AppBridge, PostMessageTransport } from "@modelcontextprotocol/ext-apps/app-bridge";
window.__opened = []; window.__messages = [];
const iframe = document.createElement("iframe");
iframe.style.cssText = "width:760px;height:700px;border:1px solid #ccc";
document.body.appendChild(iframe);
const bridge = new AppBridge(null, { name: "preview-host", version: "1.0.0" }, { openLinks: {}, serverTools: {} },
  { hostContext: { theme: new URLSearchParams(location.search).get("theme") || "light" } });
bridge.oncalltool = async (params) => (await fetch("/call-tool", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) })).json();
bridge.onopenlink = async ({ url }) => { window.__opened.push(url); return {}; };
bridge.onmessage = async (p) => { window.__messages.push(p); return {}; };
bridge.oninitialized = async () => {
  const init = await (await fetch("/initial")).json();
  bridge.sendToolInput({ arguments: init.args });
  bridge.sendToolResult(init.result);
  window.__ready = true;
};
await bridge.connect(new PostMessageTransport(iframe.contentWindow, iframe.contentWindow));
iframe.src = "/widget";
`;

async function main() {
  const browserPath = BROWSERS.find((p) => existsSync(p));
  if (!browserPath) throw new Error("No local Chrome/Edge found; set BROWSER_PATH");
  mkdirSync(OUT, { recursive: true });

  const client = new Client({ name: "widget-preview", version: "1.0.0" });
  await client.connect(new StreamableHTTPClientTransport(new URL(MCP_URL)));
  const res = await client.readResource({ uri: "ui://savoir/listings-v1.html" });
  const first = res.contents[0] as { text?: string; mimeType?: string };
  if (!first?.text) throw new Error("widget resource empty");
  console.log(`widget resource: ${first.mimeType}, ${(first.text.length / 1024).toFixed(0)} KiB`);

  let initial = { args: { areas: ["Dubai Marina"], purpose: "buy", page_size: 4 } as Record<string, unknown>, result: {} as unknown };
  initial.result = await client.callTool({ name: "search_properties", arguments: initial.args });

  const hostJs = (
    await build({ stdin: { contents: HOST_SCRIPT, resolveDir: process.cwd(), loader: "js" }, bundle: true, format: "esm", write: false, platform: "browser" })
  ).outputFiles[0]!.text;

  const csp = [
    "default-src 'none'",
    "script-src 'unsafe-inline'",
    "style-src 'unsafe-inline'",
    `img-src data: ${DEFAULT_IMAGE_HOSTS.map((h) => `https://${h}`).join(" ")}`,
    "connect-src 'none'",
  ].join("; ");

  const server = createServer(async (req, res) => {
    if (req.url?.startsWith("/widget")) {
      res.writeHead(200, { "Content-Type": "text/html", "Content-Security-Policy": csp });
      res.end(first.text);
    } else if (req.url === "/host.js") {
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.end(hostJs);
    } else if (req.url === "/initial") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(initial));
    } else if (req.url === "/call-tool" && req.method === "POST") {
      let body = "";
      for await (const chunk of req) body += chunk;
      const params = JSON.parse(body) as { name: string; arguments?: Record<string, unknown> };
      const r = await client.callTool({ name: params.name, arguments: params.arguments ?? {} });
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
  const consoleErrors: string[] = [];
  try {
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({ viewport: { width: 800, height: 760 } });
      page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
      page.on("pageerror", (e) => consoleErrors.push(e.message));
      await page.goto(`http://127.0.0.1:${port}/?theme=${theme}`);
      const frame = page.frameLocator("iframe");
      await frame.locator(".sv-card").first().waitFor({ timeout: 15000 });
      const cards = await frame.locator(".sv-card").count();
      // Wait (bounded) for listing photos to finish loading before measuring/screenshotting.
      const imgs = frame.locator(".sv-card img");
      const deadline = Date.now() + 15000;
      let states: Array<{ complete: boolean; ok: boolean }> = [];
      do {
        states = await imgs.evaluateAll((els) => els.map((e) => ({ complete: (e as HTMLImageElement).complete, ok: (e as HTMLImageElement).naturalWidth > 0 })));
        if (states.every((s) => s.complete)) break;
        await page.waitForTimeout(250);
      } while (Date.now() < deadline);
      console.log(`[${theme}] cards=${cards} images=${states.length} loaded=${states.filter((s) => s.ok).length} failed=${states.filter((s) => s.complete && !s.ok).length}`);
      await page.screenshot({ path: join(OUT, `list-${theme}.png`) });

      if (theme === "light") {
        await frame.getByRole("button", { name: "WhatsApp" }).first().click();
        await frame.getByRole("button", { name: "Website" }).first().click();
        await page.waitForFunction(() => (window as unknown as { __opened: string[] }).__opened.length >= 2);
        console.log("openLink requests:", await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened));

        await frame.getByRole("button", { name: "Details" }).first().click();
        await frame.locator(".sv-detail").waitFor({ timeout: 15000 });
        console.log("detail title:", await frame.locator(".sv-dtitle").textContent());
        await page.screenshot({ path: join(OUT, "detail-light.png") });

        await frame.getByRole("button", { name: "Ask Savoir" }).click();
        await page.waitForFunction(() => (window as unknown as { __messages: unknown[] }).__messages.length >= 1);
        console.log("sendMessage:", JSON.stringify(await page.evaluate(() => (window as unknown as { __messages: unknown[] }).__messages[0])));

        await frame.getByRole("button", { name: "← Back to results" }).click();
        await frame.locator(".sv-card").first().waitFor();
        console.log("back to list: ok");
      }
      await page.close();
    }

    // Off-plan list rendering.
    initial = { args: { developers: ["Emaar"], page_size: 4 }, result: await client.callTool({ name: "search_offplan_projects", arguments: { developers: ["Emaar"], page_size: 4 } }) };
    const page = await browser.newPage({ viewport: { width: 800, height: 760 } });
    page.on("pageerror", (e) => consoleErrors.push(e.message));
    await page.goto(`http://127.0.0.1:${port}/?theme=light`);
    const frame = page.frameLocator("iframe");
    await frame.locator(".sv-card").first().waitFor({ timeout: 15000 });
    await frame.getByRole("button", { name: "Details" }).first().click();
    await frame.locator(".sv-plan, .sv-detail").first().waitFor({ timeout: 15000 });
    console.log("offplan detail:", await frame.locator(".sv-dtitle").textContent(), "| payment plan shown:", (await frame.locator(".sv-plan").count()) > 0);
    await frame.locator(".sv-gallery img").first().evaluate((e) => {
      const i = e as HTMLImageElement;
      return i.complete ? undefined : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 15000); });
    });
    await page.screenshot({ path: join(OUT, "offplan-detail-light.png") });
  } finally {
    await browser.close();
    server.close();
    await client.close();
  }
  console.log(consoleErrors.length ? `console errors:\n${consoleErrors.join("\n")}` : "console errors: none");
  console.log(`screenshots: ${OUT}`);
}

main().catch((err) => {
  console.error("preview failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
