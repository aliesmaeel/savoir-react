import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";
import type { Express, NextFunction, Request, Response } from "express";
import { createMcpServer, SERVER_NAME, SERVER_VERSION, type AppContext } from "./server.js";
import { renderSharePage, shareNotFoundPage, sharePageCsp } from "./sharePage.js";
import { SAVOIR_LOGO_URL } from "./ui/widget.js";

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
      // Never log share tokens: /s/<token> is logged as /s/:token.
      const path = req.path.startsWith("/s/") ? "/s/:token" : req.path === "/mcp" || req.path.startsWith("/.well-known/") || req.path === "/health" || req.path === "/ready" ? req.path : "other";
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
    res.type("html").send(renderSharePage(record, config.publicSiteUrl, SAVOIR_LOGO_URL, config.attributionUtm));
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
