import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero section with headline and CTAs', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Digital Identity');
    await expect(page.locator('a:has-text("Start Free")')).toBeVisible();
    await expect(page.locator('text=Watch Demo').or(page.locator('text=See Live Demos'))).toBeVisible();
  });

  test('navigation links are visible on desktop', async ({ page }) => {
    await expect(page.locator('nav >> text=How It Works')).toBeVisible();
    await expect(page.locator('nav >> text=Features')).toBeVisible();
    await expect(page.locator('nav >> text=Pricing')).toBeVisible();
    await expect(page.locator('nav >> text=FAQ')).toBeVisible();
  });

  test('pricing section shows plans with monthly/yearly toggle', async ({ page }) => {
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Simple, transparent pricing')).toBeVisible();
    await expect(page.locator('button:has-text("Monthly")')).toBeVisible();
    await expect(page.locator('button:has-text("Yearly")')).toBeVisible();
    await expect(page.locator('text=Starter')).toBeVisible();
    await expect(page.locator('text=Professional')).toBeVisible();
    await expect(page.locator('text=Agency')).toBeVisible();
  });

  test('FAQ section expands answers on click', async ({ page }) => {
    await page.locator('#faq').scrollIntoViewIfNeeded();
    const firstQuestion = page.locator('text=What is Parichay?');
    await firstQuestion.click();
    await expect(page.locator('text=AI-powered platform')).toBeVisible();
  });

  test('footer contains all important links', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(page.locator('footer >> text=Privacy Policy')).toBeVisible();
    await expect(page.locator('footer >> text=Terms of Service')).toBeVisible();
    await expect(page.locator('footer >> text=Contact')).toBeVisible();
  });

  test('sign in link navigates to login page', async ({ page }) => {
    await page.locator('nav >> text=Sign in').click();
    await expect(page).toHaveURL('/login');
  });
});
