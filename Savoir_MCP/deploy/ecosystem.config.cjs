/**
 * pm2 process definition for the Savoir MCP server.
 *
 * Layout on the server (APP_ROOT = the CloudPanel site root):
 *   APP_ROOT/releases/<timestamp>/   unpacked release (this file is in ./deploy)
 *   APP_ROOT/current -> releases/<timestamp>
 *   APP_ROOT/shared/.env             production settings (never inside a release)
 *
 * Environment is read from shared/.env at (re)load time so secrets never live in
 * this file or in pm2's saved dump beyond what pm2 stores for the process.
 */
const fs = require("node:fs");
const path = require("node:path");

// releases/<ts>/deploy -> APP_ROOT (symlinks are resolved by Node, so the depth is stable).
const appRoot = process.env.APP_ROOT || path.resolve(__dirname, "..", "..", "..");
const envFile = path.join(appRoot, "shared", ".env");

function readEnv(file) {
  const env = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
  return env;
}

module.exports = {
  apps: [
    {
      name: "savoir-mcp",
      cwd: path.join(appRoot, "current"),
      script: "dist/index.js",
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "300M",
      kill_timeout: 10000,
      restart_delay: 2000,
      max_restarts: 10,
      time: true,
      env: (() => {
        const env = { NODE_ENV: "production", ...readEnv(envFile) };
        // Shortlists live in shared/ so they survive release switches and rollbacks.
        if (!env.DATA_DIR) env.DATA_DIR = path.join(appRoot, "shared", "data");
        return env;
      })(),
    },
  ],
};
