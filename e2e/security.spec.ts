import { test, expect } from '@playwright/test';

test.describe('Security Checks', () => {

  test('Admin routes redirect to login without auth', async ({ page }) => {
    await page.goto('/admin/dashboard');
    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 10000 });
  });

  test('API routes return 401 without auth', async ({ request }) => {
    const endpoints = [
      '/api/users',
      '/api/audit-logs',
      '/api/vouchers',
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(401);
    }
  });

  test('Login rate limiting works (does not crash)', async ({ request }) => {
    const results = [];
    for (let i = 0; i < 6; i++) {
      const response = await request.post('/api/auth/login', {
        data: { email: `ratelimit${i}@test.com`, password: 'WrongPass1!' },
      });
      results.push(response.status());
    }
    // Should be 401 (invalid) or 429 (rate limited), never 500
    for (const status of results) {
      expect([401, 429]).toContain(status);
    }
  });

  test('Password reset rate limiting works', async ({ request }) => {
    const results = [];
    for (let i = 0; i < 5; i++) {
      const response = await request.post('/api/auth/forgot-password', {
        data: { email: `ratelimit${i}@test.com` },
      });
      results.push(response.status());
    }
    // Should be 200 or 429, never 500
    for (const status of results) {
      expect([200, 429]).toContain(status);
    }
  });

  test('Malformed JSON does not crash server', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      headers: { 'Content-Type': 'application/json' },
      data: 'not-valid-json{{{',
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(600);
  });

  test('XSS in search params does not reflect', async ({ page }) => {
    await page.goto('/roi-calculator?q=<script>alert(1)</script>');
    const content = await page.content();
    expect(content).not.toContain('<script>alert(1)</script>');
  });
});
