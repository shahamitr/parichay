#!/bin/bash

# Backup Verification Script for OneTouch BizCard
# This script automates backup testing and validation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/onetouch-bizcard}"
S3_BUCKET="${AWS_S3_BACKUP_BUCKET:-onetouch-bizcard-backups}"
STAGING_DB_URL="${STAGING_DATABASE_URL}"
TEST_RESULTS_FILE="/tmp/backup_verification_$(date +%Y%m%d_%H%M%S).log"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" | tee -a "$TEST_RESULTS_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$TEST_RESULTS_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$TEST_RESULTS_FILE"
}

test_passed() {
    ((TESTS_PASSED++))
    ((TOTAL_TESTS++))
    log_info "✅ Test passed: $1"
}

test_failed() {
    ((TESTS_FAILED++))
    ((TOTAL_TESTS++))
    log_error "❌ Test failed: $1"
}

# Test functions
test_backup_directory() {
    log_info "Test 1: Checking backup directory..."
    if [ -d "$BACKUP_DIR" ]; then
        test_passed "Backup directory exists"
    else
        test_failed "Backup directory does not exist: $BACKUP_DIR"
    fi
}

test_backup_script_exists() {
    log_info "Test 2: Checking backup scripts..."
    if [ -f "./backup-database.sh" ] && [ -x "./backup-database.sh" ]; then
        test_passed "Database backup script exists and is executable"
    else
        test_failed "Database backup script missing or not executable"
    fi

    if [ -f "./backup-files.sh" ] && [ -x "./backup-files.sh" ]; then
        test_passed "File backup script exists and is executable"
    else
        test_failed "File backup script missing or not executable"
    fi
}

test_aws_cli() {
    log_info "Test 3: Checking AWS CLI..."
    if command -v aws &> /dev/null; then
        test_passed "AWS CLI is installed"

        # Test AWS credentials
        if aws sts get-caller-identity &> /dev/null; then
            test_passed "AWS credentials are configured"
        else
            test_failed "AWS credentials are not configured"
        fi
    else
        test_failed "AWS CLI is not installed"
    fi
}

test_postgresql_client() {
    log_info "Test 4: Checking PostgreSQL client..."
    if command -v psql &> /dev/null && command -v pg_dump &> /dev/null; then
        test_passed "PostgreSQL client tools are installed"
    else
        test_failed "PostgreSQL client tools are not installed"
    fi
}

test_database_connection() {
    log_info "Test 5: Testing database connection..."
    if [ -z "$DATABASE_URL" ]; then
        test_failed "DATABASE_URL environment variable not set"
        return
    fi

    if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
        test_passed "Database connection successful"
    else
        test_failed "Cannot connect to database"
    fi
}

test_s3_bucket_access() {
    log_info "Test 6: Testing S3 bucket access..."
    if aws s3 ls "s3://$S3_BUCKET/" &> /dev/null; then
        test_passed "S3 backup bucket is accessible"
    else
        test_failed "Cannot access S3 backup bucket: $S3_BUCKET"
    fi
}

test_create_backup() {
    log_info "Test 7: Creating test backup..."

    # Run backup script
    if ./backup-database.sh &> /tmp/backup_test.log; then
        test_passed "Backup script executed successfully"

        # Check if backup file was created
        LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/onetouch_bizcard_backup_*.sql.gz 2>/dev/null | head -1)
        if [ -n "$LATEST_BACKUP" ]; then
            test_passed "Backup file created: $(basename $LATEST_BACKUP)"

            # Check backup file integrity
            if gunzip -t "$LATEST_BACKUP" &> /dev/null; then
                test_passed "Backup file integrity verified"
            else
                test_failed "Backup file is corrupted"
            fi

            # Check backup file size
            BACKUP_SIZE=$(stat -f%z "$LATEST_BACKUP" 2>/dev/null || stat -c%s "$LATEST_BACKUP" 2>/dev/null)
            if [ "$BACKUP_SIZE" -gt 1024 ]; then
                test_passed "Backup file size is reasonable: $(numfmt --to=iec $BACKUP_SIZE 2>/dev/null || echo $BACKUP_SIZE bytes)"
            else
                test_failed "Backup file is too small: $BACKUP_SIZE bytes"
            fi
        else
            test_failed "No backup file was created"
        fi
    else
        test_failed "Backup script execution failed"
        cat /tmp/backup_test.log | tee -a "$TEST_RESULTS_FILE"
    fi
}

test_s3_upload() {
    log_info "Test 8: Verifying S3 upload..."

    # Get latest backup from S3
    LATEST_S3_BACKUP=$(aws s3 ls "s3://$S3_BUCKET/database/" | sort | tail -1 | awk '{print $4}')

    if [ -n "$LATEST_S3_BACKUP" ]; then
        test_passed "Backup found in S3: $LATEST_S3_BACKUP"

        # Check S3 backup age (should be recent)
        BACKUP_DATE=$(echo "$LATEST_S3_BACKUP" | grep -oP '\d{8}_\d{6}' | head -1)
        if [ -n "$BACKUP_DATE" ]; then
            BACKUP_TIMESTAMP=$(date -d "${BACKUP_DATE:0:8} ${BACKUP_DA}:${BACKUP_DATE:11:2}:${BACKUP_DATE:13:2}" +%s 2>/dev/null || echo 0)
            CURRENT_TIMESTAMP=$(date +%s)
            AGE_MINUTES=$(( (CURRENT_TIMESTAMP - BACKUP_TIMESTAMP) / 60 ))

            if [ "$AGE_MINUTES" -lt 60 ]; then
                test_passed "S3 backup is recent (${AGE_MINUTES} minutes old)"
            else
                test_warning "S3 backup is old (${AGE_MINUTES} minutes old)"
            fi
        fi
    else
        test_failed "No backups found in S3"
    fi
}

