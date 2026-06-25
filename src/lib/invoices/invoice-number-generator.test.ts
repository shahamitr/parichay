import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrentFinancialYear, generateInvoiceNumber } from './invoice-number-generator';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    invoiceSequence: {
      upsert: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

const mockUpsert = vi.mocked(prisma.invoiceSequence.upsert);

describe('Invoice Number Generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentFinancialYear', () => {
    it('should return "2425" for dates in April 2024 to March 2025', () => {
      expect(getCurrentFinancialYear(new Date('2024-04-01'))).toBe('2425');
      expect(getCurrentFinancialYear(new Date('2024-06-15'))).toBe('2425');
      expect(getCurrentFinancialYear(new Date('2024-12-31'))).toBe('2425');
      expect(getCurrentFinancialYear(new Date('2025-01-01'))).toBe('2425');
      expect(getCurrentFinancialYear(new Date('2025-03-31'))).toBe('2425');
    });

    it('should return "2526" for dates in April 2025 to March 2026', () => {
      expect(getCurrentFinancialYear(new Date('2025-04-01'))).toBe('2526');
      expect(getCurrentFinancialYear(new Date('2025-07-20'))).toBe('2526');
      expect(getCurrentFinancialYear(new Date('2026-02-28'))).toBe('2526');
    });

    it('should handle January-March as belonging to previous FY start', () => {
      // January 2025 belongs to FY 2024-2025
      expect(getCurrentFinancialYear(new Date('2025-01-15'))).toBe('2425');
      // February 2025 belongs to FY 2024-2025
      expect(getCurrentFinancialYear(new Date('2025-02-20'))).toBe('2425');
      // March 2025 belongs to FY 2024-2025
      expect(getCurrentFinancialYear(new Date('2025-03-31'))).toBe('2425');
    });

    it('should handle April 1st as start of new FY', () => {
      expect(getCurrentFinancialYear(new Date('2025-04-01'))).toBe('2526');
    });

    it('should use current date when no date is provided', () => {
      const result = getCurrentFinancialYear();
      // Should be a 4-char string of digits
      expect(result).toMatch(/^\d{4}$/);
    });

    it('should handle century boundary (year 2099-2100)', () => {
      expect(getCurrentFinancialYear(new Date('2099-04-01'))).toBe('9900');
      expect(getCurrentFinancialYear(new Date('2100-03-31'))).toBe('9900');
    });
  });

  describe('generateInvoiceNumber', () => {
    it('should generate first invoice number as 001', async () => {
      mockUpsert.mockResolvedValueOnce({
        id: 'seq-1',
        branchId: 'branch-1',
        prefix: 'INV',
        financialYear: '2425',
        lastNumber: 1,
      });

      const result = await generateInvoiceNumber('branch-1', 'INV', new Date('2024-06-15'));

      expect(result).toBe('INV-2425-001');
      expect(mockUpsert).toHaveBeenCalledWith({
        where: {
          branchId_prefix_financialYear: {
            branchId: 'branch-1',
            prefix: 'INV',
            financialYear: '2425',
          },
        },
        create: {
          branchId: 'branch-1',
          prefix: 'INV',
          financialYear: '2425',
          lastNumber: 1,
        },
        update: {
          lastNumber: { increment: 1 },
        },
      });
    });

    it('should generate sequential numbers with proper padding', async () => {
      mockUpsert.mockResolvedValueOnce({
        id: 'seq-1',
        branchId: 'branch-1',
        prefix: 'ABC',
        financialYear: '2425',
        lastNumber: 42,
      });

      const result = await generateInvoiceNumber('branch-1', 'ABC', new Date('2024-09-01'));

      expect(result).toBe('ABC-2425-042');
    });

    it('should handle numbers beyond 999 without truncation', async () => {
      mockUpsert.mockResolvedValueOnce({
        id: 'seq-1',
        branchId: 'branch-1',
        prefix: 'INV',
        financialYear: '2425',
        lastNumber: 1234,
      });

      const result = await generateInvoiceNumber('branch-1', 'INV', new Date('2025-02-01'));

      expect(result).toBe('INV-2425-1234');
    });

    it('should use current date when invoiceDate is not provided', async () => {
      mockUpsert.mockResolvedValueOnce({
        id: 'seq-1',
        branchId: 'branch-1',
        prefix: 'INV',
        financialYear: getCurrentFinancialYear(),
        lastNumber: 5,
      });

      const result = await generateInvoiceNumber('branch-1', 'INV');

      expect(result).toBe(`INV-${getCurrentFinancialYear()}-005`);
    });

    it('should retry on unique constraint violation', async () => {
      const uniqueError = new Error('Unique constraint failed') as Error & { code: string };
      uniqueError.code = 'P2002';

      mockUpsert.mockRejectedValueOnce(uniqueError);
      mockUpsert.mockResolvedValueOnce({
        id: 'seq-1',
        branchId: 'branch-1',
        prefix: 'INV',
        financialYear: '2425',
        lastNumber: 2,
      });

      const result = await generateInvoiceNumber('branch-1', 'INV', new Date('2024-07-01'));

      expect(result).toBe('INV-2425-002');
      expect(mockUpsert).toHaveBeenCalledTimes(2);
    });

    it('should throw after max retries on persistent unique constraint violation', async () => {
      const uniqueError = new Error('Unique constraint failed') as Error & { code: string };
      uniqueError.code = 'P2002';

      mockUpsert.mockRejectedValue(uniqueError);

      await expect(
        generateInvoiceNumber('branch-1', 'INV', new Date('2024-07-01'))
      ).rejects.toThrow('Unique constraint failed');
      expect(mockUpsert).toHaveBeenCalledTimes(3);
    });

    it('should throw immediately on non-constraint errors', async () => {
      const dbError = new Error('Database connection failed');

      mockUpsert.mockRejectedValueOnce(dbError);

      await expect(
        generateInvoiceNumber('branch-1', 'INV', new Date('2024-07-01'))
      ).rejects.toThrow('Database connection failed');
      expect(mockUpsert).toHaveBeenCalledTimes(1);
    });

    it('should use the correct financial year based on invoice date', async () => {
      // March 2025 belongs to FY 2024-25
      mockUpsert.mockResolvedValueOnce({
        id: 'seq-1',
        branchId: 'branch-1',
        prefix: 'INV',
        financialYear: '2425',
        lastNumber: 10,
      });

      const result = await generateInvoiceNumber('branch-1', 'INV', new Date('2025-03-15'));

      expect(result).toBe('INV-2425-010');
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            branchId_prefix_financialYear: {
              branchId: 'branch-1',
              prefix: 'INV',
              financialYear: '2425',
            },
          },
        })
      );
    });
  });
});
