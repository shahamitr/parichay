import { NextRequest } from 'next/server';
import { getRedisClient } from './redis';
import logger from './logger';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

// In-memory fallback store (used when Redis is unavailable)
const memoryStore: Record<string, { count: number; resetTime: number }> = {};

/**
 * Rate limiter with Redis backing and in-memory fallback.
 * Redis ensures limits work across multiple server instances.
 */
export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  get maxRequests() {
    return this.config.maxRequests;
  }

  /**
   * Check rate limit — tries Redis first, falls back to in-memory.
   */
  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const redis = getRedisClient();
    if (redis) {
      return this.checkLimitRedis(redis, identifier);
    }
    return this.checkLimitMemory(identifier);
  }

  /**
   * Redis-backed sliding window counter using INCR + EXPIRE.
   */
  private async checkLimitRedis(
    redis: import('ioredis').default,
    identifier: string
  ): Promise<RateLimitResult> {
    const windowSec = Math.ceil(this.config.windowMs / 1000);
    const key = `rl:${identifier}`;

    try {
      const multi = redis.multi();
      multi.incr(key);
      multi.pttl(key);
      const results = await multi.exec();

      if (!results) {
        return this.checkLimitMemory(identifier);
      }

      const count = (results[0][1] as number) || 0;
      const ttlMs = (results[1][1] as number) || -1;

      // Set expiry on first request in window
      if (ttlMs === -1 || ttlMs === -2) {
        await redis.expire(key, windowSec);
      }

      const resetTime = Date.now() + (ttlMs > 0 ? ttlMs : this.config.windowMs);
      const allowed = count <= this.config.maxRequests;

      return {
        allowed,
        remaining: Math.max(0, this.config.maxRequests - count),
        resetTime,
      };
    } catch (error) {
      logger.error({ error }, 'Redis rate limit error, falling back to memory');
      return this.checkLimitMemory(identifier);
    }
  }

  /**
   * In-memory fallback for when Redis is unavailable.
   */
  private checkLimitMemory(identifier: string): RateLimitResult {
    const now = Date.now();
    const record = memoryStore[identifier];

    // Periodic cleanup
    if (Math.random() < 0.01) this.cleanupMemory();

    if (!record || now > record.resetTime) {
      memoryStore[identifier] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: memoryStore[identifier].resetTime,
      };
    }

    record.count++;

    return {
      allowed: record.count <= this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - record.count),
      resetTime: record.resetTime,
    };
  }

  /**
   * Extract identifier from request.
   */
  getIdentifier(request: NextRequest): string {
    const userId = request.headers.get('x-user-id');
    if (userId != null) {
      return `user:${userId}`;
    }
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown';
    return `ip:${ip}`;
  }

  private cleanupMemory() {
    const now = Date.now();
    for (const key of Object.keys(memoryStore)) {
      if (memoryStore[key].resetTime < now) {
        delete memoryStore[key];
      }
    }
  }
}

// =============================================================================
// Pre-configured rate limiters
// =============================================================================
const isDev = process.env.NODE_ENV === 'development';

export const rateLimiters = {
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: isDev ? 1000 : 5,
  }),

  passwordReset: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: isDev ? 1000 : 3, // Very strict — 3 resets per 15 min
  }),

  api: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: isDev ? 1000 : 60,
  }),

  public: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: isDev ? 1000 : 100,
  }),

  payment: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: isDev ? 100 : 10,
  }),

  // Public form submissions (leads, reviews, feedback, contact)
  formSubmission: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: isDev ? 100 : 5, // 5 submissions per minute per IP
  }),
};

// =============================================================================
// Apply rate limiting helper (used by proxy.ts)
// =============================================================================
export async function applyRateLimit(
  request: NextRequest,
  limiter: RateLimiter
): Promise<{ allowed: boolean; headers: Record<string, string> }> {
  const identifier = limiter.getIdentifier(request);
  const result = await limiter.checkLimit(identifier);

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': limiter.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };

  if (!result.allowed) {
    headers['Retry-After'] = Math.ceil((result.resetTime - Date.now()) / 1000).toString();
  }

  return { allowed: result.allowed, headers };
}
