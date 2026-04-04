#!/usr/bin/env bash
# Valkey health check — meant to run via cron every 5 minutes
# Install: crontab -e → */5 * * * * /opt/valkey/health-check.sh >> /var/log/valkey-health.log 2>&1

set -euo pipefail

COMPOSE_DIR="/opt/valkey"
CONTAINER_NAME="deepshaswat-valkey"

if ! docker inspect --format='{{.State.Running}}' "$CONTAINER_NAME" 2>/dev/null | grep -q true; then
  echo "$(date -Iseconds) [WARN] Valkey container not running. Restarting..."
  cd "$COMPOSE_DIR" && docker compose up -d
  echo "$(date -Iseconds) [INFO] Restart triggered."
  exit 0
fi

if ! docker exec "$CONTAINER_NAME" valkey-cli ping 2>/dev/null | grep -q PONG; then
  echo "$(date -Iseconds) [WARN] Valkey not responding to PING. Restarting..."
  cd "$COMPOSE_DIR" && docker compose restart
  echo "$(date -Iseconds) [INFO] Restart triggered."
  exit 0
fi

echo "$(date -Iseconds) [OK] Valkey healthy."
