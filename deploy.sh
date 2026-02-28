#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# deploy.sh - Build and deploy the mobile-web frontend
# ============================================================

APP_NAME="template-frontend-mobile-web"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "==> Building $APP_NAME Docker image..."
docker build -t "$APP_NAME:$IMAGE_TAG" .

echo "==> Stopping existing containers..."
docker compose down --remove-orphans 2>/dev/null || true

echo "==> Starting services..."
docker compose up -d

echo "==> Waiting for health check..."
sleep 3

if curl -sf http://localhost/health > /dev/null 2>&1; then
  echo "==> Deployment successful! App is running at http://localhost"
else
  echo "==> Warning: Health check failed. Check logs with: docker compose logs frontend"
  exit 1
fi

echo "==> Done."
