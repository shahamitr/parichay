#!/bin/bash

# Database Connection Test Script

set -e

echo "🗄️ Testing Database Connection..."
echo ""

# Load environment variables
if [ -f ".env.production" ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
elif [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ No environment file found"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set"
    exit 1
fi

echo "Testing connection to database..."
echo ""

# Test connection using psql
echo "1. Testing basic connection..."
if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Check database version
echo "2. Checking PostgreSQL version..."
VERSION=$(psql "$DATABASE_URL" -t -c "SELECT version();")
echo "✅ PostgreSQL version: $VERSION"

# Check connection pool settings
echo ""
echo "3. Checking connection settings..."
psql "$DATABASE_URL" -c "SHOW max_connections;"
psql "$DATABASE_URL" -c "SELECT count(*) as active_connections FROM pg_stat_activity;"

# Test Prisma connection
echo ""
echo "4. Testing Prisma connection..."
if npx prisma db pull --force > /dev/null 2>&1; then
    echo "✅ Prisma can connect to database"
else
    echo "❌ Prisma connection failed"
    exit 1
fi

# Check if migrations are up to date
echo ""
echo "5. Checking migration status..."
npx prisma migrate status

echo ""
echo "✅ All database tests passed successfully!"
