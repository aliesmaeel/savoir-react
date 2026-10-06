#!/usr/bin/env bash
# READ-ONLY server inspection for hosting the Savoir MCP server.
# Changes nothing: no installs, no writes, no restarts. Safe to run as the site user.
#
#   bash preflight.sh [PORT]        (default port 8787)
set -uo pipefail
PORT="${1:-8787}"
ok()   { printf '  [ok]   %s\n' "$*"; }
warn() { printf '  [warn] %s\n' "$*"; }
bad()  { printf '  [FAIL] %s\n' "$*"; }
hdr()  { printf '\n== %s\n' "$*"; }

hdr "System"
. /etc/os-release 2>/dev/null && echo "  OS: ${PRETTY_NAME:-unknown}"
echo "  Kernel: $(uname -r)  Arch: $(uname -m)"
echo "  User: $(id -un) (groups: $(id -Gn))"

hdr "Resources"
if command -v free >/dev/null; then
  avail=$(free -m | awk '/^Mem:/{print $7}')
  echo "  Memory available: ${avail} MiB"
  [ "${avail:-0}" -ge 300 ] && ok "≥300 MiB free (the MCP server needs ~100–150 MiB)" || warn "low free memory"
fi
df -h "$HOME" | awk 'NR==2{print "  Disk free in $HOME: "$4" of "$2}'
echo "  Load: $(cut -d' ' -f1-3 /proc/loadavg 2>/dev/null)  CPUs: $(nproc 2>/dev/null)"

hdr "Node.js / pm2"
if command -v node >/dev/null; then
  v=$(node -v); echo "  node $v ($(command -v node))"
  node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>20||(a===20&&b>=6)?0:1)' \
    && ok "Node >= 20.6" || bad "Node >= 20.6 required"
else bad "node not on PATH for this user"; fi
command -v npm >/dev/null && echo "  npm $(npm -v)" || bad "npm missing"
if command -v pm2 >/dev/null; then echo "  pm2 $(pm2 -v 2>/dev/null | tail -1)"; pm2 jlist 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{for(const p of JSON.parse(s))console.log("    pm2 app:",p.name,p.pm2_env.status)}catch{}})'
else warn "pm2 not on PATH for this user (install per-user: npm i -g pm2, or use the site's Node manager)"; fi

hdr "Hosting panel / web server"
command -v clpctl >/dev/null && ok "CloudPanel detected (clpctl)" || echo "  CloudPanel CLI not visible to this user (normal for site users)"
[ -d /home/clp ] && echo "  /home/clp exists (CloudPanel)"
command -v nginx >/dev/null && echo "  $(nginx -v 2>&1)" || echo "  nginx binary not on PATH for this user"
command -v docker >/dev/null && echo "  docker present: $(docker --version 2>/dev/null)" || echo "  docker: not installed / not visible (not required)"

hdr "Reverse proxy (read-only; prints routing directives only, never full configs)"
SUDO=""; [ "$(id -u)" -eq 0 ] || { sudo -n true 2>/dev/null && SUDO="sudo -n"; }
echo "  privilege: $([ "$(id -u)" -eq 0 ] && echo root || ([ -n "$SUDO" ] && echo "passwordless sudo" || echo "unprivileged (some checks limited)"))"
echo "  Listeners on 80/443 (process names need root):"
$SUDO ss -ltnp 2>/dev/null | awk '$4 ~ /:(80|443)$/ {print "    "$4"  "$6}' | sort -u
NGINX_DUMP="$($SUDO nginx -T 2>/dev/null || true)"
if [ -n "$NGINX_DUMP" ]; then
  echo "  nginx -T readable. Server blocks (file / listen / server_name / proxy_pass / cert):"
  printf '%s\n' "$NGINX_DUMP" | grep -E '^# configuration file |\b(listen|server_name|proxy_pass|ssl_certificate)\s' \
    | grep -vE 'ssl_certificate_key' | sed -E 's/^\s+/      /; s/^# configuration file /    FILE /' | head -120
  if printf '%s\n' "$NGINX_DUMP" | grep -qE 'server_name[^;]*\bmcp\.savoirproperties\.com\b'; then
    warn "an nginx server block for mcp.savoirproperties.com ALREADY exists"
  else ok "no existing server block for mcp.savoirproperties.com"; fi
else
  echo "  nginx -T not readable as this user; enabled site files:"
  ls -1 /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null | sed 's/^/    /'
fi
echo "  Panels / tooling:"
{ command -v clpctl >/dev/null || [ -x /usr/bin/clpctl ]; } && echo "    CloudPanel CLI (clpctl): present" || echo "    CloudPanel CLI: not found"
[ -d /home/clp ] && echo "    CloudPanel data dir /home/clp: present"
command -v certbot >/dev/null && echo "    certbot: $(certbot --version 2>&1)" || echo "    certbot: not found"
command -v caddy >/dev/null && echo "    caddy binary present (do not start it: nginx owns 80/443)" || true
echo "  Certificates (names only):"; $SUDO ls -1 /etc/letsencrypt/live 2>/dev/null | sed 's/^/    /' || echo "    not readable"
echo "  Website process (pm2 savoir-react) listening port, if visible:"
pm2 jlist 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{for(const p of JSON.parse(s))if(p.name==="savoir-react")console.log("    PORT env:",p.pm2_env.env?.PORT??p.pm2_env.PORT??"(default; react-router-serve uses 3000)")}catch{}})'

hdr "Port ${PORT}"
if command -v ss >/dev/null; then
  for p in "$PORT" "$((PORT + 100))"; do
    if ss -ltn "( sport = :${p} )" | grep -q LISTEN; then bad "port ${p} already in use — choose another PORT"; else ok "port ${p} free$([ "$p" != "$PORT" ] && echo ' (deploy boot-test port)')"; fi
  done
  echo "  Listening TCP ports (for reference):"; ss -ltn | awk 'NR>1{print "    "$4}' | sort -u | head -30
fi

hdr "CMS reachability and rate-limit budget from this server"
for _ in 1 2; do
  curl -s -o /dev/null -D - -m 10 -H 'Accept: application/json' https://cms.savoirproperties.com/api/search-suggestions \
    | grep -iE '^(HTTP|x-ratelimit-limit|x-ratelimit-remaining)' | sed 's/^/  /'
done
echo "  (If 'remaining' is well below 58 here, other apps on this IP — e.g. website SSR — are already using the shared 60/min budget.)"
echo "  /etc/hosts entries for savoirproperties.com:"; grep -i savoirproperties /etc/hosts | sed 's/^/    /' || echo "    none"

hdr "Outbound HTTPS (image hosts used by the widget are fetched by the browser, not the server)"
curl -s -o /dev/null -w '  cms.savoirproperties.com: %{http_code}\n' -m 10 https://cms.savoirproperties.com/api/search-suggestions

echo
echo "Preflight finished. Nothing was changed."
