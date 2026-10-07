/**
 * MCP Apps UI resource (text/html;profile=mcp-app) rendering Savoir listing cards,
 * comparison, shortlist, area guide and the contact-handoff preview. Works in ChatGPT and
 * other MCP Apps hosts; every tool also returns full text, so clients without UI lose nothing.
 *
 * The browser code lives in ./client (styles.css, i18n.json, app.js) and is inlined here
 * together with the official @modelcontextprotocol/ext-apps App client, so the widget needs
 * no network access beyond images (CSP resourceDomains).
 */
import { readFileSync } from "node:fs";
import type { MapTilesConfig } from "../config.js";
import { fileURLToPath } from "node:url";

export const WIDGET_URI = "ui://savoir/listings-v2.html";
/** URIs advertised by earlier releases (v0.1: listings-v1). Keep serving them: hosts cache tool metadata. */
export const LEGACY_WIDGET_URIS = ["ui://savoir/listings-v1.html"] as const;
export const SAVOIR_LOGO_URL = "https://savoirproperties.com/images/icons/logo.svg";

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

const clientFile = (name: string) => readFileSync(fileURLToPath(new URL(`./client/${name}`, import.meta.url)), "utf8");

/** Escape a string for safe embedding inside a <script> element. */
function scriptSafe(js: string): string {
  return js.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
}

/** Leaflet (BSD-2-Clause) is inlined only when the map is on: the card may not load scripts from elsewhere. */
function leafletAssets(): { css: string; js: string } {
  const dir = fileURLToPath(new URL(".", import.meta.resolve("leaflet/dist/leaflet.js")));
  return { css: readFileSync(dir + "leaflet.css", "utf8"), js: readFileSync(dir + "leaflet.js", "utf8") };
}

/**
 * MapLibre GL (BSD-3-Clause), prototype engine. The ES module build is exposed as globalThis.maplibregl;
 * its worker module is inlined as text and started from a blob: URL at runtime (needs worker-src blob:).
 */
let cachedMaplibre: { css: string; js: string; worker: string } | null = null;
function maplibreAssets(): { css: string; js: string; worker: string } {
  if (cachedMaplibre) return cachedMaplibre;
  const dir = fileURLToPath(new URL(".", import.meta.resolve("maplibre-gl/dist/maplibre-gl.css")));
  const strip = (s: string) => s.replace(/\n\/\/# sourceMappingURL=\S+\s*$/, "\n");
  const main = strip(readFileSync(dir + "maplibre-gl.mjs", "utf8"));
  cachedMaplibre = { css: readFileSync(dir + "maplibre-gl.css", "utf8"), js: exposeExportsAsGlobal(main, "maplibregl"), worker: strip(readFileSync(dir + "maplibre-gl-worker.mjs", "utf8")) };
  return cachedMaplibre;
}

export function buildWidgetHtml(bundle: string = loadAppBundle(), opts: { map?: MapTilesConfig | null } = {}): string {
  const css = clientFile("styles.css");
  const i18n = JSON.stringify(JSON.parse(clientFile("i18n.json")));
  const map = opts.map ? { engine: opts.map.engine, url: opts.map.url, style: opts.map.style, styleDark: opts.map.styleDark, attribution: opts.map.attribution, subdomains: opts.map.subdomains, maxZoom: opts.map.maxZoom } : null;
  const config = JSON.stringify({ logoUrl: SAVOIR_LOGO_URL, companyWa: "https://wa.me/971505074686", map });
  const leaflet = map && map.engine === "leaflet" ? leafletAssets() : null;
  const maplibre = map && map.engine === "maplibre" ? maplibreAssets() : null;
  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Savoir Properties</title>
${leaflet ? `<style>${leaflet.css}</style>` : ""}${maplibre ? `<style>${maplibre.css}</style>` : ""}
<style>${css}</style>
</head>
<body>
<div id="root" aria-live="polite"><div class="sv-empty">Loading Savoir listings…</div></div>
<div id="sv-live" class="sr" role="status" aria-live="polite"></div>
<script type="application/json" id="sv-i18n">${scriptSafe(i18n)}</script>
<script type="application/json" id="sv-config">${scriptSafe(config)}</script>
${leaflet ? `<script>${scriptSafe(leaflet.js)}</script>` : ""}${maplibre ? `<script type="module">${scriptSafe(maplibre.js)}</script><script type="text/plain" id="sv-ml-worker">${scriptSafe(maplibre.worker)}</script>` : ""}
<script type="module">${scriptSafe(bundle)}</script>
<script type="module">${scriptSafe(clientFile("app.js"))}</script>
</body>
</html>`;
}
