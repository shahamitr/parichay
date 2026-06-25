/**
 * GST Calculator for Indian Invoice Compliance
 *
 * Handles:
 * - Intra-state tax calculation (CGST + SGST)
 * - Inter-state tax calculation (IGST)
 * - GSTIN format validation
 * - State code extraction from GSTIN
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import type { GSTBreakdown, GSTLineItem } from '@/types/invoice';

/** Valid GST rates as defined by Indian tax authorities */
export const VALID_GST_RATES = [0, 5, 12, 18, 28] as const;

/**
 * Valid Indian state codes (01-37) used in GSTIN
 * Maps state code to state name
 */
export const STATE_CODES: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '25': 'Daman & Diu',
  '26': 'Dadra & Nagar Haveli',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh (New)',
};

/**
 * Rounds a number to 2 decimal places using banker's rounding
 */
function roundTo2Decimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates GST breakdown for given line items based on seller and buyer state codes.
 *
 * - If sellerStateCode === buyerStateCode → intra-state → CGST = rate/2, SGST = rate/2
 * - If different states → inter-state → IGST = full rate
 * - Discount is applied to subtotal before tax calculation
 *
 * @param lineItems - Array of line items with amount, taxRate, and hsnSacCode
 * @param sellerStateCode - 2-digit state code of the seller
 * @param buyerStateCode - 2-digit state code of the buyer
 * @param discount - Optional discount to apply before tax calculation
 * @returns GSTBreakdown with all tax components
 */
export function calculateGST(
  lineItems: GSTLineItem[],
  sellerStateCode: string,
  buyerStateCode: string,
  discount?: { type: 'PERCENTAGE' | 'FLAT'; value: number }
): GSTBreakdown {
  const isInterState = sellerStateCode !== buyerStateCode;

  // Calculate subtotal from all line items
  const subtotal = roundTo2Decimals(
    lineItems.reduce((sum, item) => sum + item.amount, 0)
  );

  // Apply discount to subtotal
  let discountAmount = 0;
  if (discount) {
    if (discount.type === 'PERCENTAGE') {
      discountAmount = roundTo2Decimals((subtotal * discount.value) / 100);
    } else {
      discountAmount = roundTo2Decimals(Math.min(discount.value, subtotal));
    }
  }

  const taxableAmount = roundTo2Decimals(subtotal - discountAmount);

  // Calculate tax for each line item proportionally after discount
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  if (subtotal > 0) {
    for (const item of lineItems) {
      // Proportional taxable amount for this item after discount
      const itemProportion = item.amount / subtotal;
      const itemTaxableAmount = roundTo2Decimals(taxableAmount * itemProportion);
      const rate = item.taxRate;

      if (isInterState) {
        // Inter-state: IGST at full rate
        totalIgst += roundTo2Decimals((itemTaxableAmount * rate) / 100);
      } else {
        // Intra-state: CGST + SGST each at half rate
        totalCgst += roundTo2Decimals((itemTaxableAmount * (rate / 2)) / 100);
        totalSgst += roundTo2Decimals((itemTaxableAmount * (rate / 2)) / 100);
      }
    }
  }

  // Round final totals
  totalCgst = roundTo2Decimals(totalCgst);
  totalSgst = roundTo2Decimals(totalSgst);
  totalIgst = roundTo2Decimals(totalIgst);

  const totalTax = roundTo2Decimals(totalCgst + totalSgst + totalIgst);
  const grandTotal = roundTo2Decimals(taxableAmount + totalTax);

  return {
    subtotal,
    cgst: totalCgst,
    sgst: totalSgst,
    igst: totalIgst,
    totalTax,
    grandTotal,
    isInterState,
  };
}

/**
 * Validates a GSTIN (Goods and Services Tax Identification Number).
 *
 * GSTIN format (15 characters):
 * - Chars 1-2: State code (01-37)
 * - Chars 3-12: PAN (10 alphanumeric characters: 5 letters + 4 digits + 1 letter)
 * - Char 13: Entity number (1-9 or A-Z)
 * - Char 14: 'Z' (default)
 * - Char 15: Checksum (alphanumeric)
 *
 * @param gstin - The GSTIN string to validate
 * @returns true if the GSTIN is valid, false otherwise
 */
export function validateGSTIN(gstin: string): boolean {
  if (!gstin || typeof gstin !== 'string') {
    return false;
  }

  // Must be exactly 15 characters
  if (gstin.length !== 15) {
    return false;
  }

  // Must be alphanumeric
  if (!/^[0-9A-Z]+$/.test(gstin)) {
    return false;
  }

  // First 2 characters: valid state code (01-37)
  const stateCode = gstin.substring(0, 2);
  const stateNum = parseInt(stateCode, 10);
  if (isNaN(stateNum) || stateNum < 1 || stateNum > 37) {
    return false;
  }

  // Characters 3-7: 5 uppercase letters (first 5 of PAN)
  if (!/^[A-Z]{5}$/.test(gstin.substring(2, 7))) {
    return false;
  }

  // Characters 8-11: 4 digits (middle of PAN)
  if (!/^[0-9]{4}$/.test(gstin.substring(7, 11))) {
    return false;
  }

  // Character 12: 1 uppercase letter (last of PAN)
  if (!/^[A-Z]$/.test(gstin.substring(11, 12))) {
    return false;
  }

  // Character 13: Entity number (1-9 or A-Z)
  if (!/^[1-9A-Z]$/.test(gstin.substring(12, 13))) {
    return false;
  }

  // Character 14: Must be 'Z' (default)
  if (gstin.charAt(13) !== 'Z') {
    return false;
  }

  // Character 15: Checksum (alphanumeric)
  if (!/^[0-9A-Z]$/.test(gstin.charAt(14))) {
    return false;
  }

  return true;
}

/**
 * Extracts the state code from a GSTIN.
 * The first 2 characters of a GSTIN represent the state code.
 *
 * @param gstin - A valid GSTIN string
 * @returns The 2-digit state code (e.g., "27" for Maharashtra)
 * @throws Error if GSTIN is invalid
 */
export function getStateFromGSTIN(gstin: string): string {
  if (!validateGSTIN(gstin)) {
    throw new Error('Invalid GSTIN format');
  }

  return gstin.substring(0, 2);
}
