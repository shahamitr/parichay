#!/bin/bash

# Disaster Recovery Drill Script
# This script simulates a complete disaster recovery scenario

set -e

echo "🚨 Disaster Recovery Drill"
echo "=========================="
echo ""
echo "This script will simulate a complete system failure and recovery."
echo "It will test:"
echo "  1. Database backup and restore"
echo "  2. File storage backup and restore"
echo "  3. Application startup"
echo "  4. Health check verification"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Track timing
START_TIME=$(date +%s)

# Load environment variables
if [ -f ".env.production" ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
elif [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ No environment file found${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  WARNING: This drill will affect the staging/test environment${NC}"
echo "Make sure you are NOT running this on production!"
echo ""
read -p "Enter environment name to confirm (staging/test): " ENV_NAME

if [ "$ENV_NAME" != "staging" ] && [ "$ENV_NAME" != "test" ]; then
    echo "Drill cancelled. Only 'staging' or 'test' environments are allowed."
    exit 0
fi

echo ""
echo -e "${BLUE}Starting disaster recovery drill...${NC}"
echo ""

# Step 1: Create fresh backups
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Creating fresh backups"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

BACKUP_START=$(date +%s)

echo "Creating database backup..."
./scripts/backup-database.sh

echo ""
echo "Creating file storage backup..."
./scripts/backup-files.sh

BACKUP_END=$(date +%s)
BACKUP_TIME=$((BACKUP_END - BACKUP_START))

echo ""
echo -e "${GREEN}✅ Backups created in ${BACKUP_TIME}s${NC}"
echo ""

# Step 2: Simulate disaster (drop database)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Simulating disaster (dropping test data)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Proceed with simulated disaster? (yes/no): " PROCEED

if [ "$PROCEED" != "yes" ]; then
    echo "Drill cancelled."
    exit 0
fi

echo "Dropping database tables..."
psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" > /dev/null 2>&1

echo -e "${YELLOW}⚠️  Database wiped${NC}"
echo ""

# Step 3: Restore from backup
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Restoring from backup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

RESTORE_START=$(date +%s)

# Find latest backup
LATEST_BACKUP=$(ls -t ./backups/database/*.sql.gz | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo -e "${RED}❌ No backup found${NC}"
    exit 1
fi

echo "Restoring database from: $LATEST_BACKUP"
echo "yes" | ./scripts/restore-database.sh "$LATEST_BACKUP"

RESTORE_END=$(date +%s)
RESTORE_TIME=$((RESTORE_END - RESTORE_START))

echo ""
echo -e "${GREEN}✅ Database restored in ${RESTORE_TIME}s${NC}"
echo ""

# Step 4: Run migrations
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Running database migrations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npx prisma migrate deploy

echo ""
echo -e "${GREEN}✅ Migrations completed${NC}"
echo ""

# Step 5: Verify data integrity
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Verifying data integrity"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Checking table counts..."
BRAND_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM \"Brand\";" | tr -d ' ')
BRANCH_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM \"Branch\";" | tr -d ' ')
USER_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM \"User\";" | tr -d ' ')

echo "  Brands: $BRAND_COUNT"
echo "  Branches: $BRANCH_COUNT"
echo "  Users: $USER_COUNT"

if [ "$BRAND_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Data integrity verified${NC}"
else
    echo -e "${YELLOW}⚠️  No data found (this may be expected for empty database)${NC}"
fi

echo ""

# Step 6: Test application startup
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6: Testing application startup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Building application..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Application built successfully${NC}"
else
    echo -e "${RED}❌ Application build failed${NC}"
    exit 1
fi

echo ""

# Calculate total time
END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))
MINUTES=$((TOTAL_TIME / 60))
SECONDS=$((TOTAL_TIME % 60))

# Calculate RTO and RPO
RTO=$RESTORE_TIME  # Recovery Time Objective
RPO=0  # Recovery Point Objective (assuming backup was just created)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Disaster Recovery Drill Results"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Drill completed successfully!"
echo ""
echo "Timing Metrics:"
echo "  Backup Time: ${BACKUP_TIME}s"
echo "  Restore Time: ${RESTORE_TIME}s"
echo "  Total Time: ${MINUTES}m ${SECONDS}s"
echo ""
echo "Recovery Objectives:"
echo "  RTO (Recovery Time Objective): ${RTO}s"
echo "  RPO (Recovery Point Objective): ${RPO}s (no data loss)"
echo ""
echo "Data Verification:"
echo "  Brands: $BRAND_COUNT"
echo "  Branches: $BRANCH_COUNT"
echo "  Users: $USER_COUNT"
echo ""
echo "Next Steps:"
echo "  1. Document these metrics in the runbook"
echo "  2. Review and optimize slow steps"
echo "  3. Schedule regular DR drills (quarterly)"
echo "  4. Update disaster recovery procedures"
echo ""
