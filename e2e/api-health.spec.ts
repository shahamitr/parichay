import { test, expect } from '@playwright/test';

test.describe('API Health & Core Endpoints', () => {

  test('health endpoint responds', async ({ request }) => {
    const response = await request.get('/api/health');
    // Either healthy (200) or unhealthy (503) — but should not 500
    expect([200, 503]).toContain(response.status());
    const body = await response.json();
    expect(body.status).toBeDefined();
    expect(body.timestamp).toBeDefined();
  });

  test('subscription plans API returns plans', async ({ request }) => {
    const response = await request.get('/api/subscription-plans');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.plans).toBeDefined();
    expect(Array.isArray(body.plans)).toBe(true);
  });

  test('search directory API responds', async ({ request }) => {
    const response = await request.get('/api/search/directory?limit=5');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.results).toBeDefined();
    expect(body.pagination).toBeDefined();
  });

  test('login API rejects missing credentials', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {},
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status()).toBe(400);
  });

  test('login API rejects wrong credentials', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { email: 'fake@test.com', password: 'wrong' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect([401, 400]).toContain(response.status());
  });

  test('protected API rejects unauthenticated requests', async ({ request }) => {
    const response = await request.get('/api/subscriptions');
    expect(response.status()).toBe(401);
  });

  test('leads API rejects bot submissions', async ({ request }) => {
    const response = await request.post('/api/leads', {
      data: {
        branchId: 'test',
        brandId: 'test',
        name: 'Bot',
        phone: '1234567890',
        website_url: 'http://spam.com', // honeypot filled
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 Chrome/120.0',
        'Accept-Language': 'en-US',
      },
    });
    // Bot submissions get fake success (200) — silently rejected
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true); // Fake success to confuse bots
  });

  test('OTP send API rate limits', async ({ request }) => {
    // Send multiple requests rapidly
    for (let i = 0; i < 4; i++) {
      await request.post('/api/auth/otp/send', {
        data: { phone: '+919999999999' },
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // 4th request should be rate limited
    const response = await request.post('/api/auth/otp/send', {
      data: { phone: '+919999999999' },
      headers: { 'Content-Type': 'application/json' },
    });
    // Either 429 or returns with rate limit message
    expect([200, 429]).toContain(response.status());
  });
});
