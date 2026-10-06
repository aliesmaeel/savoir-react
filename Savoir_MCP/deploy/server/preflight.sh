#!/usr/bin/env bash
# READ-ONLY server inspection for hosting the Savoir MCP server. Changes nothing.
#
#   bash preflight.sh [PORT]          CI-safe summary (default): pass/fail facts only,
#                                     no site names, user lists, port lists or OS details.
#                                     Safe for public GitHub Actions logs.
#   PREFLIGHT_VERBOSE=1 bash preflight.sh [PORT]
#                                     detailed report for manual use over SSH only.
# Env: RUN_AS (user that will own the MCP process), MCP_DOMAIN (default mcp.savoirproperties.com)
set -uo pipefail
PORT="${1:-8787}"
DOMAIN="${MCP_DOMAIN:-mcp.savoirproperties.com}"
RUN_AS="${RUN_AS:-}"
VERBOSE="${PREFLIGHT_VERBOSE:-}"
ok()   { printf '  [ok]   %s\n' "$*"; }
warn() { printf '  [warn] %s\n' "$*"; }
bad()  { printf '  [FAIL] %s\n' "$*"; }
hdr()  { printf '\n== %s\n' "$*"; }
SUDO=""; [ "$(id -u)" -eq 0 ] || { sudo -n true 2>/dev/null && SUDO="sudo -n"; }

hdr "Access"
if [ "$(id -u)" -eq 0 ]; then echo "  privilege: root"; elif [ -n "$SUDO" ]; then echo "  privilege: passwordless sudo"; else echo "  privilege: unprivileged"; fi

hdr "Runtime"
if command -v node >/dev/null && node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>20||(a===20&&b>=6)?0:1)'; then ok "Node >= 20.6"; else bad "Node >= 20.6 not available"; fi
command -v npm >/dev/null && ok "npm present" || bad "npm missing"
command -v pm2 >/dev/null && ok "pm2 present" || warn "pm2 not on PATH for $(id -un)"
avail=$(free -m 2>/dev/null | awk '/^Mem:/{print $7}')
[ "${avail:-0}" -ge 300 ] && ok "memory available >= 300 MiB" || warn "less than 300 MiB memory available"

hdr "Web server and ${DOMAIN}"
listeners="$($SUDO ss -ltnp 2>/dev/null | awk '$4 ~ /:(80|443)$/')"
if printf '%s\n' "$listeners" | grep -q nginx; then ok "nginx serves ports 80/443"; else bad "nginx is not the process on 80/443"; fi
printf '%s\n' "$listeners" | grep -qiE 'caddy|apache|httpd|traefik|haproxy' && warn "another web server also listens on 80/443"
{ command -v clpctl >/dev/null || [ -x /usr/bin/clpctl ]; } && ok "CloudPanel CLI present" || echo "  CloudPanel CLI: not found"
command -v certbot >/dev/null && echo "  certbot: present" || echo "  certbot: not found"
DUMP="$($SUDO nginx -T 2>/dev/null || true)"
if [ -n "$DUMP" ]; then
  if printf '%s\n' "$DUMP" | grep -qE "server_name[^;]*\b${DOMAIN//./\\.}\b"; then
    if printf '%s\n' "$DUMP" | grep -qE "proxy_pass\s+http://(127\.0\.0\.1|localhost):${PORT}\b"; then warn "${DOMAIN} already configured (proxies to :${PORT})"
    else bad "${DOMAIN} already has a server block that does NOT proxy to :${PORT} — conflict"; fi
  else ok "no existing server block for ${DOMAIN}"; fi
  total=$(printf '%s\n' "$DUMP" | grep -cE '^\s*proxy_pass\s' || true)
  hostfw=$(printf '%s\n' "$DUMP" | grep -cE '^\s*proxy_set_header\s+Host\s+\$host;' || true)
  echo "  existing proxy blocks: ${total} proxy_pass, ${hostfw} forward Host \$host"
else
  warn "nginx -T not readable as this user"
fi

hdr "Ports"
for p in "$PORT" "$((PORT + 100))"; do
  if ss -ltn "( sport = :${p} )" 2>/dev/null | grep -q LISTEN; then bad "port ${p} in use"; else ok "port ${p} free"; fi
done

if [ -n "$RUN_AS" ]; then
  hdr "run_as user"
  if id "$RUN_AS" >/dev/null 2>&1; then
    ok "user '${RUN_AS}' exists (uid $(id -u "$RUN_AS"))"
    [ "$(id -u "$RUN_AS")" -ne 0 ] || bad "'${RUN_AS}' has uid 0"
    id -nG "$RUN_AS" | tr ' ' '\n' | grep -qxE 'sudo|wheel|admin|root' && warn "'${RUN_AS}' is in an admin group" || ok "'${RUN_AS}' has no admin groups"
    if [ "$(id -u)" -eq 0 ]; then
      runuser -l "$RUN_AS" -c 'command -v node >/dev/null && command -v pm2 >/dev/null' && ok "node and pm2 usable by '${RUN_AS}'" || bad "node/pm2 not usable by '${RUN_AS}'"
    fi
  else
    echo "  user '${RUN_AS}' does not exist yet"
  fi
  ls /etc/systemd/system/pm2-"$RUN_AS".service >/dev/null 2>&1 && echo "  pm2 boot unit for ${RUN_AS}: present" || echo "  pm2 boot unit for ${RUN_AS}: none (deploy adds a crontab @reboot entry)"
fi
command -v crontab >/dev/null && ok "crontab available" || warn "crontab not installed"

hdr "CMS from this server"
code=$(curl -s -o /dev/null -w '%{http_code}' -m 10 -H 'Accept: application/json' https://cms.savoirproperties.com/api/search-suggestions)
[ "$code" = "200" ] && ok "CMS reachable (HTTP 200)" || bad "CMS returned ${code}"
rem=$(curl -s -o /dev/null -D - -m 10 -H 'Accept: application/json' https://cms.savoirproperties.com/api/search-suggestions | awk -F': ' 'tolower($1)=="x-ratelimit-remaining"{print $2}' | tr -d '\r')
echo "  CMS rate-limit remaining for this server IP: ${rem:-?}/60 per minute"

if [ -n "$VERBOSE" ]; then
  hdr "DETAIL (manual use only — do not paste into public logs)"
  . /etc/os-release 2>/dev/null && echo "  OS: ${PRETTY_NAME:-unknown}; kernel $(uname -r)"
  echo "  node $(node -v 2>/dev/null) npm $(npm -v 2>/dev/null) pm2 $(pm2 -v 2>/dev/null | tail -1)"
  echo "  listeners on 80/443:"; printf '%s\n' "$listeners" | awk '{print "    "$4"  "$6}' | sort -u
  echo "  nginx server blocks:"
  printf '%s\n' "$DUMP" | grep -E '^# configuration file |\b(listen|server_name|proxy_pass|ssl_certificate)\s' | grep -v ssl_certificate_key \
    | sed -E 's/^\s+/      /; s/^# configuration file /    FILE /' | head -150
  echo "  site users:"; for d in /home/*/htdocs; do [ -d "$d" ] && echo "    $(stat -c %U "$d")"; done
  echo "  pm2 apps:"; pm2 jlist 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{for(const p of JSON.parse(s))console.log("    "+p.name,p.pm2_env.status)}catch{}})'
fi

echo
echo "Preflight finished. Nothing was changed."
