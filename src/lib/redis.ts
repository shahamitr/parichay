import Redis from 'ioredis';
import logger from './logger';

/**
 * Redis client for caching
 */
let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  // Only initialize Redis if URL is provided
  if (!process.env.REDIS_URL) {
    logger.warn('Redis URL not configured. Caching will be disabled.');
    return null;
  }

  if (!redisClient) {
    try {
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err) => {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            return true;
          }
          return false;
        },
      });

      redisClient.on('error', (error) => {
        logger.error({ error }, 'Redis connection error');
      });

      redisClient.on('connect', () => {
        logger.info('Redis connected successfully');
      });
    } catch (error) {
      logger.error({ error }, 'Failed to initialize Redis client');
      return null;
    }
  }

  return redisClient;
}

/**
 * Export redis client for backward compatibility
 */
export const redis = getRedisClient();

/**
 * Cache key prefixes for different data types
 */
export const CacheKeys = {
  BRAND: (slug: string) => `brand:${slug}`,
  BRANCH: (brandSlug: string, branchSlug: string) => `branch:${brandSlug}:${branchSlug}`,
  MICROSITE: (brandSlug: string, branchSlug: string) => `microsite:${brandSlug}:${branchSlug}`,
  USER: (id: string) => `user:${id}`,
  SUBSCRIPTION: (id: string) => `subscription:${id}`,
};

/**
 * Default cache TTL (Time To Live) in seconds
 */
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
};
