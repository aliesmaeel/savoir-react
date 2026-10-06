#!/usr/bin/env bash
# Summarise MCP activity in a UTC time window from the pm2 logs, as COUNTS ONLY.
# Safe for public CI logs: prints tool names, outcome codes, widget URIs, JSON-RPC
# method names and MCP client names (e.g. "openai-mcp"). Never prints request
# contents, IPs, timestamps of single requests, or anything else from a log line.
#
#   bash activity.sh 2026-10-06T14:30 2026-10-06T15:10
set -euo pipefail
FROM="${1:?from (UTC, YYYY-MM-DDTHH:MM)}"
TO="${2:?to (UTC, YYYY-MM-DDTHH:MM)}"
LOG_DIR="${PM2_HOME:-$HOME/.pm2}/logs"
shopt -s nullglob
files=("$LOG_DIR"/savoir-mcp-out*.log)
[ ${#files[@]} -gt 0 ] || { echo "no savoir-mcp logs in $LOG_DIR"; exit 0; }

cat "${files[@]}" | FROM="$FROM" TO="$TO" node -e '
const from = process.env.FROM, to = process.env.TO;
const safe = (v) => (typeof v === "string" && /^[\w .:\/@()-]{1,80}$/.test(v) ? v : typeof v === "boolean" ? String(v) : "other");
const counts = new Map();
const timeline = new Map(); // 10-minute bucket -> Map(label -> count)
const bump = (k) => counts.set(k, (counts.get(k) ?? 0) + 1);
let buf = "";
process.stdin.on("data", (d) => (buf += d)).on("end", () => {
  for (const line of buf.split("\n")) {
    const i = line.indexOf("{\"ts\""); // pm2 may prefix a date
    if (i < 0) continue;
    let e; try { e = JSON.parse(line.slice(i)); } catch { continue; }
    const ts = String(e.ts ?? "").slice(0, 16);
    if (ts < from || ts > to) continue;
    const slot = ts.slice(0, 15) + "0";
    const tl = (label) => { const m = timeline.get(slot) ?? new Map(); m.set(label, (m.get(label) ?? 0) + 1); timeline.set(slot, m); };
    if (e.msg === "tool.call") tl(safe(e.tool));
    if (e.msg === "mcp.resource.read") tl("card-read");
    if (e.msg === "mcp.rpc" && e.method === "initialize") tl("connect:" + safe(e.client));
    if (e.msg === "mcp.rpc" && e.method === "tools/list") tl("tools/list");
    switch (e.msg) {
      case "tool.call": bump(`tool.call       ${safe(e.tool)} -> ${safe(e.status)}`); break;
      case "tool.call.unhandled": bump(`tool.unhandled  ${safe(e.tool)}`); break;
      case "mcp.resource.read": bump(`resource.read   ${safe(e.uri)}`); break;
      case "mcp.rpc": bump(`rpc             ${safe(e.method)}${e.client ? " client=" + safe(e.client) + " " + safe(e.client_version) : ""}`); break;
      case "http.request": bump(`http            ${safe(e.method)} ${safe(e.path)} ${Number(e.status) || 0}`); break;
      case "server.started": bump("server.started"); break;
      default: if (e.level === "error" || e.level === "warn") bump(`${e.level}           ${safe(e.msg)}`);
    }
  }
  console.log(`MCP activity ${from} .. ${to} UTC (counts only)`);
  if (!counts.size) console.log("  (no matching log lines)");
  for (const [k, n] of [...counts].sort()) console.log(`  ${String(n).padStart(5)}  ${k}`);
  console.log("Timeline (10-minute buckets, UTC; counts only)");
  for (const [slot, m] of [...timeline].sort()) console.log(`  ${slot}  ` + [...m].map(([k, n]) => `${k}×${n}`).join(" "));
});
'
