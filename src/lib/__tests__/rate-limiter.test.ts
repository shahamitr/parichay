import { NextRequest } from 'next/server';
import { RateLimiter, rateLimiters, applyRateLimit } from '../rate-limiter';

describe('Rate Limiter', () => {
  describe('RateLimiter class', () => {
    it('should allow requests within limit', async () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 5,
      });

      const result1 = await limiter.checkLimit('test-user');
      const result2 = await limiter.checkLimit('test-user');

      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(4);
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(3);
    });

    it('should block requests exceeding limit', async () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 3,
      });

      await limiter.checkLimit('test-user-2');
      await limiter.checkLimit('test-user-2');
      await limiter.checkLimit('test-user-2');
      const result = await limiter.checkLimit('test-user-2');

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset count after time window', async () => {
      const limiter = new RateLimiter({
        windowMs: 100, // 100ms window
        maxRequests: 2,
      });

      await limiter.checkLimit('test-user-3');
      await limiter.checkLimit('test-user-3');
      const blocked = await limiter.checkLimit('test-user-3');

      expect(blocked.allowed).toBe(false);

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      const allowed = await limiter.checkLimit('test-user-3');
      expect(allowed.allowed).toBe(true);
      expect(allowed.remaining).toBe(1);
    });

    it('should handle multiple identifiers independently', async () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 2,
      });

      await limiter.checkLimit('user-a');
      await limiter.checkLimit('user-a');
      const userABlocked = await limiter.checkLimit('user-a');

      const userBAllowed = await limiter.checkLimit('user-b');

      expect(userABlocked.allowed).toBe(false);
      expect(userBAllowed.allowed).toBe(true);
    });

    it('should extract identifier from request headers', () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 10,
      });

      const requestWithUserId = new NextRequest('http://localhost/api/test', {
        headers: {
          'x-user-id': 'user-123',
        },
      });

      const identifier = limiter.getIdentifier(requestWithUserId);
      expect(identifier).toBe('user:user-123');
    });

    it('should use IP address when user ID is not available', () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 10,
      });

      const requestWithIP = new NextRequest('http://localhost/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
      });

      const identifier = limiter.getIdentifier(requestWithIP);
      expect(identifier).toBe('ip:192.168.1.1');
    });
  });

  describe('Rate limiter configurations', () => {
    it('should have auth rate limiter with strict limits', () => {
      expect(rateLimiters.auth).toBeDefined();
      expect(rateLimiters.auth['config'].maxRequests).toBe(5);
      expect(rateLimiters.auth['config'].windowMs).toBe(15 * 60 * 1000);
    });

    it('should have API rate limiter with moderate limits', () => {
      expect(rateLimiters.api).toBeDefined();
      expect(rateLimiters.api['config'].maxRequests).toBe(60);
      expect(rateLimiters.api['config'].windowMs).toBe(60 * 1000);
    });

    it('should have public rate limiter with lenient limits', () => {
      expect(rateLimiters.public).toBeDefined();
      expect(rateLimiters.public['config'].maxRequests).toBe(100);
      expect(rateLimiters.public['config'].windowMs).toBe(60 * 1000);
    });

    it('should have payment rate limiter with strict limits', () => {
      expect(rateLimiters.payment).toBeDefined();
      expect(rateLimiters.payment['config'].maxRequests).toBe(10);
      expect(rateLimiters.payment['config'].windowMs).toBe(60 * 1000);
    });
  });

  describe('applyRateLimit', () => {
    it('should return rate limit headers when allowed', async () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 10,
      });

      const request = new NextRequest('http://localhost/api/test', {
        headers: {
          'x-user-id': 'test-user-4',
        },
      });

      const result = await applyRateLimit(request, limiter);

      expect(result.allowed).toBe(true);
      expect(result.headers['X-RateLimit-Limit']).toBe('10');
      expect(result.headers['X-RateLimit-Remaining']).toBe('9');
      expect(result.headers['X-RateLimit-Reset']).toBeDefined();
    });

    it('should include Retry-After header when blocked', async () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 1,
      });

      const request = new NextRequest('http://localhost/api/test', {
        headers: {
          'x-user-id': 'test-user-5',
        },
      });

      await applyRateLimit(request, limiter);
      const result = await applyRateLimit(request, limiter);

      expect(result.allowed).toBe(false);
      expect(result.headers['Retry-After']).toBeDefined();
      expect(parseInt(result.headers['Retry-After'])).toBeGreaterThan(0);
    });
  });
});
