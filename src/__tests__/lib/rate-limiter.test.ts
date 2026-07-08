import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimiter } from '@/lib/rate-limiter';

describe('Rate Limiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter({
      windowMs: 1000, // 1 second window for fast tests
      maxRequests: 3,
    });
  });

  it('should allow requests under the limit', async () => {
    const result1 = await limiter.checkLimit('test-user-1');
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = await limiter.checkLimit('test-user-1');
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = await limiter.checkLimit('test-user-1');
    expect(result3.allowed).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it('should block requests over the limit', async () => {
    await limiter.checkLimit('test-user-2');
    await limiter.checkLimit('test-user-2');
    await limiter.checkLimit('test-user-2');

    const result = await limiter.checkLimit('test-user-2');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should track different identifiers independently', async () => {
    await limiter.checkLimit('user-a');
    await limiter.checkLimit('user-a');
    await limiter.checkLimit('user-a');

    // user-a is at limit
    const resultA = await limiter.checkLimit('user-a');
    expect(resultA.allowed).toBe(false);

    // user-b should still be allowed
    const resultB = await limiter.checkLimit('user-b');
    expect(resultB.allowed).toBe(true);
    expect(resultB.remaining).toBe(2);
  });

  it('should reset after window expires', async () => {
    const fastLimiter = new RateLimiter({
      windowMs: 50, // 50ms window
      maxRequests: 1,
    });

    await fastLimiter.checkLimit('expire-test');
    const blocked = await fastLimiter.checkLimit('expire-test');
    expect(blocked.allowed).toBe(false);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 60));

    const allowed = await fastLimiter.checkLimit('expire-test');
    expect(allowed.allowed).toBe(true);
  });

  it('should return a valid resetTime', async () => {
    const result = await limiter.checkLimit('time-test');
    expect(result.resetTime).toBeGreaterThan(Date.now());
    expect(result.resetTime).toBeLessThanOrEqual(Date.now() + 1100); // within window + margin
  });
});
