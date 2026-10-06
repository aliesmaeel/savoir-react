import { loadConfig } from "./config.js";
import { createHttpApp } from "./http.js";
import { createLogger } from "./logger.js";
import { createAppContext } from "./server.js";

function main(): void {
  let config;
  try {
    config = loadConfig();
  } catch (err) {
    process.stderr.write(`Configuration error: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  }

  const logger = createLogger(config.logLevel);
  const ctx = createAppContext(config, logger);
  const { app, close } = createHttpApp(ctx);

  const server = app.listen(config.port, config.host, () => {
    logger.info("server.started", {
      host: config.host,
      port: config.port,
      cms: config.cmsBaseUrl,
      inquiry_mode: config.inquiryMode,
      host_validation: config.allowedHosts.length ? "allow-list" : "default",
    });
  });

  const shutdown = (signal: string) => {
    logger.info("server.stopping", { signal });
    server.close(() => {
      try {
        ctx.shortlists.flush();
      } catch {
        logger.error("shortlist.flush_failed");
      }
      void close().finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main();
