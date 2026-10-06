#!/usr/bin/env bash
# Put https://mcp.savoirproperties.com in front of the MCP service (127.0.0.1:8787)
# using the server's EXISTING nginx. Never starts another web server, never edits
# other sites' configuration. Requires root or passwordless sudo.
#
#   bash configure-https.sh [--dry-run]
# Env: DOMAIN (mcp.savoirproperties.com), PORT (8787), ACME_EMAIL (plain-nginx/certbot only)
set -euo pipefail
DOMAIN="${DOMAIN:-mcp.savoirproperties.com}"
PORT="${PORT:-8787}"
DRY="${1:-}"
log() { printf '[https %s] %s\n' "$(date -u +%H:%M:%S)" "$*"; }
die() { log "ERROR: $*"; exit 1; }
reload_nginx() { $S systemctl reload nginx 2>/dev/null || $S nginx -s reload; }
run() { if [ "$DRY" = "--dry-run" ]; then log "(dry-run) $*"; else "$@"; fi; }

[[ "$DOMAIN" =~ ^[a-z0-9.-]+$ ]] || die "invalid DOMAIN"
[[ "$PORT" =~ ^[0-9]+$ ]] || die "invalid PORT"
if [ "$(id -u)" -eq 0 ]; then S=""; elif sudo -n true 2>/dev/null; then S="sudo -n"; else die "root or passwordless sudo required"; fi

# 1. The MCP service must already be running and healthy on loopback.
curl -fsS -m 3 -H "Host: $DOMAIN" "http://127.0.0.1:$PORT/health" | grep -q '"inquiry_mode":"disabled"' \
  || die "MCP service not healthy on 127.0.0.1:$PORT (deploy it first)"
log "MCP service healthy on 127.0.0.1:$PORT"

# 2. DNS must point at this server (Let's Encrypt needs it).
want="$(getent ahostsv4 savoirproperties.com | awk 'NR==1{print $1}' || true)"
have="$(getent ahostsv4 "$DOMAIN" | awk 'NR==1{print $1}' || true)"
[ -n "$have" ] || die "$DOMAIN does not resolve yet (add the A record first)"
if [ "$have" != "$want" ] && ! hostname -I | tr ' ' '\n' | grep -qx "$have"; then
  die "$DOMAIN resolves to $have, not this server ($want)"
fi
log "DNS ok: $DOMAIN -> $have"

# 3. nginx must be the server on 80/443 and must not already serve this domain differently.
command -v nginx >/dev/null || die "nginx not found"
$S ss -ltnp | awk '$4 ~ /:(80|443)$/' | grep -q nginx || die "nginx is not the process on ports 80/443; stopping (inspect manually)"
DUMP="$($S nginx -T 2>/dev/null)" || die "nginx -T failed (current config invalid?)"
if printf '%s\n' "$DUMP" | grep -qE "server_name[^;]*\b${DOMAIN//./\\.}\b"; then
  if printf '%s\n' "$DUMP" | grep -qE "proxy_pass\s+http://(127\.0\.0\.1|localhost):${PORT}\b"; then
    log "a server block for $DOMAIN proxying to :$PORT already exists; only ensuring the certificate"
    EXISTS=1
  else
    die "a server block for $DOMAIN already exists and does not proxy to :$PORT; refusing to change it"
  fi
fi

if command -v clpctl >/dev/null 2>&1 || [ -x /usr/bin/clpctl ]; then
  # 4a. CloudPanel: create a reverse-proxy site with the panel's own CLI so the panel stays the source of truth.
  log "CloudPanel detected"
  if [ -z "${EXISTS:-}" ]; then
    pw="$(openssl rand -base64 24 | tr -d '/+=' | cut -c1-24)A1!"   # panel site user only; not used by the app, not printed
    echo "::add-mask::$pw"   # defence in depth: hidden even if a tool echoes it into the public Actions log
    run $S clpctl site:add:reverse-proxy --domainName="$DOMAIN" --reverseProxyUrl="http://127.0.0.1:$PORT" \
      --siteUser="savoir-mcp-proxy" --siteUserPassword="$pw"
  fi
  run $S clpctl lets-encrypt:install:certificate --domainName="$DOMAIN"
elif [ -d /etc/nginx/sites-available ] && [ -d /etc/nginx/sites-enabled ]; then
  # 4b. Plain nginx + certbot, in a dedicated file.
  log "plain nginx (sites-available layout)"
  command -v certbot >/dev/null || die "certbot not installed (apt-get install certbot python3-certbot-nginx)"
  [ -n "${ACME_EMAIL:-}" ] || die "ACME_EMAIL is required for certbot"
  CONF="/etc/nginx/sites-available/$DOMAIN.conf"
  if [ -z "${EXISTS:-}" ]; then
    [ -e "$CONF" ] && die "$CONF exists but is not active; inspect it manually"
    TMP="$(mktemp)"
    cat >"$TMP" <<NGINX
# Savoir MCP server (managed by Savoir_MCP/deploy/server/configure-https.sh)
server {
    listen 80;
    server_name $DOMAIN;
    client_max_body_size 512k;
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_read_timeout 300s;
    }
}
NGINX
    run $S install -m 644 "$TMP" "$CONF"; rm -f "$TMP"
    run $S ln -s "$CONF" "/etc/nginx/sites-enabled/$DOMAIN.conf"
    if [ "$DRY" != "--dry-run" ] && ! $S nginx -t; then
      $S rm -f "/etc/nginx/sites-enabled/$DOMAIN.conf" "$CONF"
      die "nginx -t failed; new site removed, nginx not reloaded"
    fi
    run reload_nginx
  fi
  run $S certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$ACME_EMAIL" --redirect
  if [ "$DRY" != "--dry-run" ]; then $S nginx -t && reload_nginx; fi
else
  die "unknown nginx layout; configure the proxy manually (see deploy/nginx/mcp.savoirproperties.com.conf)"
fi

[ "$DRY" = "--dry-run" ] && { log "dry run complete; nothing changed"; exit 0; }

# 5. Verify through nginx with the real certificate.
sleep 2
code="$(curl -s -o /tmp/mcp-health.json -w '%{http_code}' -m 10 --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/health" || true)"
if [ "$code" = "200" ] && grep -q '"inquiry_mode":"disabled"' /tmp/mcp-health.json; then
  log "https://$DOMAIN/health OK through nginx"
elif [ "$code" = "403" ]; then
  die "proxy reached the app but Host was rejected: the vhost must send 'proxy_set_header Host \$host;' (or add the upstream host to ALLOWED_HOSTS)"
else
  die "https://$DOMAIN/health returned $code through nginx"
fi
