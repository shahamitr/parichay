#!/bin/bash
# =============================================================================
# Parichay Dev Environment — Hot Reload Containers
# Run: ./dev.sh
# =============================================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   Parichay Dev Environment                   ║"
echo "║   Next.js + PostgreSQL + Redis (Hot Reload)  ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Install Docker first."
    exit 1
fi

if ! docker info &> /dev/null 2>&1; then
    echo "❌ Docker is not running. Start Docker Desktop."
    exit 1
fi

# Start containers
echo "[1/3] Starting containers..."
docker compose -f docker-compose.dev.yml up -d --build

# Wait for PostgreSQL
echo "[2/3] Waiting for PostgreSQL..."
until docker compose -f docker-compose.dev.yml exec -T db pg_isready -U postgres --silent 2>/dev/null; do
    sleep 2
done
echo "  ✓ PostgreSQL ready"

# Run migrations
echo "[3/3] Pushing schema to database..."
docker compose -f docker-compose.dev.yml exec -T app npx prisma db push --skip-generate 2>/dev/null || true

echo ""
echo "════════════════════════════════════════════"
echo "✅ Dev environment running!"
echo ""
echo "  App:        http://localhost:3000"
echo "  PostgreSQL: localhost:5432 (postgres/postgres)"
echo "  Redis:      localhost:6379"
echo ""
echo "  Logs:     docker compose -f docker-compose.dev.yml logs -f app"
echo "  Stop:     docker compose -f docker-compose.dev.yml down"
echo "  Reset DB: docker compose -f docker-compose.dev.yml down -v"
echo "════════════════════════════════════════════"
echo ""

# Follow app logs
docker compose -f docker-compose.dev.yml logs -f app
