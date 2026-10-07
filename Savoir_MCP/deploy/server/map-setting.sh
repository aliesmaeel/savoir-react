#!/usr/bin/env bash
# Turn the property map (MapLibre + OpenFreeMap) on or off in an instance's shared/.env.
# A timestamped backup of the settings file is kept first. Run as the MCP site user; reload pm2 afterwards.
#
#   APP_ROOT=~/savoir-mcp bash map-setting.sh on|off
set -euo pipefail
MODE="${1:?on|off}"
APP_ROOT="${APP_ROOT:?APP_ROOT}"
ENV_FILE="$APP_ROOT/shared/.env"
[ -f "$ENV_FILE" ] || { echo "missing $ENV_FILE"; exit 1; }
case "$MODE" in on|off) ;; *) echo "usage: map-setting.sh on|off"; exit 1 ;; esac

BACKUP="$ENV_FILE.bak-$(date -u +%Y%m%d%H%M%S)"
cp -p "$ENV_FILE" "$BACKUP"
chmod 600 "$BACKUP"
# Keep the newest 10 backups.
ls -1t "$ENV_FILE".bak-* 2>/dev/null | tail -n +11 | xargs -r rm -f

umask 077
{
  grep -vE '^MAP_(ENGINE|STYLE_URL|STYLE_URL_DARK|CONNECT_DOMAINS|TILE_URL|TILE_ATTRIBUTION|TILE_SUBDOMAINS|MAX_ZOOM)=' "$ENV_FILE" || true
  if [ "$MODE" = "on" ]; then
    echo "MAP_ENGINE=maplibre"
    echo "MAP_STYLE_URL=https://tiles.openfreemap.org/styles/positron"
    echo "MAP_STYLE_URL_DARK=https://tiles.openfreemap.org/styles/dark"
  fi
} > "$ENV_FILE.new"
install -m 600 "$ENV_FILE.new" "$ENV_FILE"
rm -f "$ENV_FILE.new"
grep -qx 'INQUIRY_MODE=disabled' "$ENV_FILE" || { echo "INQUIRY_MODE must stay disabled; restoring backup"; install -m 600 "$BACKUP" "$ENV_FILE"; exit 1; }
echo "map $MODE (backup: $(basename "$BACKUP"))"
