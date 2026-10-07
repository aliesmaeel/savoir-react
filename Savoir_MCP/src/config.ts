/**
 * Server-side configuration. Read once from the environment at startup.
 *
 * CMS_BASE_URL is deliberately separate from the website's VITE_BASE_URL:
 * the MCP server never reads the website's Vite environment.
 */

export type InquiryMode = "disabled" | "dry_run" | "live";

export interface AppConfig {
  /** Origin of the Savoir CMS API, e.g. https://cms.savoirproperties.com (no trailing slash). */
  cmsBaseUrl: string;
  /** Public website origin used to build canonical listing URLs. */
  publicSiteUrl: string;
  /** Public origin of this MCP server (for shortlist share links), e.g. https://mcp.savoirproperties.com */
  publicMcpUrl: string;
  /** Directory for small persistent data (shortlists). null = in-memory only. */
  dataDir: string | null;
  /**
   * Add utm_* parameters to website links the app generates. Off by default: the website has
   * no analytics to read them (verified Oct 2026), and they make shared messages harder to read.
   */
  attributionUtm: boolean;
  /** Privacy-safe daily aggregate metrics and signed click links (on unless ANALYTICS=off). */
  analyticsEnabled: boolean;
  /** HMAC key for /go click links (>= 32 chars). Random per process when unset (links break on restart). */
  analyticsLinkSecret: string | undefined;
  /** Staff dashboard credentials; the dashboard is disabled unless both are set. */
  insightsUser: string | undefined;
  insightsPasswordHash: string | undefined;
  /** Per-request timeout for CMS calls. */
  cmsTimeoutMs: number;
  /**
   * Outbound budget for CMS calls. The CMS throttles at 60 requests/minute per
   * client IP (verified via X-RateLimit-Limit), so stay safely below it.
   */
  cmsMaxRequestsPerMinute: number;
  host: string;
  port: number;
  /** Host header allow-list (DNS rebinding protection). Empty = no Host validation. */
  allowedHosts: string[];
  /** Hosts images may be served from (also used as the widget CSP resourceDomains). */
  imageHosts: string[];
  inquiryMode: InquiryMode;
  /** HMAC key for inquiry confirmation tokens. Random per process when unset. */
  inquiryTokenSecret: string | undefined;
  /** Plain-text token for /.well-known/openai-apps-challenge (domain verification). */
  openaiAppsChallengeToken: string | undefined;
  /** Optional dedicated origin for the widget sandbox (`_meta.ui.domain`), if the host requires one. */
  widgetDomain: string | undefined;
  /** Raster map tiles for the card's map view. null = map off (the default; a paid provider is needed in production). */
  mapTiles: MapTilesConfig | null;
  logLevel: "debug" | "info" | "warn" | "error";
}

export interface MapTilesConfig {
  /** XYZ template, e.g. https://tile.openstreetmap.org/{z}/{x}/{y}.png or a provider URL with its public key. */
  url: string;
  /** Required attribution text (provider and data licence). */
  attribution: string;
  /** Subdomains substituted for {s}, if the template uses it. */
  subdomains: string[];
  maxZoom: number;
  /** Origins the card may load tiles from (added to the widget CSP resourceDomains). */
  origins: string[];
}

function mapTiles(env: Record<string, string | undefined>): MapTilesConfig | null {
  const url = env.MAP_TILE_URL?.trim();
  if (!url) return null;
  if (!/\{z\}/.test(url) || !/\{x\}/.test(url) || !/\{y\}/.test(url)) throw new Error("MAP_TILE_URL must contain {z}, {x} and {y}");
  const subdomains = list(env.MAP_TILE_SUBDOMAINS).length ? list(env.MAP_TILE_SUBDOMAINS) : url.includes("{s}") ? ["a", "b", "c"] : [];
  const hosts = url.includes("{s}") ? subdomains.map((s) => url.replace("{s}", s)) : [url];
  const origins = [...new Set(hosts.map((u) => httpsOrigin(u.replace(/\{[a-z]+\}/g, "0"), "MAP_TILE_URL", false)))];
  const attribution = env.MAP_TILE_ATTRIBUTION?.trim() || "© OpenStreetMap contributors";
  return { url, attribution, subdomains, maxZoom: int(env.MAP_MAX_ZOOM, 18, 10, 20, "MAP_MAX_ZOOM"), origins };
}

