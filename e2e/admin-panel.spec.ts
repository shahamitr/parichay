import { test, expect, Page } from '@playwright/test';

// Use existing admin credentials from your database
// Update these with a real admin account before running
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'amit.shah@oplinn.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'Admin123!';

async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.fill('input[name="email"], input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"], input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(admin|dashboard)/, { timeout: 15000 });
}

test.describe('Admin Panel', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Dashboard loads with stats', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page.locator('text=Good Morning, text=Good Afternoon, text=Good Evening')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Quick Actions')).toBeVisible();
  });

  test('User Management page loads', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.locator('text=User Management')).toBeVisible({ timeout: 10000 });
    // Should show the data table
    await expect(page.locator('table, [role="table"]')).toBeVisible({ timeout: 10000 });
  });

  test('Brands page loads', async ({ page }) => {
    await page.goto('/admin/brands');
    await page.waitForLoadState('networkidle');
    // Should show brands content or empty state
    await expect(page.locator('body')).not.toContainText('500');
  });

  test('Leads page loads', async ({ page }) => {
    await page.goto('/admin/leads');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toContainText('Internal Server Error');
  });

  test('Analytics page loads', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toContainText('500');
  });

  test('Audit Logs page loads (Super Admin)', async ({ page }) => {
    await page.goto('/admin/audit-logs');
    await expect(page.locator('text=Audit Logs')).toBeVisible({ timeout: 10000 });
  });

  test('Settings page loads', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toContainText('500');
  });

  test('Billing page loads', async ({ page }) => {
    await page.goto('/admin/billing');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toContainText('Internal Server Error');
  });

  test('Sidebar navigation works', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForLoadState('networkidle');

    // Click on Leads in sidebar
    await page.click('a[href="/admin/leads"]');
    await page.waitForURL('**/admin/leads');

    // Click on Analytics
    await page.click('a[href="/admin/analytics"]');
    await page.waitForURL('**/admin/analytics');
  });

  test('Create button opens menu', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForLoadState('networkidle');

    // Click Create button in header
    const createBtn = page.locator('button:has-text("Create")');
    if (await createBtn.isVisible()) {
      await createBtn.click();
      await expect(page.locator('text=New Brand')).toBeVisible();
    }
  });
});
