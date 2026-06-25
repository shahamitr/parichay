import { prisma } from '@/lib/prisma';

/**
 * Determines the Indian financial year string for a given date.
 * Indian financial year runs from April 1 to March 31.
 * Format: "2425" for April 2024 to March 2025.
 *
 * @param date - The date to determine the financial year for. Defaults to current date.
 * @returns A 4-character string representing the financial year (e.g., "2425")
 */
export function getCurrentFinancialYear(date?: Date): string {
  const d = date ?? new Date();
  const month = d.getMonth(); // 0-indexed: 0 = January, 3 = April
  const year = d.getFullYear();

  // Financial year starts in April (month index 3)
  // If month is April (3) or later, FY starts this calendar year
  // If month is before April (0-2), FY started previous calendar year
  const startYear = month >= 3 ? year : year - 1;
  const endYear = startYear + 1;

  // Take last 2 digits of each year
  const startStr = String(startYear).slice(-2);
  const endStr = String(endYear).slice(-2);

  return `${startStr}${endStr}`;
}

/**
 * Generates a unique, sequential invoice number for a given branch.
 * Pattern: {prefix}-{financialYear}-{sequence} (e.g., ABC-2425-001)
 *
 * Uses the InvoiceSequence model to track the last used number per branch/prefix/year.
 * Handles concurrent creation with a database unique constraint and retry logic (max 3 retries).
 * Cancelled invoice numbers are never reused — the sequence only increments.
 *
 * @param branchId - The branch ID for which to generate the invoice number
 * @param prefix - The invoice prefix (e.g., "INV", "ABC")
 * @param invoiceDate - The date of the invoice, used to determine the financial year. Defaults to current date.
 * @returns The generated invoice number string
 * @throws Error if unable to generate a unique number after max retries
 */
export async function generateInvoiceNumber(
  branchId: string,
  prefix: string,
  invoiceDate?: Date
): Promise<string> {
  const financialYear = getCurrentFinancialYear(invoiceDate);
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Upsert the sequence record: create if it doesn't exist, increment if it does
      const sequence = await prisma.invoiceSequence.upsert({
        where: {
          branchId_prefix_financialYear: {
            branchId,
            prefix,
            financialYear,
          },
        },
        create: {
          branchId,
          prefix,
          financialYear,
          lastNumber: 1,
        },
        update: {
          lastNumber: { increment: 1 },
        },
      });

      const nextNumber = sequence.lastNumber;
      const paddedSequence = String(nextNumber).padStart(3, '0');

      return `${prefix}-${financialYear}-${paddedSequence}`;
    } catch (error: unknown) {
      // Handle unique constraint violation (concurrent creation)
      const isUniqueConstraintError =
        error instanceof Error &&
        'code' in error &&
        (error as { code?: string }).code === 'P2002';

      if (isUniqueConstraintError && attempt < maxRetries - 1) {
        // Retry: another process created the record concurrently
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    `Failed to generate invoice number after ${maxRetries} retries for branch ${branchId}, prefix ${prefix}, FY ${financialYear}`
  );
}