export const DEFAULT_IMAGE_HOSTS = [
  // Verified on live CMS responses (listing photos, agent photos, off-plan media).
  "static.shared.propertyfinder.ae",
  "res.cloudinary.com",
  "savoirbucket.s3.eu-north-1.amazonaws.com",
];

function list(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function int(value: string | undefined, fallback: number, min: number, max: number, name: string): number {
  if (value === undefined || value.trim() === "") return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return n;
}

function httpsOrigin(value: string, name: string, allowHttpLocalhost: boolean): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute URL`);
  }
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !(allowHttpLocalhost && isLocal && url.protocol === "http:")) {
    throw new Error(`${name} must use https`);
  }
  if (url.username || url.password) throw new Error(`${name} must not contain credentials`);
  return url.origin;
}

function secretOrUndefined(value: string | undefined, name: string): string | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  if (v.length < 32) throw new Error(`${name} must be at least 32 characters`);
  return v;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const cmsBaseUrl = env.CMS_BASE_URL?.trim();
  if (!cmsBaseUrl) {
    throw new Error("CMS_BASE_URL is required (e.g. https://cms.savoirproperties.com)");
  }

  const inquiryMode = (env.INQUIRY_MODE?.trim() || "disabled") as InquiryMode;
  if (!["disabled", "dry_run", "live"].includes(inquiryMode)) {
    throw new Error("INQUIRY_MODE must be one of: disabled, dry_run, live");
  }

  const secret = env.INQUIRY_TOKEN_SECRET?.trim() || undefined;
  if (secret !== undefined && secret.length < 32) {
    throw new Error("INQUIRY_TOKEN_SECRET must be at least 32 characters");
  }

  const logLevel = (env.LOG_LEVEL?.trim() || "info") as AppConfig["logLevel"];
  if (!["debug", "info", "warn", "error"].includes(logLevel)) {
    throw new Error("LOG_LEVEL must be one of: debug, info, warn, error");
  }

  const imageHosts = list(env.IMAGE_HOSTS);

  return {
    cmsBaseUrl: httpsOrigin(cmsBaseUrl, "CMS_BASE_URL", true),
    publicSiteUrl: httpsOrigin(env.PUBLIC_SITE_URL?.trim() || "https://savoirproperties.com", "PUBLIC_SITE_URL", true),
    publicMcpUrl: httpsOrigin(env.PUBLIC_MCP_URL?.trim() || "https://mcp.savoirproperties.com", "PUBLIC_MCP_URL", true),
    dataDir: env.DATA_DIR?.trim() ? env.DATA_DIR.trim() : null,
    attributionUtm: env.ATTRIBUTION_UTM?.trim() === "on",
    analyticsEnabled: env.ANALYTICS?.trim() !== "off",
    analyticsLinkSecret: secretOrUndefined(env.ANALYTICS_LINK_SECRET, "ANALYTICS_LINK_SECRET"),
    insightsUser: env.INSIGHTS_USER?.trim() || undefined,
    insightsPasswordHash: env.INSIGHTS_PASSWORD_HASH?.trim() || undefined,
    cmsTimeoutMs: int(env.CMS_TIMEOUT_MS, 8000, 1000, 30000, "CMS_TIMEOUT_MS"),
    cmsMaxRequestsPerMinute: int(env.CMS_MAX_REQUESTS_PER_MINUTE, 45, 1, 600, "CMS_MAX_REQUESTS_PER_MINUTE"),
    host: env.HOST?.trim() || "127.0.0.1",
    port: int(env.PORT, 8787, 1, 65535, "PORT"),
    allowedHosts: list(env.ALLOWED_HOSTS),
    imageHosts: imageHosts.length ? imageHosts : DEFAULT_IMAGE_HOSTS,
    inquiryMode,
    inquiryTokenSecret: secret,
    openaiAppsChallengeToken: env.OPENAI_APPS_CHALLENGE_TOKEN?.trim() || undefined,
    widgetDomain: env.WIDGET_DOMAIN?.trim() ? httpsOrigin(env.WIDGET_DOMAIN.trim(), "WIDGET_DOMAIN", false) : undefined,
    mapTiles: mapTiles(env),
    logLevel,
  };
}
