#!/usr/bin/env bash
# Install a release tarball and switch to it, with automatic rollback on failure.
# Run on the server as the MCP site user (never as root).
#
#   bash deploy.sh /path/to/savoir-mcp-<version>-<stamp>.tgz
#
# Env: APP_ROOT (default: $HOME/savoir-mcp), APP_NAME (default savoir-mcp), KEEP_RELEASES (default 5)
#
# Only releases that passed the post-switch health check get a .healthy marker;
# rollback.sh only ever returns to a marked release.
set -euo pipefail

TARBALL="${1:?usage: deploy.sh <release.tgz>}"
APP_ROOT="${APP_ROOT:-$HOME/savoir-mcp}"
KEEP="${KEEP_RELEASES:-5}"
ENV_FILE="$APP_ROOT/shared/.env"
TS="$(date -u +%Y%m%d%H%M%S)"
REL="$APP_ROOT/releases/$TS"
APP_NAME="${APP_NAME:-savoir-mcp}"

log() { printf '[deploy %s] %s\n' "$(date -u +%H:%M:%S)" "$*"; }
die() { log "ERROR: $*"; exit 1; }

[ "$(id -u)" -ne 0 ] || die "do not run as root; run as the site user"
[ -f "$TARBALL" ] || die "tarball not found: $TARBALL"
[ -f "$ENV_FILE" ] || die "missing $ENV_FILE (copy deploy/production.env.example there, chmod 600)"
command -v pm2 >/dev/null || die "pm2 not found on PATH"
[ -e "$REL" ] && die "$REL already exists"

envval() { grep -E "^$1=" "$ENV_FILE" | tail -1 | cut -d= -f2- | tr -d '"'"'"; }
MODE="$(envval INQUIRY_MODE)"
PORT="$(envval PORT)"; PORT="${PORT:-8787}"
PUBLIC_HOST="$(envval ALLOWED_HOSTS | cut -d, -f1)"
[ -n "$PUBLIC_HOST" ] || die "ALLOWED_HOSTS must be set in $ENV_FILE"
# Read-only launch guard.
if [ "${MODE:-disabled}" != "disabled" ] && [ "${ALLOW_INQUIRIES:-}" != "yes" ]; then
  die "INQUIRY_MODE=$MODE in $ENV_FILE; read-only launch requires INQUIRY_MODE=disabled"
fi

port_busy() { (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null; }
health_ok() { curl -fsS -m 2 -H "Host: $PUBLIC_HOST" "http://127.0.0.1:$1/health" 2>/dev/null | grep -q '"inquiry_mode":"disabled"'; }
pm2_restart_clean() {
  pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
  pm2 start "$APP_ROOT/current/deploy/ecosystem.config.cjs" >/dev/null
}

log "unpacking to $REL"
mkdir -p "$REL"
tar -xzf "$TARBALL" -C "$REL"
[ -f "$REL/dist/index.js" ] || { rm -rf "$REL"; die "release is missing dist/index.js"; }

log "installing production dependencies"
(cd "$REL" && npm ci --omit=dev --no-audit --no-fund --loglevel=error) || { rm -rf "$REL"; die "npm ci failed"; }

# Boot test: start the new release on a free temporary port, require that THIS process answers.
TEST_PORT=$((PORT + 100))
port_busy "$TEST_PORT" && { rm -rf "$REL"; die "boot-test port $TEST_PORT is in use"; }
log "boot test on 127.0.0.1:$TEST_PORT"
BOOT_LOG="$(mktemp)"
(
  set -a
  # shellcheck source=/dev/null
  . "$ENV_FILE"
  set +a
  cd "$REL"
  PORT="$TEST_PORT" HOST=127.0.0.1 LOG_LEVEL=warn exec node dist/index.js
) >"$BOOT_LOG" 2>&1 &
BOOT_PID=$!
booted=""
for _ in $(seq 1 20); do
  kill -0 "$BOOT_PID" 2>/dev/null || break
  if health_ok "$TEST_PORT"; then booted=1; break; fi
  sleep 1
done
kill "$BOOT_PID" 2>/dev/null || true
for _ in $(seq 1 15); do kill -0 "$BOOT_PID" 2>/dev/null || break; sleep 1; done
kill -9 "$BOOT_PID" 2>/dev/null || true
if [ -z "$booted" ]; then
  sed 's/^/    /' "$BOOT_LOG" | tail -20; rm -f "$BOOT_LOG"; rm -rf "$REL"
  die "boot test failed; release discarded, live service untouched"
fi
rm -f "$BOOT_LOG"

PREV="$(readlink "$APP_ROOT/current" 2>/dev/null || true)"
log "switching current -> releases/$TS (previous: ${PREV:-none})"
ln -sfn "$REL" "$APP_ROOT/current.new" && mv -Tf "$APP_ROOT/current.new" "$APP_ROOT/current"

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload "$APP_ROOT/current/deploy/ecosystem.config.cjs" --update-env >/dev/null || pm2_restart_clean
else
  pm2 start "$APP_ROOT/current/deploy/ecosystem.config.cjs" >/dev/null
fi

healthy=""
for _ in $(seq 1 30); do
  if health_ok "$PORT"; then healthy=1; break; fi
  sleep 1
done

if [ -z "$healthy" ]; then
  log "post-switch health check FAILED"
  if [ -n "$PREV" ] && [ -f "$PREV/.healthy" ]; then
    log "rolling back to $PREV"
    ln -sfn "$PREV" "$APP_ROOT/current.new" && mv -Tf "$APP_ROOT/current.new" "$APP_ROOT/current"
    pm2_restart_clean
    for _ in $(seq 1 30); do health_ok "$PORT" && break; sleep 1; done
    health_ok "$PORT" && log "rollback healthy" || log "rollback ALSO unhealthy — check: pm2 logs $APP_NAME"
  else
    pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
    rm -f "$APP_ROOT/current"
    log "no previous healthy release; service stopped"
  fi
  pm2 save >/dev/null 2>&1 || true
  rm -rf "$REL"
  die "deployment of $TS failed; release removed"
fi

touch "$REL/.healthy"
pm2 save >/dev/null
log "healthy on 127.0.0.1:$PORT; pruning old releases (keeping $KEEP)"
ls -1dt "$APP_ROOT"/releases/*/ | tail -n +"$((KEEP + 1))" | xargs -r rm -rf
log "done: $(readlink "$APP_ROOT/current")"
