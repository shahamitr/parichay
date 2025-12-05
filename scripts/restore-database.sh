#!/bin/bash

# Database Restore Script
# This script restores a PostgreSQL database from a backup

set -e

echo "🔄 Database Restore Script"
echo "=========================="
echo ""

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Usage: ./restore-database.sh <backup-file>"
    echo ""
    echo "Available backups:"
    ls -lh ./backups/database/*.sql.gz 2>/dev/null || echo "No local backups found"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

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

echo "⚠️  WARNING: This will OVERWRITE the current database!"
echo "Database: $DATABASE_URL"
echo "Backup file: $BACKUP_FILE"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo ""
echo "📦 Extracting backup..."

# Create temp directory
TEMP_DIR=$(mktemp -d)
TEMP_SQL="$TEMP_DIR/restore.sql"

# Extract backup
gunzip -c "$BACKUP_FILE" > "$TEMP_SQL"

if [ $? -eq 0 ]; then
    echo "✅ Backup extracted"
else
    echo "❌ Failed to extract backup"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo ""
echo "🗄️ Restoring database..."

# Drop existing connections
psql "$DATABASE_URL" -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid();" > /dev/null 2>&1

# Restore database
psql "$DATABASE_URL" < "$TEMP_SQL"

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully"
else
    echo "❌ Database restore failed"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Clean up
rm -rf "$TEMP_DIR"

echo ""
echo "🔍 Verifying restore..."

# Run a simple query to verify
RECORD_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM \"Brand\";" 2>/dev/null || echo "0")
echo "Brand records: $RECORD_COUNT"

echo ""
echo "✅ Restore completed successfully!"
