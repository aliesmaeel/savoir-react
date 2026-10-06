import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";
import type { Express, NextFunction, Request, Response } from "express";
import { createMcpServer, SERVER_NAME, SERVER_VERSION, type AppContext } from "./server.js";
import { renderSharePage, shareNotFoundPage, sharePageCsp } from "./sharePage.js";
import { SAVOIR_LOGO_URL } from "./ui/widget.js";
import { buildInsights, renderInsightsHtml, verifyPassword } from "./insights.js";
import { isAutomatedFetch } from "./trackedLinks.js";
import type { Logger } from "./logger.js";

export function createHttpApp(ctx: AppContext): { app: Express; close: () => Promise<void> } {
  const { config, logger } = ctx;

  const app = createMcpExpressApp({
    host: config.host,
    ...(config.allowedHosts.length ? { allowedHosts: config.allowedHosts } : {}),
    jsonLimit: "256kb",
  });
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  // Access log: method, route, status and timing only — no query strings, bodies, headers or IPs.
  app.use((req: Request, res: Response, next: NextFunction) => {
    const started = Date.now();
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.on("finish", () => {
      // Never log share or link tokens: /s/<token> and /go/<token> are logged as route patterns.
      const path = req.path.startsWith("/s/")
        ? "/s/:token"
        : req.path.startsWith("/go/")
          ? "/go/:token"
          : req.path === "/mcp" || req.path.startsWith("/.well-known/") || req.path === "/health" || req.path === "/ready" || req.path === "/internal/insights"
            ? req.path
            : "other";
      logger.info("http.request", { method: req.method, path, status: res.statusCode, ms: Date.now() - started });
    });
    next();
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", name: SERVER_NAME, version: SERVER_VERSION, inquiry_mode: config.inquiryMode });
  });

  // Readiness: confirms the CMS answers (uses the cached suggestions call).
  app.get("/ready", async (_req, res) => {
    try {
      await ctx.cms.propertyLocations();
      res.json({ status: "ready", cms: "ok" });
    } catch {
      res.status(503).json({ status: "degraded", cms: "unavailable" });
    }
  });

  // Read-only shared shortlist page (no CMS calls, no personal data).
  app.get("/s/:token", (req, res) => {
    res.setHeader("Content-Security-Policy", sharePageCsp(config.imageHosts, config.publicSiteUrl));
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Cache-Control", "no-store");
    const record = ctx.shortlists.getByShareToken(String(req.params.token ?? ""));
    if (!record) {
      res.status(404).type("html").send(shareNotFoundPage(config.publicSiteUrl));
      return;
    }
    ctx.analytics.record("shared_page_view", { items: record.items.length });
    const track = ctx.links ? (u: string, kind: "property" | "offplan", slug: string) => ctx.links!.wrap({ u, c: "website", s: "share_page", k: kind, l: slug }) : undefined;
    res.type("html").send(renderSharePage(record, config.publicSiteUrl, SAVOIR_LOGO_URL, config.attributionUtm, track));
  });

  // Signed click-through redirect (counts a click; never an open redirect).
  app.get("/go/:token", (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    const p = ctx.links?.open(String(req.params.token ?? ""));
    if (!p) {
      res.status(404).type("text/plain").send("Link not found");
      return;
    }
    if (!isAutomatedFetch(req.get("user-agent"), req.get("sec-purpose") ?? req.get("purpose"))) {
      ctx.analytics.record("link_click", { channel: p.c, source: p.s, kind: p.k }, p.k && p.l ? { kind: p.k, slug: p.l } : undefined);
    }
    res.redirect(302, p.u);
  });

  // Staff insights dashboard: disabled (404) unless INSIGHTS_USER and INSIGHTS_PASSWORD_HASH are set.
  const failures = new Map<string, { n: number; until: number }>();
  app.get("/internal/insights", (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    if (!config.insightsUser || !config.insightsPasswordHash || !ctx.aggregates) {
      res.status(404).type("text/plain").send("Not found");
      return;
    }
    const who = req.ip ?? "unknown"; // kept in memory only for login throttling; never logged or stored
    const f = failures.get(who);
    if (f && f.n >= 5 && f.until > Date.now()) {
      res.status(429).type("text/plain").send("Too many attempts. Try again later.");
      return;
    }
    const m = /^Basic\s+(.+)$/i.exec(req.get("authorization") ?? "");
    const [user, ...pw] = m ? Buffer.from(m[1]!, "base64").toString("utf8").split(":") : [];
    if (!m || user !== config.insightsUser || !verifyPassword(pw.join(":"), config.insightsPasswordHash)) {
      const e = failures.get(who) ?? { n: 0, until: 0 };
      e.n = e.until < Date.now() ? 1 : e.n + 1;
      e.until = Date.now() + 15 * 60_000;
      failures.set(who, e);
      if (failures.size > 10_000) failures.clear();
      res.setHeader("WWW-Authenticate", 'Basic realm="Savoir insights", charset="UTF-8"');
      res.status(401).type("text/plain").send("Authentication required");
      return;
    }
    failures.delete(who);
    const days = Math.min(400, Math.max(1, Number(req.query.days) || 30));
    res.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'");
    res.type("html").send(renderInsightsHtml(buildInsights(ctx.aggregates.snapshot(), { days, siteOrigin: config.publicSiteUrl })));
  });

  app.get("/.well-known/openai-apps-challenge", (_req, res) => {
    if (!config.openaiAppsChallengeToken) {
      res.status(404).type("text/plain").send("Not configured");
      return;
    }
    res.type("text/plain").send(config.openaiAppsChallengeToken);
  });

  const handler = createMcpHandler(() => createMcpServer(ctx), {
    onerror: (err) => logger.warn("mcp.handler.error", { error: err.name }),
  });
  const nodeHandler = toNodeHandler(handler, { onerror: (err) => logger.error("mcp.adapter.error", { error: err.name }) });

  app.all("/mcp", async (req: Request, res: Response) => {
    logRpcMethods(logger, req.body);
    try {
      await nodeHandler(req, res, req.body);
    } catch (err) {
      logger.error("mcp.request.failed", { error: err instanceof Error ? err.name : "unknown" });
      if (!res.headersSent) res.status(500).json({ jsonrpc: "2.0", error: { code: -32603, message: "Internal server error" }, id: null });
    }
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "not_found" });
  });

  return { app, close: () => handler.close() };
}

const RPC_METHODS = new Set(["initialize", "tools/list", "resources/list", "resources/templates/list", "resources/read", "prompts/list", "ping"]);

/**
 * Host-test evidence: which MCP methods arrive (e.g. when a host re-fetches the tool list) and,
 * on initialize, the client's self-reported name and version (e.g. "openai-mcp"). Tool calls are
 * already logged by name in instrument(). Nothing else from the request is logged.
 */
export function logRpcMethods(logger: Logger, body: unknown): void {
  for (const msg of (Array.isArray(body) ? body : [body]).slice(0, 10)) {
    const method = msg && typeof msg === "object" ? (msg as { method?: unknown }).method : undefined;
    if (typeof method !== "string" || !RPC_METHODS.has(method)) continue;
    const fields: Record<string, unknown> = { method };
    if (method === "initialize") {
      const info = (msg as { params?: { clientInfo?: { name?: unknown; version?: unknown } } }).params?.clientInfo;
      const clean = (v: unknown) => (typeof v === "string" && /^[\w .:\/@()-]{1,60}$/.test(v) ? v : "other");
      fields.client = clean(info?.name);
      fields.client_version = clean(info?.version);
    }
    logger.info("mcp.rpc", fields);
  }
}
