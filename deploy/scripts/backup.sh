#!/bin/bash
# =============================================================================
# Database Backup Script (Weekly)
# Run via cron: 0 2 * * 0 /opt/parichay/deploy/scripts/backup.sh
# (Every Sunday at 2 AM)
# =============================================================================

set -euo pipefail

BACKUP_DIR="/opt/parichay/backups"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/parichay_${TIMESTAMP}.sql.gz"

mkdir -p $BACKUP_DIR

echo "[$(date)] Starting weekly backup..."

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

# Delete old backups (keep 30 days = ~4 weekly backups)
find $BACKUP_DIR -name "parichay_*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "[$(date)] Cleaned backups older than $RETENTION_DAYS days"

# Optional: Upload to S3
# aws s3 cp "$BACKUP_FILE" "s3://parichay-backups/db/${TIMESTAMP}.sql.gz"
