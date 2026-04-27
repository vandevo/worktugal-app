#!/bin/bash
# n8n Update Script for van-cloud
# Run: bash ~/docker/n8n/update-n8n.sh

set -e

cd ~/docker/n8n

echo "Pulling latest n8n image..."
docker compose pull n8n

echo "Restarting n8n container..."
docker compose up -d n8n

echo "Cleaning up old images..."
docker image prune -f

NEW_VERSION=$(docker inspect n8n --format='{{.Config.Image}}' | grep -oP ':\K.*' || echo "unknown")
echo "✅ n8n updated to: $NEW_VERSION"
