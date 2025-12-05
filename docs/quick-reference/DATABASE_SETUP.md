# PostgreSQL Database Setup - Quick Reference

## AWS RDS Setup (Recommended)

### 1. Create RDS Instance via AWS Console

1. Go to AWS RDS Console
2. Click "Create database"
3. Choose "Standard create"
4. Engine: PostgreSQL 15.4+
5. Templates: Production
6. DB instance identifier: `onetouch-bizcard-prod`
7. Master username: `admin`
8. Master password: Generate strong password (save securely)
9. DB instance class: `db.t3.medium` (or higher)
10. Storage: 100 GB, gp3, enable storage autoscaling
11. Enable storage encryption
12. Multi-AZ: Yes
13. VPC: Select production VPC
14. Public access: No
15. VPC security group: Create new or select existing
16. Database authentication: Password authentication
17. Initial database name: `onetouch_bizcard_prod`
18. Backup retention: 30 days
19. Backup window: 03:00-04:00 UTC
20. Enable automatic minor version upgrade
21. Maintenance window: Sunday 04:00-05:00 UTC
22. Enable deletion protection

### 2. Configure Security Group

```bash
# Allow PostgreSQL access from application servers
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 5432 \
  --source-group sg-app-servers
```

### 3. Download SSL Certificate

```bash
# Download RDS CA certificate
wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
mv global-bundle.pem /etc/ssl/certs/rds-ca-cert.pem
```

### 4. Construct Connection String

```env
DATABASE_URL="postgresql://admin:PASSWORD@onetouch-bizcard-prod.xxxxxxxxx.ap-south-1.rds.amazonaws.com:5432/onetouch_bizcard_prod?connection_limit=50&pool_timeout=30&sslmode=require&sslrootcert=/etc/ssl/certs/rds-ca-cert.pem"
```

### 5. Test Connection

```bash
psql "postgresql://admin:PASSWORD@onetouch-bizcard-prod.xxxxxxxxx.ap-south-1.rds.amazonaws.com:5432/onetouch_bizcard_prod?sslmode=require"
```

## DigitalOcean Managed Database

### 1. Create Database via DigitalOcean Console

1. Go to Databases → Create Database Cluster
2. Choose PostgreSQL 15
3. Plan: Production (4GB RAM minimum)
4. Datacenter: Choose closest to your application
5. Database name: `onetouch_bizcard_prod`
6. Enable automatic backups
7. Add trusted sources (application server IPs)

### 2. Get Connection Details

1. Go to database cluster → Connection Details
2. Copy connection string
3. Download CA certificate

### 3. Connection String Format

```env
DATABASE_URL="postgresql://doadmin:PASSWORD@db-postgresql-nyc3-xxxxx.ondigitalocean.com:25060/onetouch_bizcard_prod?sslmode=require&connection_limit=50&pool_timeout=30"
```

## Performance Optimization

### Create Indexes

```sql
-- Connect to database
psql $DATABASE_URL

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_brands_slug ON "Brand"(slug);
CREATE INDEX IF NOT EXISTS idx_branches_slug ON "Branch"(slug);
CREATE INDEX IF NOT EXISTS idx_branches_brand_id ON "Branch"("brandId");
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_brand_id ON "Subscription"("brandId");
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON "Subscription"(status);
CREATE INDEX IF NOT EXISTS idx_analytics_microsite_id ON "AnalyticsEvent"("micrositeId");
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON "AnalyticsEvent"(timestamp);
CREATE INDEX IF NOT EXISTS idx_leads_branch_id ON "Lead"("branchId");
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON "Lead"("createdAt");

-- Enable query statistics
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### Configure Connection Pooling

```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity;

-- View connection pool settings
SHOW max_connections;
SHOW shared_buffers;

-- Recommended settings for production
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET min_wal_size = '1GB';
ALTER SYSTEM SET max_wal_size = '4GB';
```

## Backup and Restore

### Manual Backup

```bash
# Full database backup
pg_dump -h HOST -U USER -d DATABASE -F c -f backup_$(date +%Y%m%d).dump

# Backup with compression
pg_dump -h HOST -U USER -d DATABASE -F c -Z 9 -f backup_$(date +%Y%m%d).dump.gz

# Backup specific tables
pg_dump -h HOST -U USER -d DATABASE -t "Brand" -t "Branch" -F c -f backup_brands_$(date +%Y%m%d).dump
```

### Restore from Backup

```bash
# Restore full database
pg_restore -h HOST -U USER -d DATABASE -c backup_20240101.dump

# Restore specific tables
pg_restore -h HOST -U USER -d DATABASE -t "Brand" backup_20240101.dump
```

### Automated Backup Script

```bash
#!/bin/bash
# Save as /usr/local/bin/backup-database.sh

BACKUP_DIR="/var/backups/postgresql"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_dump $DATABASE_URL -F c -f "$BACKUP_DIR/backup_$DATE.dump"

# Compress backup
gzip "$BACKUP_DIR/backup_$DATE.dump"

# Upload to S3
aws s3 cp "$BACKUP_DIR/backup_$DATE.dump.gz" s3://onetouch-bizcard-backups/database/

# Remove old backups
find $BACKUP_DIR -name "backup_*.dump.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: backup_$DATE.dump.gz"
```

## Monitoring

### Check Database Health

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('onetouch_bizcard_prod'));

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check active connections
SELECT
  datname,
  count(*) as connections
FROM pg_stat_activity
GROUP BY datname;

-- Check slow queries
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

## Troubleshooting

### Connection Issues

```bash
# Test basic connectivity
nc -zv HOST 5432

# Test SSL connection
openssl s_client -connect HOST:5432 -starttls postgres

# Check DNS resolution
nslookup HOST

# Verify credentials
psql "postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
```

### Performance Issues

```sql
-- Find blocking queries
SELECT
  blocked_locks.pid AS blocked_pid,
  blocked_activity.usename AS blocked_user,
  blocking_locks.pid AS blocking_pid,
  blocking_activity.usename AS blocking_user,
  blocked_activity.query AS blocked_statement,
  blocking_activity.query AS blocking_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;

-- Kill blocking query
SELECT pg_terminate_backend(PID);
```

## Security Best Practices

1. **Use strong passwords**: Minimum 20 characters, mixed case, numbers, symbols
2. **Enable SSL**: Always use `sslmode=require` in production
3. **Restrict access**: Use VPC security groups to limit database access
4. **Regular updates**: Keep PostgreSQL version up to date
5. **Audit logging**: Enable logging for security events
6. **Least privilege**: Grant minimal required permissions to application user
7. **Rotate credentials**: Change passwords regularly
8. **Monitor access**: Review connection logs regularly

## Quick Commands

```bash
# Connect to database
psql $DATABASE_URL

# List databases
\l

# List tables
\dt

# Describe table
\d "Brand"

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# View migration status
npx prisma migrate status

# Create migration
npx prisma migrate dev --name migration_name
```
