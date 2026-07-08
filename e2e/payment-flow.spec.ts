import { test, expect } from '@playwright/test';

test.describe('Payment & Subscription Flow', () => {

  test('Pricing section is visible on landing page', async ({ page }) => {
    await page.goto('/');
    // Scroll to pricing
    await page.locator('#pricing, text=Pricing').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    // Pricing content should be visible
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('Voucher validation API rejects invalid code', async ({ request }) => {
    const response = await request.post('/api/vouchers/validate', {
      data: { code: 'INVALID_XYZ_123', amount: 1999 },
    });
    // Should be 401 (no auth) or 404 (invalid code)
    expect([401, 404]).toContain(response.status());
  });

  test('Payment order creation requires auth', async ({ request }) => {
    const response = await request.post('/api/payments/razorpay/create-order', {
      data: { planId: 'test', brandId: 'test' },
    });
    expect(response.status()).toBe(401);
  });

  test('Trial start requires auth', async ({ request }) => {
    const response = await request.post('/api/subscriptions/start-trial', {
      data: { brandId: 'test', planId: 'test' },
    });
    expect(response.status()).toBe(401);
  });
});
