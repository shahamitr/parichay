# Redis Setup - Quick Reference

## AWS ElastiCache Redis (Recommended)

### 1. Create ElastiCache Cluster via AWS Console

1. Go to ElastiCache Console
2. Click "Create" → "Redis cluster"
3. Cluster mode: Disabled (for simplicity) or Enabled (for scaling)
4. Cluster name: `onetouch-bizcard-redis`
5. Engine version: Redis 7.0+
6. Port: 6379
7. Node type: cache.t3.medium (or higher)
8. Number of replicas: 1-2 (for high availability)
9. Multi-AZ: Enabled
10. Subnet group: Select production subnet group
11. Security groups: Select or create security group
12. Encryption at rest: Enabled
13. Encryption in transit: Enabled
14. Auth token: Enable and generate strong token
15. Backup retention: 7 days
16. Backup window: 03:00-05:00 UTC
17. Maintenance window: Sunday 05:00-07:00 UTC

### 2. Configure Security Group

```bash
# Allow Redis access from application servers
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 6379 \
  --source-group sg-app-servers
```

### 3. Get Connection Details

```bash
# Get cluster endpoint
aws elasticache describe-cache-clusters \
  --cache-cluster-id onetouch-bizcard-redis \
  --show-cache-node-info
```

### 4. Connection String Format

```env
# With TLS and authentication
REDIS_URL="rediss://:AUTH_TOKEN@onetouch-bizcard-redis.xxxxxx.cache.amazonaws.com:6379"
REDIS_TLS_ENABLED="true"

# Without TLS (not recommended for production)
REDIS_URL="redis://:AUTH_TOKEN@onetouch-bizcard-redis.xxxxxx.cache.amazonaws.com:6379"
```

### 5. Test Connection

```bash
# Install redis-cli
sudo apt-get install redis-tools

# Test connection with TLS
redis-cli -h onetouch-bizcard-redis.xxxxxx.cache.amazonaws.com -p 6379 --tls -a AUTH_TOKEN ping

# Test connection without TLS
redis-cli -h onetouch-bizcard-redis.xxxxxx.cache.amazonaws.com -p 6379 -a AUTH_TOKEN ping
```

## Redis Cloud

### 1. Create Redis Cloud Database

1. Go to https://redis.com/try-free/
2. Sign up or log in
3. Create new subscription
4. Choose cloud provider and region
5. Select plan (minimum 1GB for production)
6. Database name: `onetouch-bizcard-prod`
7. Enable TLS
8. Set password
9. Configure eviction policy: allkeys-lru

### 2. Get Connection Details

1. Go to database → Configuration
2. Copy endpoint and port
3. Copy password

### 3. Connection String Format

```env
REDIS_URL="rediss://:PASSWORD@redis-xxxxx.c1.us-east-1-2.ec2.cloud.redislabs.com:xxxxx"
REDIS_TLS_ENABLED="true"
```

## DigitalOcean Managed Redis

### 1. Create Redis Cluster

1. Go to Databases → Create Database Cluster
2. Choose Redis 7
3. Plan: Production (1GB RAM minimum)
4. Datacenter: Choose closest to application
5. Enable automatic backups
6. Add trusted sources (application server IPs)

### 2. Get Connection Details

1. Go to database cluster → Connection Details
2. Copy connection string
3. Download CA certificate if using TLS

### 3. Connection String Format

```env
REDIS_URL="rediss://default:PASSWORD@db-redis-nyc3-xxxxx.ondigitalocean.com:25061"
REDIS_TLS_ENABLED="true"
```

## Redis Configuration

### Recommended Production Settings

```conf
# Memory Management
maxmemory 2gb
maxmemory-policy allkeys-lru

# Persistence (RDB)
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb

# Persistence (AOF)
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# Security
requirepass YOUR_STRONG_PASSWORD
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""

# Performance
tcp-backlog 511
timeout 300
tcp-keepalive 300
maxclients 10000

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log
```

### Apply Configuration (Self-Hosted)

```bash
# Edit redis.conf
sudo nano /etc/redis/redis.conf

# Restart Redis
sudo systemctl restart redis-server

# Verify configuration
redis-cli CONFIG GET maxmemory
redis-cli CONFIG GET maxmemory-policy
```

## Caching Strategy

### Cache Keys Structure

```
brand:{brandId}
branch:{branchId}
microsite:{brandSlug}:{branchSlug}
user:{userId}
subscription:{subscriptionId}
analytics:{micrositeId}:{date}
qrcode:{branchId}
```

### Cache TTL (Time To Live)

```javascript
// Cache durations
const CACHE_TTL = {
  BRAND: 3600,           // 1 hour
  BRANCH: 3600,          // 1 hour
  MICROSITE: 1800,       // 30 minutes
  USER: 1800,            // 30 minutes
  SUBSCRIPTION: 3600,    // 1 hour
  ANALYTICS: 300,        // 5 minutes
  QRCODE: 86400,         // 24 hours
  SESSION: 3600,         // 1 hour
};
```

### Example Caching Implementation

```javascript
// lib/redis.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!, {
  tls: process.env.REDIS_TLS_ENABLED === 'true' ? {} : undefined,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Try to get from cache
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export default redis;
```

## Monitoring

### Check Redis Health

```bash
# Connect to Redis
redis-cli -h HOST -p PORT -a PASSWORD

# Check server info
INFO

# Check memory usage
INFO memory

# Check connected clients
INFO clients

# Check stats
INFO stats

# Check keyspace
INFO keyspace

# Monitor commands in real-time
MONITOR

# Check slow log
SLOWLOG GET 10
```

### Key Metrics to Monitor

