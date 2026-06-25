/**
 * Unified cache layer — uses Redis when available, falls back to in-memory.
 * All API routes should use `withCache()` for cacheable responses.
 */

import { getRedisClient } from './redis';
import logger from './logger';

// =============================================================================
// In-memory fallback
// =============================================================================
interface CacheItem<T> {
  data: T;
  expires: number;
}

class MemoryCache {
  private store = new Map<string, CacheItem<unknown>>();

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    this.store.set(key, { data, expires: Date.now() + ttlSeconds * 1000 });
  }

  get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }
    return item.data as T;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  deletePattern(pattern: string): void {
    const prefix = pattern.replace('*', '');
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  clear(): void {
    this.store.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now > item.expires) this.store.delete(key);
    }
  }
}

const memoryCache = new MemoryCache();

// Periodic cleanup
if (typeof window === 'undefined') {
  setInterval(() => memoryCache.cleanup(), 5 * 60 * 1000);
}

// =============================================================================
// Unified cache API
// =============================================================================

/**
 * Set a value in cache (Redis first, memory fallback).
 */
export async function cacheSet<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
  // Always set in memory for fast reads
  memoryCache.set(key, data, ttlSeconds);

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(data));
    } catch (error) {
      logger.error({ error, key }, 'Redis cache set failed');
    }
  }
}

/**
 * Get a value from cache (memory first, then Redis).
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  // Check memory first (fastest)
  const memResult = memoryCache.get<T>(key);
  if (memResult !== null) return memResult;

  // Try Redis
  const redis = getRedisClient();
  if (redis) {
    try {
      const raw = await redis.get(key);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        // Backfill memory cache with remaining TTL
        const ttl = await redis.ttl(key);
        if (ttl > 0) memoryCache.set(key, parsed, ttl);
        return parsed;
      }
    } catch (error) {
      logger.error({ error, key }, 'Redis cache get failed');
    }
  }

  return null;
}

/**
 * Delete a specific cache key.
 */
export async function cacheDel(key: string): Promise<void> {
  memoryCache.delete(key);
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error({ error, key }, 'Redis cache del failed');
    }
  }
}

/**
 * Delete all keys matching a pattern (e.g. "users:*").
 */
export async function cacheDelPattern(pattern: string): Promise<void> {
  memoryCache.deletePattern(pattern);
  const redis = getRedisClient();
  if (redis) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error({ error, pattern }, 'Redis cache pattern del failed');
    }
  }
}

/**
 * Cache-through helper: returns cached data if available, otherwise
 * executes `fn`, caches the result, and returns it.
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const result = await fn();
  await cacheSet(key, result, ttlSeconds);
  return result;
}

// =============================================================================
// Legacy exports (backward compat)
// =============================================================================
export const cache = memoryCache;

export const cacheKeys = {
  heroDemo: () => 'hero-demo',
  features: () => 'landing-features',
  howItWorks: () => 'how-it-works-steps',
  successStories: () => 'success-stories',
  brandStats: () => 'brand-stats',
  userStats: () => 'api:user-stats',
  dashboardAnalytics: (userId: string) => `api:dashboard:${userId}`,
  brandsList: (userId: string) => `api:brands:${userId}`,
};
