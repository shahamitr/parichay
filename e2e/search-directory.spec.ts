import { test, expect } from '@playwright/test';

test.describe('Search & Directory', () => {

  test('search page loads', async ({ page }) => {
    await page.goto('/search');
    await expect(page.locator('input').first()).toBeVisible();
  });

  test('SEO city page renders', async ({ page }) => {
    await page.goto('/find/mumbai/dentist');
    await expect(page.locator('h1')).toContainText('Dentist');
    await expect(page.locator('h1')).toContainText('Mumbai');
  });

  test('SEO city page has register CTA', async ({ page }) => {
    await page.goto('/find/mumbai/salon');
    await expect(page.locator('text=Register Your Business').or(page.locator('text=Register'))).toBeVisible();
  });

  test('empty city page shows helpful message', async ({ page }) => {
    await page.goto('/find/unknown-city-xyz/unknown-category');
    await expect(
      page.locator('text=Be the first').or(page.locator('text=No'))
    ).toBeVisible();
  });
});
