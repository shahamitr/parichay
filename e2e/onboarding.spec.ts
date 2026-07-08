import { test, expect } from '@playwright/test';

test.describe('Onboarding / Quick Card', () => {

  test('onboarding page loads', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.locator('text=Create your digital card').or(page.locator('text=digital card'))).toBeVisible();
  });

  test('step 1 shows business name and city fields', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.locator('text=Business Name')).toBeVisible();
    await expect(page.locator('text=City')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('step 1 validates required fields', async ({ page }) => {
    await page.goto('/onboarding');
    await page.click('button:has-text("Next")');
    await expect(page.locator('text=required').or(page.locator('text=fill'))).toBeVisible();
  });

  test('progress bar shows 3 steps', async ({ page }) => {
    await page.goto('/onboarding');
    const progressBars = page.locator('[class*="rounded-full"][class*="h-1"]');
    await expect(progressBars).toHaveCount(3);
  });
});
