#!/bin/bash
# n8n Update Script for van-cloud
# Run: bash ~/docker/n8n/update-n8n.sh
#
# Robust version - handles container conflicts, dead containers,
# and Docker daemon issues learned 2026-05-04.

set -e

COMPOSE_DIR="/home/vandevo/docker/n8n"
CONTAINER_NAME="n8n"

echo "[1/4] Pulling latest n8n image..."
cd "$COMPOSE_DIR"
sudo docker compose pull n8n

echo "[2/4] Cleaning up any dead/conflicting containers..."
ALL_N8N=$(sudo docker ps -aq --filter name=n8n 2>/dev/null)
if [ -n "$ALL_N8N" ]; then
    sudo docker rm -f $ALL_N8N 2>/dev/null || true
    sleep 3
fi

echo "[3/4] Starting n8n with new image..."
sudo docker compose up -d n8n
sleep 5

echo "[4/4] Cleaning up old images..."
sudo docker image prune -f

NEW_VERSION=$(sudo docker exec "$(sudo docker ps -q --filter name=n8n)" node -e 'console.log(JSON.parse(require("fs").readFileSync("/usr/local/lib/node_modules/n8n/package.json")).version)' 2>/dev/null || echo "unknown")
echo ""
echo "n8n updated to: $NEW_VERSION"
echo "Status: $(sudo docker ps --filter name=n8n --format '{{.Status}}')"

# Log to a simple version history file
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) -> $NEW_VERSION" >> "$COMPOSE_DIR/version-history.log"
