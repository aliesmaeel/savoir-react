#!/usr/bin/env bash
# Roll back to the previous healthy release (or a named one) and verify health.
#
#   bash rollback.sh               # previous healthy release
#   bash rollback.sh 20261006120000
#   bash rollback.sh --list
#   bash rollback.sh --stop        # take the MCP service offline (website unaffected)
set -euo pipefail
APP_ROOT="${APP_ROOT:-$HOME/savoir-mcp}"
APP_NAME="${APP_NAME:-savoir-mcp}"
ENV_FILE="$APP_ROOT/shared/.env"
cd "$APP_ROOT/releases"
CUR="$(basename "$(readlink "$APP_ROOT/current" 2>/dev/null || echo none)")"

# Release directories are UTC timestamps, so reverse name order is newest first.
releases_newest_first() { for d in */; do printf '%s\n' "${d%/}"; done | sort -r; }

case "${1:-}" in
  --list)
    for r in $(releases_newest_first); do
      printf '%s%s%s\n' "$r" "$([ -f "$r/.healthy" ] && echo "  healthy" || echo "  (never healthy)")" "$([ "$r" = "$CUR" ] && echo "  <- current")"
    done
    exit 0 ;;
  --stop) pm2 stop "$APP_NAME" && pm2 save >/dev/null && echo "$APP_NAME stopped"; exit 0 ;;
esac

if [ -n "${1:-}" ]; then
  TARGET="$1"
else
  TARGET=""
  for r in $(releases_newest_first); do
    if [ "$r" != "$CUR" ] && [ -f "$r/.healthy" ]; then TARGET="$r"; break; fi
  done
fi
[ -n "$TARGET" ] && [ -f "$TARGET/.healthy" ] || { echo "no healthy release to roll back to (current: $CUR)"; exit 1; }

echo "rolling back: $CUR -> $TARGET"
ln -sfn "$APP_ROOT/releases/$TARGET" "$APP_ROOT/current.new" && mv -Tf "$APP_ROOT/current.new" "$APP_ROOT/current"
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
pm2 start "$APP_ROOT/current/deploy/ecosystem.config.cjs" >/dev/null
pm2 save >/dev/null

PORT="$(grep -E '^PORT=' "$ENV_FILE" | cut -d= -f2)"; PORT="${PORT:-8787}"
PUBLIC_HOST="$(grep -E '^ALLOWED_HOSTS=' "$ENV_FILE" | cut -d= -f2 | cut -d, -f1)"
for _ in $(seq 1 30); do
  if curl -fsS -m 2 -H "Host: ${PUBLIC_HOST:-localhost}" "http://127.0.0.1:$PORT/health" 2>/dev/null; then echo; echo "rollback healthy"; exit 0; fi
  sleep 1
done
echo "rollback switched but health check failed; inspect: pm2 logs $APP_NAME --lines 100"; exit 1