```bash
# Memory usage
INFO memory | grep used_memory_human

# Hit rate
INFO stats | grep keyspace

# Connected clients
INFO clients | grep connected_clients

# Operations per second
INFO stats | grep instantaneous_ops_per_sec

# Evicted keys
INFO stats | grep evicted_keys

# Expired keys
INFO stats | grep expired_keys
```

### Redis CLI Commands

```bash
# Get all keys (use with caution in production)
KEYS *

# Get keys matching pattern
KEYS brand:*

# Get key value
GET brand:123

# Set key value
SET brand:123 '{"name":"Example"}'

# Set key with expiration
SETEX brand:123 3600 '{"name":"Example"}'

# Delete key
DEL brand:123

# Check if key exists
EXISTS brand:123

# Get TTL
TTL brand:123

# Get key type
TYPE brand:123

# Flush database (DANGEROUS - use only in development)
FLUSHDB

# Get database size
DBSIZE
```

## Backup and Restore

### Manual Backup (RDB)

```bash
# Trigger background save
redis-cli -h HOST -p PORT -a PASSWORD BGSAVE

# Check save status
redis-cli -h HOST -p PORT -a PASSWORD LASTSAVE

# Copy dump file
cp /var/lib/redis/dump.rdb /backup/redis-backup-$(date +%Y%m%d).rdb

# Upload to S3
aws s3 cp /backup/redis-backup-$(date +%Y%m%d).rdb s3://onetouch-bizcard-backups/redis/
```

### Restore from Backup

```bash
# Stop Redis
sudo systemctl stop redis-server

# Replace dump file
sudo cp /backup/redis-backup-20240101.rdb /var/lib/redis/dump.rdb
sudo chown redis:redis /var/lib/redis/dump.rdb

# Start Redis
sudo systemctl start redis-server

# Verify data
redis-cli -a PASSWORD DBSIZE
```

### Automated Backup Script

```bash
#!/bin/bash
# Save as /usr/local/bin/backup-redis.sh

BACKUP_DIR="/var/backups/redis"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d_%H%M%S)

# Trigger background save
redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD BGSAVE

# Wait for save to complete
sleep 10

# Copy dump file
cp /var/lib/redis/dump.rdb "$BACKUP_DIR/redis-backup-$DATE.rdb"

# Compress backup
gzip "$BACKUP_DIR/redis-backup-$DATE.rdb"

# Upload to S3
aws s3 cp "$BACKUP_DIR/redis-backup-$DATE.rdb.gz" s3://onetouch-bizcard-backups/redis/

# Remove old backups
find $BACKUP_DIR -name "redis-backup-*.rdb.gz" -mtime +$RETENTION_DAYS -delete

echo "Redis backup completed: redis-backup-$DATE.rdb.gz"
```

## Performance Optimization

### Connection Pooling

```javascript
// lib/redis.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: true,
  connectTimeout: 10000,
  lazyConnect: false,
  keepAlive: 30000,
});

// Handle connection events
redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

redis.on('close', () => {
  console.log('Redis connection closed');
});

export default redis;
```

### Pipeline Operations

```javascript
// Batch multiple operations
const pipeline = redis.pipeline();
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.set('key3', 'value3');
await pipeline.exec();
```

### Lua Scripts for Atomic Operations

```javascript
// Atomic increment with max value
const script = `
  local current = redis.call('GET', KEYS[1])
  if not current then
    current = 0
  end
  if tonumber(current) < tonumber(ARGV[1]) then
    return redis.call('INCR', KEYS[1])
  else
    return current
  end
`;

const result = await redis.eval(script, 1, 'counter:key', 100);
```

## Troubleshooting

### Connection Issues

```bash
# Test connectivity
redis-cli -h HOST -p PORT ping

# Test with authentication
redis-cli -h HOST -p PORT -a PASSWORD ping

# Test TLS connection
redis-cli -h HOST -p PORT --tls -a PASSWORD ping

# Check if Redis is running
sudo systemctl status redis-server

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

### Memory Issues

```bash
# Check memory usage
redis-cli INFO memory

# Check largest keys
redis-cli --bigkeys

# Analyze memory usage by key pattern
redis-cli --memkeys

# Clear specific keys
redis-cli DEL key1 key2 key3

# Set maxmemory policy
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

### Performance Issues

```bash
# Check slow queries
redis-cli SLOWLOG GET 10

# Monitor commands
redis-cli MONITOR

# Check latency
redis-cli --latency

# Check latency history
redis-cli --latency-history

# Benchmark performance
redis-benchmark -h HOST -p PORT -a PASSWORD -c 50 -n 10000
```

## Security Best Practices

1. **Enable authentication**: Always use `requirepass` in production
2. **Use TLS**: Enable encryption in transit
3. **Restrict access**: Use security groups/firewall rules
4. **Disable dangerous commands**: Rename FLUSHDB, FLUSHALL, CONFIG
5. **Regular updates**: Keep Redis version up to date
6. **Monitor access**: Review connection logs
7. **Use strong passwords**: Minimum 32 characters
8. **Limit connections**: Set maxclients appropriately

## Quick Commands Reference

```bash
# Connection
redis-cli -h HOST -p PORT -a PASSWORD

# Basic operations
SET key value
GET key
DEL key
EXISTS key
EXPIRE key seconds
TTL key

# Hash operations
HSET hash field value
HGET hash field
HGETALL hash
HDEL hash field

# List operations
LPUSH list value
RPUSH list value
LRANGE list 0 -1
LPOP list
RPOP list

# Set operations
SADD set member
SMEMBERS set
SISMEMBER set member
SREM set member

# Sorted set operations
ZADD sortedset score member
ZRANGE sortedset 0 -1
ZREM sortedset member

# Server commands
INFO
DBSIZE
FLUSHDB
SAVE
BGSAVE
```
