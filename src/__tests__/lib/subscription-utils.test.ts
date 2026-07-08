import { describe, it, expect } from 'vitest';
import {
  generateLicenseKey,
  isValidLicenseKey,
  calculateEndDate,
  isInGracePeriod,
  shouldSuspendSubscription,
  generateInvoiceNumber,
  calculateTax,
  calculateTotalWithTax,
} from '@/lib/subscription-utils';

describe('Subscription Utilities', () => {
  describe('generateLicenseKey', () => {
    it('should generate a key in XXXX-XXXX-XXXX-XXXX format', () => {
      const key = generateLicenseKey();
      expect(key).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    });

    it('should generate unique keys', () => {
      const keys = new Set(Array.from({ length: 100 }, () => generateLicenseKey()));
      expect(keys.size).toBe(100);
    });
  });

  describe('isValidLicenseKey', () => {
    it('should validate correct format', () => {
      expect(isValidLicenseKey('ABCD-1234-EFGH-5678')).toBe(true);
      expect(isValidLicenseKey('A1B2-C3D4-E5F6-G7H8')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(isValidLicenseKey('invalid')).toBe(false);
      expect(isValidLicenseKey('ABCD-1234-EFGH')).toBe(false);
      expect(isValidLicenseKey('abcd-1234-efgh-5678')).toBe(false); // lowercase
      expect(isValidLicenseKey('')).toBe(false);
    });
  });

  describe('calculateEndDate', () => {
    it('should add 1 month for MONTHLY duration', () => {
      const start = new Date('2024-01-15');
      const end = calculateEndDate(start, 'MONTHLY');
      expect(end.getMonth()).toBe(1); // February
      expect(end.getDate()).toBe(15);
    });

    it('should add 1 year for YEARLY duration', () => {
      const start = new Date('2024-03-01');
      const end = calculateEndDate(start, 'YEARLY');
      expect(end.getFullYear()).toBe(2025);
      expect(end.getMonth()).toBe(2); // March
    });

    it('should handle month boundaries', () => {
      const start = new Date('2024-01-31');
      const end = calculateEndDate(start, 'MONTHLY');
      // Jan 31 + 1 month → Feb 29 (2024 is leap year) or March 1/2
      expect(end.getMonth()).toBeGreaterThanOrEqual(1); // At least February
      expect(end.getMonth()).toBeLessThanOrEqual(2); // At most March
    });
  });

  describe('isInGracePeriod', () => {
    it('should return false for active subscriptions', () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      expect(isInGracePeriod(futureDate)).toBe(false);
    });

    it('should return true within 7 days of expiry', () => {
      const expiredRecently = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
      expect(isInGracePeriod(expiredRecently)).toBe(true);
    });

    it('should return false after 7 days past expiry', () => {
      const expiredLongAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
      expect(isInGracePeriod(expiredLongAgo)).toBe(false);
    });
  });

  describe('shouldSuspendSubscription', () => {
    it('should not suspend active subscriptions', () => {
      const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expect(shouldSuspendSubscription(future)).toBe(false);
    });

    it('should not suspend during grace period', () => {
      const recentlyExpired = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      expect(shouldSuspendSubscription(recentlyExpired)).toBe(false);
    });

    it('should suspend after grace period', () => {
      const longExpired = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      expect(shouldSuspendSubscription(longExpired)).toBe(true);
    });
  });

  describe('generateInvoiceNumber', () => {
    it('should generate in INV-YYYYMMDD-XXXX format', () => {
      const invoice = generateInvoiceNumber();
      expect(invoice).toMatch(/^INV-\d{8}-[A-Z0-9]{4}$/);
    });

    it('should include current date', () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const invoice = generateInvoiceNumber();
      expect(invoice).toContain(`INV-${year}${month}${day}`);
    });
  });

  describe('calculateTax', () => {
    it('should calculate 18% GST by default', () => {
      expect(calculateTax(1000)).toBe(180);
      expect(calculateTax(500)).toBe(90);
    });

    it('should calculate custom tax rate', () => {
      expect(calculateTax(1000, 0.12)).toBe(120);
      expect(calculateTax(1000, 0.05)).toBe(50);
    });

    it('should round to 2 decimal places', () => {
      const tax = calculateTax(333);
      expect(Number.isFinite(tax)).toBe(true);
      expect(String(tax).split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });

  describe('calculateTotalWithTax', () => {
    it('should add tax to amount', () => {
      expect(calculateTotalWithTax(1000)).toBe(1180); // 1000 + 18%
      expect(calculateTotalWithTax(1000, 0.12)).toBe(1120);
    });
  });
});
