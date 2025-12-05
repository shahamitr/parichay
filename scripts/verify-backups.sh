#!/bin/bash

# Backup Verification Script
# This script verifies that backups are being created and are valid

set -e

echo "🔍 Backup Verification Script"
echo "=============================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Load environment variables
if [ -f ".env.production" ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
elif [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ No environment file found${NC}"
    exit 1
fi

# Check 1: Local database backups
echo "1️⃣ Checking local database backups..."
echo ""

if [ -d "./backups/database" ]; then
    BACKUP_COUNT=$(ls -1 ./backups/database/*.sql.gz 2>/dev/null | wc -l)

    if [ "$BACKUP_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓ Found $BACKUP_COUNT local database backup(s)${NC}"

        # Check latest backup age
        LATEST_BACKUP=$(ls -t ./backups/database/*.sql.gz 2>/dev/null | head -1)
        BACKUP_AGE=$(( ($(date +%s) - $(stat -f %m "$LATEST_BACKUP" 2>/dev/null || stat -c %Y "$LATEST_BACKUP")) / 3600 ))

        echo "  Latest backup: $(basename $LATEST_BACKUP)"
        echo "  Age: ${BACKUP_AGE} hours"

        if [ "$BACKUP_AGE" -gt 24 ]; then
            echo -e "${YELLOW}⚠ Latest backup is older than 24 hours${NC}"
            ((WARNINGS++))
        fi

        # Verify backup integrity
        echo "  Verifying backup integrity..."
        if gunzip -t "$LATEST_BACKUP" 2>/dev/null; then
            echo -e "${GREEN}✓ Backup file is valid${NC}"
        else
            echo -e "${RED}✗ Backup file is corrupted${NC}"
            ((ERRORS++))
        fi
    else
        echo -e "${RED}✗ No local database backups found${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗ Backup directory does not exist${NC}"
    ((ERRORS++))
fi

echo ""

# Check 2: S3 database backups
echo "2️⃣ Checking S3 database backups..."
echo ""

if [ ! -z "$AWS_S3_BUCKET" ] && [ ! -z "$AWS_ACCESS_KEY_ID" ]; then
    S3_BACKUP_PATH="s3://$AWS_S3_BUCKET/backups/database/"

    if aws s3 ls "$S3_BACKUP_PATH" > /dev/null 2>&1; then
        S3_BACKUP_COUNT=$(aws s3 ls "$S3_BACKUP_PATH" | wc -l)
        echo -e "${GREEN}✓ Found $S3_BACKUP_COUNT S3 database backup(s)${NC}"

        # List recent backups
        echo "  Recent backups:"
        aws s3 ls "$S3_BACKUP_PATH" --recursive | tail -5 | awk '{print "    " $4}'
    else
        echo -e "${YELLOW}⚠ Cannot access S3 backups${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠ S3 not configured${NC}"
    ((WARNINGS++))
fi

echo ""

# Check 3: File storage backups
echo "3️⃣ Checking file storage backups..."
echo ""

if [ -d "./backups/files" ]; then
    FILE_BACKUP_COUNT=$(ls -1 ./backups/files/*.tar.gz 2>/dev/null | wc -l)

    if [ "$FILE_BACKUP_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓ Found $FILE_BACKUP_COUNT file backup(s)${NC}"

        LATEST_FILE_BACKUP=$(ls -t ./backups/files/*.tar.gz 2>/dev/null | head -1)
        FILE_BACKUP_AGE=$(( ($(date +%s) - $(stat -f %m "$LATEST_FILE_BACKUP" 2>/dev/null || stat -c %Y "$LATEST_FILE_BACKUP")) / 3600 ))

        echo "  Latest backup: $(basename $LATEST_FILE_BACKUP)"
        echo "  Age: ${FILE_BACKUP_AGE} hours"

        if [ "$FILE_BACKUP_AGE" -gt 48 ]; then
            echo -e "${YELLOW}⚠ Latest file backup is older than 48 hours${NC}"
            ((WARNINGS++))
        fi
    else
        echo -e "${YELLOW}⚠ No local file backups found${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠ File backup directory does not exist${NC}"
    ((WARNINGS++))
fi

echo ""

# Check 4: S3 versioning
echo "4️⃣ Checking S3 versioning..."
echo ""

if [ ! -z "$AWS_S3_BUCKET" ]; then
    VERSIONING_STATUS=$(aws s3api get-bucket-versioning --bucket "$AWS_S3_BUCKET" --query 'Status' --output text 2>/dev/null || echo "Unknown")

    if [ "$VERSIONING_STATUS" = "Enabled" ]; then
        echo -e "${GREEN}✓ S3 versioning is enabled${NC}"
    else
        echo -e "${RED}✗ S3 versioning is not enabled${NC}"
        ((ERRORS++))
    fi
fi

echo ""

# Check 5: Backup retention
echo "5️⃣ Checking backup retention..."
echo ""

# Count backups older than 30 days
OLD_BACKUPS=$(find ./backups -name "*.sql.gz" -mtime +30 2>/dev/null | wc -l)

if [ "$OLD_BACKUPS" -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found $OLD_BACKUPS backup(s) older than 30 days${NC}"
    echo "  Consider running cleanup: find ./backups -name '*.sql.gz' -mtime +30 -delete"
    ((WARNINGS++))
else
    echo -e "${GREEN}✓ Backup retention policy is being followed${NC}"
fi

echo ""

# Check 6: Test restore (optional, can be slow)
echo "6️⃣ Testing backup restore (dry run)..."
echo ""

if [ "$BACKUP_COUNT" -gt 0 ]; then
    LATEST_BACKUP=$(ls -t ./backups/database/*.sql.gz 2>/dev/null | head -1)

    # Just verify we can extract it
    TEMP_DIR=$(mktemp -d)

    if gunzip -c "$LATEST_BACKUP" > "$TEMP_DIR/test.sql" 2>/dev/null; then
        SQL_SIZE=$(du -h "$TEMP_DIR/test.sql" | cut -f1)
        echo -e "${GREEN}✓ Backup can be extracted (size: $SQL_SIZE)${NC}"

        # Check if SQL is valid
        if head -1 "$TEMP_DIR/test.sql" | grep -q "PostgreSQL"; then
            echo -e "${GREEN}✓ Backup appears to be valid PostgreSQL dump${NC}"
        else
            echo -e "${YELLOW}⚠ Backup format could not be verified${NC}"
            ((WARNINGS++))
        fi
    else
        echo -e "${RED}✗ Failed to extract backup${NC}"
        ((ERRORS++))
    fi

    rm -rf "$TEMP_DIR"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All backup verifications passed!${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Backup verification completed with $WARNINGS warning(s)${NC}"
    exit 0
else
    echo -e "${RED}❌ Backup verification failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please address the errors before relying on backups for disaster recovery."
    exit 1
fi
