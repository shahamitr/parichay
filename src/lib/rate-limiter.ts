import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore: RateLimitStore = {};

/**
 * Simple in-memory rate limiter
 * For production, use Redis or a dedicated rate limiting service
 */
export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if request should be rate limited
   */
  async checkLimit(identifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const now = Date.now();
    const record = rateLimitStore[identifier];

    // Clean up expired records periodically
    this.cleanup();

    if (!record || now > record.resetTime) {
      // Create new record
      rateLimitStore[identifier] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: rateLimitStore[identifier].resetTime,
      };
    }

    // Increment count
    record.count++;

    if (record.count > this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
      };
    }

    return {
      allowed: true,
      remaining: this.config.maxRequests - record.count,
      resetTime: record.resetTime,
    };
  }

  /**
   * Get identifier from request (IP address or user ID)
   */
  getIdentifier(request: NextRequest): string {
    // Try to get user ID from headers (set by auth middleware)
    const userId = request.headers.get('x-user-id');
    if (userId != null) {
      return `user:${userId}`;
    }

    // Fall back to IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
    return `ip:${ip}`;
  }

  /**
   * Clean up expired records
   */
  private cleanup() {
    const now = Date.now();
    Object.keys(rateLimitStore).forEach(key => {
      if (rateLimitStore[key].resetTime < now) {
        delete rateLimitStore[key];
      }
    });
  }
}

/**
 * Rate limiter configurations for different endpoints
 */
export const rateLimiters = {
  // Strict rate limit for authentication endpoints
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: process.env.NODE_ENV === 'development' ? 1000 : 5, // Very lenient in dev
  }),

  // Moderate rate limit for API endpoints
  api: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: process.env.NODE_ENV === 'development' ? 1000 : 60, // Very lenient in dev
  }),

  // Lenient rate limit for public endpoints
  public: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: process.env.NODE_ENV === 'development' ? 1000 : 100, // Very lenient in dev
  }),

  // Strict rate limit for payment endpoints
  payment: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: process.env.NODE_ENV === 'development' ? 100 : 10, // More lenient in dev
  }),
};

/**
 * Apply rate limiting to a request
 */
export async function applyRateLimit(
  request: NextRequest,
  limiter: RateLimiter
): Promise<{ allowed: boolean; headers: Record<string, string> }> {
  const identifier = limiter.getIdentifier(request);
  const result = await limiter.checkLimit(identifier);

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': limiter['config'].maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };

  if (!result.allowed) {
    headers['Retry-After'] = Math.ceil((result.resetTime - Date.now()) / 1000).toString();
  }

  return {
    allowed: result.allowed,
    headers,
  };
}
