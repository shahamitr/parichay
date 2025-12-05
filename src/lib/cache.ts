import { getRedisClient, CacheTTL, CacheKeys } from './redis';
import logger from './logger';

// Re-export for convenience
export { CacheTTL, CacheKeys };

/**
 * Cache utility with fallback to in-memory cache if Redis is unavailable
 */

// In-memory cache fallback
const memoryCache = new Map<string, { value: any; expiry: number }>();

/**
 * Get value from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();

  if (redis != null) {
    try {
      const value = await redis.get(key);
      if (value != null) {
        return JSON.parse(value) as T;
      }
    } catch (error) {
      logger.error({ error, key }, 'Redis get error');
    }
  }

  // Fallback to memory cache
  const cached = memoryCache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.value as T;
  }

  return null;
}

/**
 * Set value in cache
 */
export async function setCache(key: string, value: any, ttl: number = CacheTTL.MEDIUM): Promise<void> {
  const redis = getRedisClient();

  if (redis != null) {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return;
    } catch (error) {
      logger.error({ error, key }, 'Redis set error');
    }
  }

  // Fallback to memory cache
  memoryCache.set(key, {
    value,
    expiry: Date.now() + ttl * 1000,
  });
}

/**
 * Delete value from cache
 */
export async function deleteCache(key: string): Promise<void> {
  const redis = getRedisClient();

  if (redis != null) {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error({ error, key }, 'Redis delete error');
    }
  }

  // Also delete from memory cache
  memoryCache.delete(key);
}

/**
 * Delete multiple keys matching a pattern
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  const redis = getRedisClient();

  if (redis != null) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error({ error, pattern }, 'Redis delete pattern error');
    }
  }

  // For memory cache, delete matching keys
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern.replace('*', ''))) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Cache wrapper for functions
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = CacheTTL.MEDIUM
): Promise<T> {
  // Try to get from cache
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute function and cache result
  const result = await fn();
  await setCache(key, result, ttl);
  return result;
}
