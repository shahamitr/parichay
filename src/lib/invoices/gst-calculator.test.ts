import { describe, it, expect } from 'vitest';
import {
  calculateGST,
  validateGSTIN,
  getStateFromGSTIN,
  VALID_GST_RATES,
  STATE_CODES,
} from './gst-calculator';
import type { GSTLineItem } from '@/types/invoice';

describe('GST Calculator', () => {
  describe('calculateGST', () => {
    describe('intra-state transactions (CGST + SGST)', () => {
      it('should calculate CGST and SGST at half the rate for same state', () => {
        const lineItems: GSTLineItem[] = [
          { amount: 1000, taxRate: 18, hsnSacCode: '9954' },
        ];

        const result = calculateGST(lineItems, '27', '27');

        expect(result.isInterState).toBe(false);
        expect(result.subtotal).toBe(1000);
        expect(result.cgst).toBe(90); // 1000 * 9%
        expect(result.sgst).toBe(90); // 1000 * 9%
        expect(result.igst).toBe(0);
        expect(result.totalTax).toBe(180);
        expect(result.grandTotal).toBe(1180);
      });

      it('should calculate for multiple line items with different rates', () => {
        const lineItems: GSTLineItem[] = [
          { amount: 500, taxRate: 12, hsnSacCode: '1001' },
          { amount: 1000, taxRate: 18, hsnSacCode: '9954' },
        ];

        const result = calculateGST(lineItems, '29', '29');

        expect(result.isInterState).toBe(false);
        expect(result.subtotal).toBe(1500);
        // Item 1: 500 * 6% = 30 CGST, 30 SGST
        // Item 2: 1000 * 9% = 90 CGST, 90 SGST
        expect(result.cgst).toBe(120);
        expect(result.sgst).toBe(120);
        expect(result.igst).toBe(0);
        expect(result.totalTax).toBe(240);
        expect(result.grandTotal).toBe(1740);
      });

      it('should handle 0% tax rate', () => {
        const lineItems: GSTLineItem[] = [
          { amount: 2000, taxRate: 0, hsnSacCode: '0401' },
        ];

        const result = calculateGST(lineItems, '07', '07');

        expect(result.cgst).toBe(0);
        expect(result.sgst).toBe(0);
        expect(result.igst).toBe(0);
        expect(result.totalTax).toBe(0);
        expect(result.grandTotal).toBe(2000);
      });
    });

    describe('inter-state transactions (IGST)', () => {
      it('should calculate IGST at full rate for different states', () => {
        const lineItems: GSTLineItem[] = [
          { amount: 1000, taxRate: 18, hsnSacCode: '9954' },
        ];

        const result = calculateGST(lineItems, '27', '29');

        expect(result.isInterState).toBe(true);
        expect(result.subtotal).toBe(1000);
        expect(result.cgst).toBe(0);
        expect(result.sgst).toBe(0);
        expect(result.igst).toBe(180); // 1000 * 18%
        expect(result.totalTax).toBe(180);
        expect(result.grandTotal).toBe(1180);
      });

      it('should calculate IGST for multiple items with different rates', () => {
        const lineItems: GSTLineItem[] = [
          { amount: 500, taxRate: 5, hsnSacCode: '1001' },
          { amount: 1500, taxRate: 28, hsnSacCode: '8703' },
        ];

        const result = calculateGST(lineItems, '07', '33');

        expect(result.isInterState).toBe(true);
        expect(result.subtotal).toBe(2000);
        // Item 1: 500 * 5% = 25
        // Item 2: 1500 * 28% = 420
        expect(result.igst).toBe(445);
        expect(result.cgst).toBe(0);
        expect(result.sgst).toBe(0);
        expect(result.totalTax).toBe(445);
        expect(result.grandTotal).toBe(2445);
      });
    });

    describe('discount handling', () => {
      it('should apply percentage discount before tax calculation', () => {
        const lineItems: GSTLineItem[] = [
          { amount: 1000, taxRate: 18, hsnSacCode: '9954' },
        ];

        const result = calculateGST(lineItems, '27', '27', {
          type: 'PERCENTAGE',
          value: 10,
        });

        expect(result.subtotal).toBe(1000);
        // After 10% discount: taxable = 900
        // CGST: 900 * 9% = 81
        // SGST: 900 * 9% = 81
        expect(result.cgst).toBe(81);
        expect(result.sgst).toBe(81);
        expect(result.totalTax).toBe(162);
        expect(result.grandTotal).toBe(1062); // 900 + 162
      });

      it('should apply flat discount before tax calculation', () => {
        const lineItems: GSTLineItem[] = [
          { amount: 2000, taxRate: 12, hsnSacCode: '6109' },
        ];

        const result = calculateGST(lineItems, '24', '27', {
          type: 'FLAT',
          value: 200,
        });

        expect(result.subtotal).toBe(2000);
        // After ₹200 flat discount: taxable = 1800
        // IGST: 1800 * 12% = 216
        expect(result.isInterState).toBe(true);
        expect(result.igst).toBe(216);
        expect(result.totalTax).toBe(216);
        expect(result.grandTotal).toBe(2016); // 1800 + 216
      });

      it('should cap flat discount at subtotal', () => {
        const lineItems: GSTLineItem[] = [
          { amount: 100, taxRate: 18, hsnSacCode: '9954' },
        ];

        const result = calculateGST(lineItems, '27', '27', {
          type: 'FLAT',
          value: 500,
        });

        expect(result.subtotal).toBe(100);
        // Discount capped at 100 (subtotal), taxable = 0
        expect(result.cgst).toBe(0);
        expect(result.sgst).toBe(0);
        expect(result.totalTax).toBe(0);
        expect(result.grandTotal).toBe(0);
      });
    });

    describe('edge cases', () => {
      it('should handle empty line items', () => {
        const result = calculateGST([], '27', '27');

        expect(result.subtotal).toBe(0);
        expect(result.cgst).toBe(0);
        expect(result.sgst).toBe(0);
        expect(result.igst).toBe(0);
        expect(result.totalTax).toBe(0);
        expect(result.grandTotal).toBe(0);
      });

      it('should round all amounts to 2 decimal places', () => {
        const lineItems: GSTLineItem[] = [
          { amount: 333.33, taxRate: 18, hsnSacCode: '9954' },
        ];

        const result = calculateGST(lineItems, '27', '27');

        expect(result.subtotal).toBe(333.33);
        // 333.33 * 9% = 30.0 (rounded)
        expect(result.cgst).toBe(30);
        expect(result.sgst).toBe(30);
        expect(result.totalTax).toBe(60);
        expect(result.grandTotal).toBe(393.33);
      });

      it('should handle all valid GST rates', () => {
        for (const rate of VALID_GST_RATES) {
          const lineItems: GSTLineItem[] = [
            { amount: 1000, taxRate: rate, hsnSacCode: '0000' },
          ];

          const result = calculateGST(lineItems, '27', '27');

          expect(result.cgst).toBe((1000 * rate) / 2 / 100);
          expect(result.sgst).toBe((1000 * rate) / 2 / 100);
        }
      });
    });
  });

  describe('validateGSTIN', () => {
    it('should validate a correct GSTIN', () => {
      // 27 = Maharashtra, AABCU + 9603 + R = PAN, 1 = entity, Z = default, M = checksum
      expect(validateGSTIN('27AABCU9603R1ZM')).toBe(true);
    });

    it('should validate another correct GSTIN', () => {
      expect(validateGSTIN('29AABCT1332L1ZA')).toBe(true);
    });

    it('should reject GSTIN with wrong length', () => {
      expect(validateGSTIN('27AABCU9603R1Z')).toBe(false); // 14 chars
      expect(validateGSTIN('27AABCU9603R1ZMX')).toBe(false); // 16 chars
    });

    it('should reject GSTIN with invalid state code', () => {
      expect(validateGSTIN('00AABCU9603R1ZM')).toBe(false); // 00 invalid
      expect(validateGSTIN('38AABCU9603R1ZM')).toBe(false); // 38 invalid
      expect(validateGSTIN('99AABCU9603R1ZM')).toBe(false); // 99 invalid
    });

    it('should reject GSTIN with invalid PAN format', () => {
      expect(validateGSTIN('271ABCU9603R1ZM')).toBe(false); // digit in first 5
      expect(validateGSTIN('27AABCUABCDR1ZM')).toBe(false); // letters in digits area
    });

    it('should reject GSTIN with lowercase characters', () => {
      expect(validateGSTIN('27aabcu9603r1zm')).toBe(false);
    });

    it('should reject GSTIN without Z in position 14', () => {
      expect(validateGSTIN('27AABCU9603R1AM')).toBe(false);
    });

    it('should reject GSTIN with invalid entity number (0)', () => {
      expect(validateGSTIN('27AABCU9603R0ZM')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateGSTIN('')).toBe(false);
    });

    it('should reject null/undefined', () => {
      expect(validateGSTIN(null as unknown as string)).toBe(false);
      expect(validateGSTIN(undefined as unknown as string)).toBe(false);
    });

    it('should accept valid state codes from 01 to 37', () => {
      // Test boundary valid state codes
      expect(validateGSTIN('01AABCU9603R1ZM')).toBe(true); // 01 = J&K
      expect(validateGSTIN('37AABCU9603R1ZM')).toBe(true); // 37 = AP (New)
    });

    it('should accept entity numbers 1-9 and A-Z', () => {
      expect(validateGSTIN('27AABCU9603R1ZM')).toBe(true); // digit
      expect(validateGSTIN('27AABCU9603RAZM')).toBe(true); // letter
    });
  });

  describe('getStateFromGSTIN', () => {
    it('should extract state code from valid GSTIN', () => {
      expect(getStateFromGSTIN('27AABCU9603R1ZM')).toBe('27');
      expect(getStateFromGSTIN('29AABCT1332L1ZA')).toBe('29');
      expect(getStateFromGSTIN('07AABCU9603R1ZM')).toBe('07');
    });

    it('should throw error for invalid GSTIN', () => {
      expect(() => getStateFromGSTIN('INVALID')).toThrow('Invalid GSTIN format');
      expect(() => getStateFromGSTIN('')).toThrow('Invalid GSTIN format');
    });
  });
});
