import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {

  test.describe('Email Login', () => {
    test('login page renders correctly', async ({ page }) => {
      await page.goto('/login');
      await expect(page.locator('text=Welcome back')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
    });

    test('shows error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[type="email"]', 'nonexistent@test.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button:has-text("Sign in")');
      await expect(page.locator('text=Invalid')).toBeVisible({ timeout: 10000 });
    });

    test('forgot password link works', async ({ page }) => {
      await page.goto('/login');
      await page.click('text=Forgot?');
      await expect(page).toHaveURL('/forgot-password');
    });

    test('phone OTP login link exists', async ({ page }) => {
      await page.goto('/login');
      await expect(page.locator('text=Sign in with Phone OTP')).toBeVisible();
    });

    test('register link navigates correctly', async ({ page }) => {
      await page.goto('/login');
      await page.click('text=Create one');
      await expect(page).toHaveURL('/register');
    });
  });

  test.describe('Phone OTP Login', () => {
    test('phone login page renders', async ({ page }) => {
      await page.goto('/login/phone');
      await expect(page.locator('text=Sign in with phone')).toBeVisible();
      await expect(page.locator('text=+91')).toBeVisible();
      await expect(page.locator('button:has-text("Send OTP")')).toBeVisible();
    });

    test('validates phone number length', async ({ page }) => {
      await page.goto('/login/phone');
      await page.fill('input[type="tel"]', '12345'); // too short
      await page.click('button:has-text("Send OTP")');
      await expect(page.locator('text=valid 10-digit')).toBeVisible();
    });

    test('shows OTP input after sending', async ({ page }) => {
      await page.goto('/login/phone');
      await page.fill('input[type="tel"]', '9876543210');
      await page.click('button:has-text("Send OTP")');
      // Should show OTP step (may take a moment)
      await expect(page.locator('text=Verification Code').or(page.locator('text=OTP sent'))).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Registration', () => {
    test('register page renders all fields', async ({ page }) => {
      await page.goto('/register');
      await expect(page.locator('text=Create your account')).toBeVisible();
      await expect(page.locator('#firstName')).toBeVisible();
      await expect(page.locator('#lastName')).toBeVisible();
      await expect(page.locator('#email')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
      await expect(page.locator('#confirmPassword')).toBeVisible();
      await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    });

    test('validates password match', async ({ page }) => {
      await page.goto('/register');
      await page.fill('#firstName', 'Test');
      await page.fill('#lastName', 'User');
      await page.fill('#email', 'test@test.com');
      await page.fill('#password', 'Password123!');
      await page.fill('#confirmPassword', 'DifferentPassword');
      await page.check('input[type="checkbox"]');
      await page.click('button:has-text("Create account")');
      await expect(page.locator('text=do not match')).toBeVisible();
    });
  });
});
