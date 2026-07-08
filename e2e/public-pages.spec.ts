import { test, expect } from '@playwright/test';

test.describe('Public Pages — Visitor Experience', () => {

  test('Landing page loads and shows key elements', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Parichay')).toBeVisible();
    await expect(page.locator('text=Start Free')).toBeVisible();
    await expect(page.locator('text=Features')).toBeVisible();
    await expect(page.locator('text=How It Works')).toBeVisible();
  });

  test('Landing page CTA links to register', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('a:has-text("Create Your Profile")').first();
    await expect(cta).toHaveAttribute('href', '/register');
  });

  test('ROI Calculator page loads and calculates', async ({ page }) => {
    await page.goto('/roi-calculator');
    await expect(page.locator('text=How much can your business save')).toBeVisible();
    // Default values should show savings
    await expect(page.locator('text=Annual Savings')).toBeVisible();
    await expect(page.locator('text=Start Free Trial')).toBeVisible();
  });

  test('Comparison page loads with feature table', async ({ page }) => {
    await page.goto('/compare');
    await expect(page.locator('text=How Parichay compares')).toBeVisible();
    await expect(page.locator('text=Justdial')).toBeVisible();
    await expect(page.locator('text=Google Business')).toBeVisible();
    await expect(page.locator('text=Setup time')).toBeVisible();
  });

  test('Industry page (doctors) loads', async ({ page }) => {
    await page.goto('/for/doctors');
    await expect(page.locator('text=Patients are searching')).toBeVisible();
    await expect(page.locator('text=Professional Clinic Profile')).toBeVisible();
  });

  test('Industry page (restaurants) loads', async ({ page }) => {
    await page.goto('/for/restaurants');
    await expect(page.locator('text=Your food is amazing')).toBeVisible();
  });

  test('Referral page loads', async ({ page }) => {
    await page.goto('/refer');
    await expect(page.locator('text=Refer a business')).toBeVisible();
    await expect(page.locator('text=Share on WhatsApp')).toBeVisible();
  });

  test('Sales kit page loads', async ({ page }) => {
    await page.goto('/sales-kit');
    await expect(page.locator('text=Sales Kit')).toBeVisible();
    await expect(page.locator('text=Cold Outreach')).toBeVisible();
  });

  test('Login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
  });

  test('Register page loads', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
  });
});
