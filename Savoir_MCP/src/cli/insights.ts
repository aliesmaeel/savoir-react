/**
 * Staff insights report from the aggregate metrics file. Read-only; no network access.
 *
 *   npm run insights -- --data-dir ~/savoir-mcp/shared/data --days 30 --out insights.html
 *   npm run insights -- --hash-password      (reads a password from stdin, prints an INSIGHTS_PASSWORD_HASH)
 *
 * On the server: ssh in as savoir-mcp and run
 *   node ~/savoir-mcp/current/dist/cli/insights.js --data-dir ~/savoir-mcp/shared/data --out /tmp/insights.html
 */
import { writeFileSync } from "node:fs";
import { readAnalyticsFile } from "../analytics.js";
import { buildInsights, hashPassword, renderInsightsHtml } from "../insights.js";

const args = process.argv.slice(2);
const opt = (name: string, fallback?: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

async function main() {
  if (args.includes("--hash-password")) {
    let input = "";
    for await (const chunk of process.stdin) input += chunk;
    const pw = input.replace(/\r?\n$/, "");
    if (pw.length < 12) throw new Error("use a password of at least 12 characters");
    console.log(hashPassword(pw));
    return;
  }
  const dataDir = opt("data-dir", process.env.DATA_DIR ?? "./data")!;
  const days = Math.min(400, Math.max(1, Number(opt("days", "30"))));
  const report = buildInsights(readAnalyticsFile(dataDir), { days, siteOrigin: process.env.PUBLIC_SITE_URL ?? "https://savoirproperties.com" });
  const out = opt("out");
  if (out) {
    writeFileSync(out, renderInsightsHtml(report));
    console.log(`wrote ${out}`);
  }
  console.log(`Period ${report.period.from} → ${report.period.to} (${report.period.days_with_data} day(s) with data)`);
  for (const f of report.funnel) console.log(`  ${f.step.padEnd(36)} ${String(f.count).padStart(6)}${f.note ? `   (${f.note})` : ""}`);
  const u = report.budgets.filter((b) => b.underserved);
  if (u.length) console.log(`Underserved budgets: ${u.map((b) => `${b.band} (${b.searches} searches)`).join(", ")}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
