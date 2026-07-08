#!/bin/bash
# =============================================================================
# Database Backup Script
# Run daily via cron: 0 2 * * * /opt/parichay/deploy/scripts/backup.sh
# =============================================================================

set -euo pipefail

BACKUP_DIR="/opt/parichay/backups"
RETENTION_DAYS=14
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/parichay_${TIMESTAMP}.sql.gz"

mkdir -p $BACKUP_DIR

echo "[$(date)] Starting backup..."

# Dump PostgreSQL via Docker
docker compose -f /opt/parichay/docker-compose.prod.yml exec -T db \
  pg_dump -U parichay -d parichay_prod --no-owner --clean \
  | gzip > "$BACKUP_FILE"

# Verify backup
if [ -s "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "[$(date)] ✅ Backup successful: $BACKUP_FILE ($SIZE)"
else
    echo "[$(date)] ❌ Backup failed — empty file"
    rm -f "$BACKUP_FILE"
    exit 1
fi

# Delete old backups
find $BACKUP_DIR -name "parichay_*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "[$(date)] Cleaned backups older than $RETENTION_DAYS days"

# Optional: Upload to S3
# aws s3 cp "$BACKUP_FILE" "s3://parichay-backups/db/${TIMESTAMP}.sql.gz"
