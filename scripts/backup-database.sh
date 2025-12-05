#!/bin/bash

# Database Backup Script
# This script creates a backup of the PostgreSQL database

set -e

echo "💾 Starting Database Backup..."
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

# Create backup directory
BACKUP_DIR="./backups/database"
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/onetouch_bizcard_$TIMESTAMP.sql"
BACKUP_FILE_COMPRESSED="$BACKUP_FILE.gz"

echo "📁 Backup location: $BACKUP_FILE_COMPRESSED"
echo ""

# Create backup
echo "Creating database dump..."
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database dump created successfully"
else
    echo "❌ Database dump failed"
    exit 1
fi

# Compress backup
echo "Compressing backup..."
gzip "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup compressed successfully"
else
    echo "❌ Compression failed"
    exit 1
fi

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE_COMPRESSED" | cut -f1)
echo "📦 Backup size: $BACKUP_SIZE"

# Upload to S3 (if configured)
if [ ! -z "$AWS_S3_BUCKET" ] && [ ! -z "$AWS_ACCESS_KEY_ID" ]; then
    echo ""
    echo "☁️ Uploading to S3..."

    S3_PATH="s3://$AWS_S3_BUCKET/backups/database/onetouch_bizcard_$TIMESTAMP.sql.gz"

    aws s3 cp "$BACKUP_FILE_COMPRESSED" "$S3_PATH" --storage-class STANDARD_IA

    if [ $? -eq 0 ]; then
        echo "✅ Backup uploaded to S3: $S3_PATH"
    else
        echo "⚠️ S3 upload failed, backup saved locally only"
    fi
fi

# Clean up old local backups (keep last 7 days)
echo ""
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
echo "✅ Old backups cleaned up (kept last 7 days)"

echo ""
echo "✅ Backup completed successfully!"
echo "Backup file: $BACKUP_FILE_COMPRESSED"
