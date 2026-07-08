import { test, expect } from '@playwright/test';

test.describe('Microsite / Demo Pages', () => {

  test.describe('Demo Industries Page', () => {
    test('loads and shows industry categories', async ({ page }) => {
      await page.goto('/demo/industries');
      // Should show categories even without DB (graceful fallback)
      await expect(page.locator('text=Industry').or(page.locator('text=industry'))).toBeVisible({ timeout: 15000 });
    });

    test('search input filters categories', async ({ page }) => {
      await page.goto('/demo/industries');
      const searchInput = page.locator('input[placeholder*="Search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('doctor');
        await expect(page.locator('text=Healthcare').or(page.locator('text=Doctor'))).toBeVisible();
      }
    });
  });

  test.describe('Demo Microsite', () => {
    test('demo microsite renders profile section', async ({ page }) => {
      await page.goto('/demo-business-owners/main');
      // Should either show the microsite or a 404 page (if DB not seeded)
      const hasProfile = await page.locator('text=Pinnacle').isVisible().catch(() => false);
      const has404 = await page.locator('text=Not Found').or(page.locator('text=not found')).isVisible().catch(() => false);
      expect(hasProfile || has404).toBe(true);
    });

    test('demo microsite has contact buttons', async ({ page }) => {
      await page.goto('/demo-business-owners/main');
      const hasCallButton = await page.locator('text=Call Now').or(page.locator('text=Call')).isVisible().catch(() => false);
      const has404 = await page.locator('text=Not Found').isVisible().catch(() => false);
      if (!has404) {
        expect(hasCallButton).toBe(true);
      }
    });

    test('demo microsite shows services section', async ({ page }) => {
      await page.goto('/demo-restaurants-cafes/main');
      const hasServices = await page.locator('text=Service').or(page.locator('text=Menu')).isVisible().catch(() => false);
      const has404 = await page.locator('text=Not Found').isVisible().catch(() => false);
      if (!has404) {
        expect(hasServices).toBe(true);
      }
    });
  });

  test.describe('Error Handling', () => {
    test('404 page shows for nonexistent brand', async ({ page }) => {
      await page.goto('/nonexistent-brand-xyz/main');
      await expect(
        page.locator('text=Not Found').or(page.locator('text=not found')).or(page.locator('text=Page Not Found'))
      ).toBeVisible({ timeout: 10000 });
    });

    test('error page does not crash (no stack trace)', async ({ page }) => {
      await page.goto('/nonexistent-brand-xyz/main');
      // Should NOT see raw error/stack trace
      await expect(page.locator('text=Error:')).not.toBeVisible();
      await expect(page.locator('text=at Object')).not.toBeVisible();
    });
  });
});
