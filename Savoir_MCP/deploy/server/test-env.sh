#!/usr/bin/env bash
# Create the TEST instance's settings file if it does not exist yet. Never reads or copies
# production settings. Run on the server as the MCP site user.
#
#   bash test-env.sh <domain> <port>
#
# The test instance: read-only (inquiries disabled), no staff dashboard, the MapLibre + OpenFreeMap
# map, and a small CMS budget so production keeps most of the CMS limit the two share (same server IP).
set -euo pipefail
DOMAIN="${1:?domain}"
PORT="${2:?port}"
[[ "$DOMAIN" =~ ^[a-z0-9.-]+$ ]] || { echo "invalid domain"; exit 1; }
[[ "$PORT" =~ ^[0-9]+$ ]] || { echo "invalid port"; exit 1; }
APP_ROOT="${APP_ROOT:?APP_ROOT}"
[ "$(basename "$APP_ROOT")" = "savoir-mcp-test" ] || { echo "refusing: $APP_ROOT is not the test app root"; exit 1; }
ENV_FILE="$APP_ROOT/shared/.env"
mkdir -p "$APP_ROOT/shared"
if [ -f "$ENV_FILE" ]; then
  echo "test settings already present (not modified)"
  exit 0
fi
umask 077
cat > "$ENV_FILE" <<EOF
# Savoir MCP TEST instance ($DOMAIN). Created by deploy/server/test-env.sh.
CMS_BASE_URL=https://cms.savoirproperties.com
PUBLIC_SITE_URL=https://savoirproperties.com
HOST=127.0.0.1
PORT=$PORT
ALLOWED_HOSTS=$DOMAIN
CMS_TIMEOUT_MS=8000
CMS_MAX_REQUESTS_PER_MINUTE=10
INQUIRY_MODE=disabled
PUBLIC_MCP_URL=https://$DOMAIN
DATA_DIR=
ATTRIBUTION_UTM=off
ANALYTICS=on
ANALYTICS_LINK_SECRET=$(openssl rand -hex 32)
INSIGHTS_USER=
INSIGHTS_PASSWORD_HASH=
MAP_ENGINE=maplibre
MAP_STYLE_URL=https://tiles.openfreemap.org/styles/positron
MAP_STYLE_URL_DARK=https://tiles.openfreemap.org/styles/dark
LOG_LEVEL=info
EOF
chmod 600 "$ENV_FILE"
echo "test settings created"
