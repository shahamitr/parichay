# Production Scripts

This directory contains scripts for production environment setup, testing, and maintenance.

## Setup Scripts

### `setup-production.sh`
Creates production environment configuration file from template.

```bash
./scripts/setup-production.sh
```

## Verification Scripts

### `verify-env.sh` / `verify-env.ps1`
Verifies all environment variables are properly configured.

**Linux/Mac:**
```bash
./scripts/verify-env.sh
# or
npm run verify:env
```

**Windows:**
```powershell
npm run verify:env:ps
```

### `verify-production.sh` / `verify-production.ps1`
Comprehensive production readiness check. Runs all verification scripts.

**Linux/Mac:**
```bash
./scripts/verify-production.sh
# or
npm run verify:production
```

**Windows:**
```powershell
npm run verify:production:ps
```

### `verify-backups.sh`
Verifies backup systems are working correctly.

```bash
./scripts/verify-backups.sh
# or
npm run verify:backups
```

## Testing Scripts

### `test-database.sh` / `test-database.ps1`
Tests database connectivity and configuration.

**Linux/Mac:**
```bash
./scripts/test-database.sh
# or
npm run test:database
```

**Windows:**
```powershell
npm run test:database:ps
```

### `test-redis.sh` / `test-redis.ps1`
Tests Redis connectivity and configuration.

**Linux/Mac:**
```bash
./scripts/test-redis.sh
# or
npm run test:redis
```

**Windows:**
```powershell
npm run test:redis:ps
```

### `test-monitoring.sh` / `test-monitoring.ps1`
Tests all monitoring integrations (Sentry, Slack, email).

**Linux/Mac:**
```bash
./scripts/test-monitoring.sh
# or
npm run test:monitoring
```

**Windows:**
```powershell
npm run test:monitoring:ps
```

### `test-email.js`
Tests email delivery configuration.

```bash
npm run test:email [recipient@email.com]
```

## Backup Scripts

### `backup-database.sh`
Creates a backup of the PostgreSQL database.

```bash
./scripts/backup-database.sh
```

### `backup-files.sh`
Creates a backup of uploaded files from S3.

```bash
./scripts/backup-files.sh
```

### `restore-database.sh`
Restores database from a backup file.

```bash
./scripts/restore-database.sh ./backups/database/backup.sql.gz
```

## Disaster Recovery

### `dr-drill.sh`
Runs a complete disaster recovery drill.

```bash
./scripts/dr-drill.sh
```

**Warning:** Only run this in staging/test environments!

## Security Scripts

### `security-audit.sh` / `security-audit.ps1`
Performs security audit of the application.

**Linux/Mac:**
```bash
./scripts/security-audit.sh
# or
npm run security:audit
```

**Windows:**
```powershell
npm run security:audit:ps
```

## Load Testing Scripts

### `load-test.js`
Simulates normal production load (100-200 concurrent users).

```bash
npm run load:test
```

### `stress-test.js`
Stress tests the system (200-1000 concurrent users).

```bash
npm run load:stress
```

### `spike-test.js`
Tests sudden traffic spikes (50 → 1000 users).

```bash
npm run load:spike
```

## Script Permissions

Make scripts executable:

```bash
chmod +x scripts/*.sh
```

## Environment Variables

Most scripts require environment variables to be set. They will automatically load from:
1. `.env.production` (if exists)
2. `.env` (fallback)

## Automation

### Cron Jobs

Set up automated backups:

```bash
# Edit crontab
crontab -e

# Add these lines:
# Database backup every 6 hours
0 */6 * * * cd /path/to/onetouch-bizcard && ./scripts/backup-database.sh

# File backup daily at 2 AM
0 2 * * * cd /path/to/onetouch-bizcard && ./scripts/backup-files.sh

# Backup verification weekly on Sunday at 3 AM
0 3 * * 0 cd /path/to/onetouch-bizcard && ./scripts/verify-backups.sh
```

### CI/CD Integration

These scripts can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Verify Production Configuration
  run: ./scripts/verify-env.sh

- name: Run Security Audit
  run: ./scripts/security-audit.sh

- name: Test Database Connection
  run: ./scripts/test-database.sh
```

## Troubleshooting

### Script Fails with "Permission Denied"

Make the script executable:
```bash
chmod +x scripts/script-name.sh
```

### Script Can't Find Environment Variables

Ensure `.env.production` or `.env` exists in the project root.

### Database/Redis Connection Fails

Check that the connection strings are correct and the services are running.

### Load Tests Fail

Ensure k6 is installed:
```bash
# macOS
brew install k6

# Linux
sudo apt-get install k6
```

## Best Practices

1. **Always test in staging first** before running scripts in production
2. **Review script output** for warnings and errors
3. **Keep backups** before running destructive operations
4. **Monitor logs** during script execution
5. **Document any issues** encountered

## Support

For issues or questions about these scripts, contact the DevOps team or refer to the documentation in `/docs`.
