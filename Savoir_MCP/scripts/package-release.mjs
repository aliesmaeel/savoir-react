/**
 * Build and package a deployable release:
 *   release/savoir-mcp-<version>-<UTC timestamp>.tgz
 * containing dist/, package.json, package-lock.json and deploy/ (pm2 config + server scripts).
 * No node_modules and no .env: the server runs `npm ci --omit=dev` and reads shared/.env.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";

const run = (cmd, args) => {
  // npm is a .cmd shim on Windows and needs a shell; pass one fixed command string (no user input).
  const r =
    cmd === "npm" && process.platform === "win32"
      ? spawnSync(`npm ${args.join(" ")}`, { stdio: "inherit", shell: true })
      : spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
rmSync("dist", { recursive: true, force: true });
run("npm", ["run", "build"]);

const files = [
  "dist",
  "package.json",
  "package-lock.json",
  "deploy/ecosystem.config.cjs",
  "deploy/production.env.example",
  "deploy/server/preflight.sh",
  "deploy/server/deploy.sh",
  "deploy/server/rollback.sh",
  "deploy/server/activity.sh",
  "deploy/server/configure-https.sh",
  "deploy/server/test-env.sh",
  "deploy/server/map-setting.sh",
];
for (const f of files) if (!existsSync(f)) throw new Error(`missing ${f}`);

const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
mkdirSync("release", { recursive: true });
const out = `release/savoir-mcp-${pkg.version}-${stamp}.tgz`;
// Relative paths only (GNU tar treats "C:" as a remote host).
run("tar", ["-czf", out, ...files]);

const sha = createHash("sha256").update(readFileSync(out)).digest("hex");
console.log(`\nrelease: ${out}\nsha256:  ${sha}`);