test_restore_staging() {
    log_info "Test 9: Testing backup restoration to staging..."

    if [ -z "$STAGING_DB_URL" ]; then
        log_warning "STAGING_DATABASE_URL not set, skipping restore test"
        return
    fi

    # Get latest backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/onetouch_bizcard_backup_*.sql.gz 2>/dev/null | head -1)

    if [ -z "$LATEST_BACKUP" ]; then
        test_failed "No backup file found for restore test"
        return
    fi

    log_info "Restoring to staging database..."

    # Record pre-restore state
    BRANDS_BEFORE=$(psql "$STAGING_DB_URL" -t -c "SELECT COUNT(*) FROM brands;" 2>/dev/null || echo "0")

    # Restore backup
    if gunzip -c "$LATEST_BACKUP" | psql "$STAGING_DB_URL" &> /tmp/restore_test.log; then
        test_passed "Backup restored to staging successfully"

        # Verify data
        BRANDS_AFTER=$(psql "$STAGING_DB_URL" -t -c "SELECT COUNT(*) FROM brands;" 2>/dev/null || echo "0")

        if [ "$BRANDS_AFTER" -gt 0 ]; then
            test_passed "Data verified in staging database (${BRANDS_AFTER} brands)"
        else
            test_failed "No data found in staging database after restore"
        fi
    else
        test_failed "Backup restoration to staging failed"
        cat /tmp/restore_test.log | tee -a "$TEST_RESULTS_FILE"
    fi
}

test_retention_policy() {
    log_info "Test 10: Checking backup retention..."

    # Count backups
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/onetouch_bizcard_backup_*.sql.gz 2>/dev/null | wc -l)

    if [ "$BACKUP_COUNT" -gt 0 ]; then
        test_passed "Found $BACKUP_COUNT backup(s) in local directory"

        # Check for old backups (older than retention period)
        RETENTION_DAYS="${RETENTION_DAYS:-30}"
        OLD_BACKUPS=$(find "$BACKUP_DIR" -name "onetouch_bizcard_backup_*.sql.gz" -mtime +$RETENTION_DAYS 2>/dev/null | wc -l)

        if [ "$OLD_BACKUPS" -eq 0 ]; then
            test_passed "No backups older than retention period ($RETENTION_DAYS days)"
        else
            test_warning "Found $OLD_BACKUPS backup(s) older than retention period"
        fi
    else
        test_warning "No backups found in local directory"
    fi
}

# Generate report
generate_report() {
    echo "" | tee -a "$TEST_RESULTS_FILE"
    echo "========================================" | tee -a "$TEST_RESULTS_FILE"
    echo "Backup Verification Report" | tee -a "$TEST_RESULTS_FILE"
    echo "========================================" | tee -a "$TEST_RESULTS_FILE"
    echo "Date: $(date)" | tee -a "$TEST_RESULTS_FILE"
    echo "Total Tests: $TOTAL_TESTS" | tee -a "$TEST_RESULTS_FILE"
    echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}" | tee -a "$TEST_RESULTS_FILE"
    echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}" | tee -a "$TEST_RESULTS_FILE"
    echo "" | tee -a "$TEST_RESULTS_FILE"

    if [ "$TESTS_FAILED" -eq 0 ]; then
        echo -e "${GREEN}✅ All tests passed!${NC}" | tee -a "$TEST_RESULTS_FILE"
        echo "Backup system is ready for production." | tee -a "$TEST_RESULTS_FILE"
    else
        echo -e "${RED}❌ Some tests failed!${NC}" | tee -a "$TEST_RESULTS_FILE"
        echo "Please review the failures before deploying to production." | tee -a "$TEST_RESULTS_FILE"
    fi

    echo "" | tee -a "$TEST_RESULTS_FILE"
    echo "Full test results saved to: $TEST_RESULTS_FILE" | tee -a "$TEST_RESULTS_FILE"
}

# Main execution
main() {
    echo "========================================" | tee "$TEST_RESULTS_FILE"
    echo "OneTouch BizCard Backup Verification" | tee -a "$TEST_RESULTS_FILE"
    echo "========================================" | tee -a "$TEST_RESULTS_FILE"
    echo "" | tee -a "$TEST_RESULTS_FILE"

    # Run all tests
    test_backup_directory
    test_backup_script_exists
    test_aws_cli
    test_postgresql_client
    test_database_connection
    test_s3_bucket_access
    test_create_backup
    test_s3_upload
    test_restore_staging
    test_retention_policy

    # Generate report
    generate_rep
    # Exit with appropriate code
    if [ "$TESTS_FAILED" -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Run main function
main
