#!/bin/bash

# File Storage Backup Script
# This script backs up uploaded files from S3

set -e

echo "📁 Starting File Storage Backup..."
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

if [ -z "$AWS_S3_BUCKET" ]; then
    echo "❌ AWS_S3_BUCKET is not set"
    exit 1
fi

# Create backup directory
BACKUP_DIR="./backups/files"
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="$BACKUP_DIR/s3_backup_$TIMESTAMP"

echo "📁 Backup location: $BACKUP_PATH"
echo ""

# Sync S3 bucket to local directory
echo "Syncing files from S3..."
aws s3 sync "s3://$AWS_S3_BUCKET" "$BACKUP_PATH" --exclude "backups/*"

if [ $? -eq 0 ]; then
    echo "✅ Files synced successfully"
else
    echo "❌ File sync failed"
    exit 1
fi

# Get backup size
BACKUP_SIZE=$(du -sh "$BACKUP_PATH" | cut -f1)
echo "📦 Backup size: $BACKUP_SIZE"

# Create archive
echo ""
echo "Creating archive..."
tar -czf "$BACKUP_PATH.tar.gz" -C "$BACKUP_DIR" "s3_backup_$TIMESTAMP"

if [ $? -eq 0 ]; then
    echo "✅ Archive created successfully"
    # Remove uncompressed directory
    rm -rf "$BACKUP_PATH"
else
    echo "❌ Archive creation failed"
    exit 1
fi

# Clean up old backups (keep last 7 days)
echo ""
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
echo "✅ Old backups cleaned up (kept last 7 days)"

echo ""
echo "✅ File backup completed successfully!"
echo "Backup file: $BACKUP_PATH.tar.gz"
