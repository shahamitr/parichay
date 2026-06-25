/**
 * Invoice module type definitions
 * Covers Business Invoices, Line Items, Payments, Payment Links, and Recurring Invoices
 */

// ============================================================================
// Enums
// ============================================================================

export enum BusinessInvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum PaymentLinkStatus {
  ACTIVE = 'ACTIVE',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

export enum PaymentGateway {
  RAZORPAY = 'RAZORPAY',
  STRIPE = 'STRIPE',
}

export enum RecurringFrequency {
  WEEKLY = 'WEEKLY',
  BI_WEEKLY = 'BI_WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

// ============================================================================
// Line Item Types
// ============================================================================

export interface LineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: 0 | 5 | 12 | 18 | 28;
  hsnSacCode?: string;
}

export interface LineItem extends LineItemInput {
  amount: number;
  taxAmount: number;
}

// ============================================================================
// Invoice Types
// ============================================================================

export interface CreateInvoiceInput {
  customerId: string;
  branchId: string;
  invoiceDate: Date;
  dueDate: Date;
  lineItems: LineItemInput[];
  discount?: InvoiceDiscount;
  notes?: string;
  gstEnabled?: boolean;
  placeOfSupply?: string;
}

export interface InvoiceDiscount {
  type: 'PERCENTAGE' | 'FLAT';
  value: number;
}

export interface BusinessInvoice {
  id: string;
  invoiceNumber: string;
  status: BusinessInvoiceStatus;
  invoiceDate: Date;
  dueDate: Date;
  lineItems: LineItem[];
  subtotal: number;
  discountType: 'PERCENTAGE' | 'FLAT' | null;
  discountValue: number | null;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  gstEnabled: boolean;
  sellerGstin: string | null;
  buyerGstin: string | null;
  placeOfSupply: string | null;
  cgstTotal: number | null;
  sgstTotal: number | null;
  igstTotal: number | null;
  notes: string | null;
  pdfUrl: string | null;
  pdfGeneratedAt: Date | null;
  currency: string;
  customerId: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface InvoicePayment {
  id: string;
  amount: number;
  method: string;
  reference: string | null;
  notes: string | null;
  invoiceId: string;
  createdAt: Date;
}

export interface RecordPaymentInput {
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
}

// ============================================================================
// Payment Link Types
// ============================================================================

export interface PaymentLinkData {
  id: string;
  invoiceId: string;
  url: string;
  amount: number;
  currency: string;
  status: PaymentLinkStatus;
  expiresAt: Date;
  gateway: PaymentGateway;
  externalOrderId: string | null;
}

export interface PaymentWebhookData {
  gateway: PaymentGateway;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'FAILED';
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Recurring Invoice Types
// ============================================================================

export interface RecurringInvoice {
  id: string;
  frequency: RecurringFrequency;
  nextGenerateAt: Date;
  endDate: Date | null;
  maxOccurrences: number | null;
  occurrenceCount: number;
  isPaused: boolean;
  autoSend: boolean;
  invoiceId: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRecurringInvoiceInput {
  frequency: RecurringFrequency;
  endDate?: Date;
  maxOccurrences?: number;
  autoSend?: boolean;
  invoiceId: string;
  branchId: string;
}

// ============================================================================
// GST Types
// ============================================================================

export interface GSTBreakdown {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  isInterState: boolean;
}

export interface GSTLineItem {
  amount: number;
  taxRate: 0 | 5 | 12 | 18 | 28;
  hsnSacCode: string;
}

// ============================================================================
// Invoice Filters
// ============================================================================

export interface InvoiceFilters {
  search?: string;
  status?: BusinessInvoiceStatus;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: 'invoiceDate' | 'dueDate' | 'grandTotal' | 'createdAt' | 'invoiceNumber';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// Invoice Settings
// ============================================================================

export interface InvoiceSettings {
  id: string;
  businessName: string;
  businessAddress: string | null;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  signatureUrl: string | null;
  gstin: string | null;
  bankName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  upiId: string | null;
  defaultPaymentTerms: string | null;
  footerNote: string | null;
  colorAccent: string;
  templateStyle: 'MODERN' | 'CLASSIC' | 'MINIMAL';
  invoicePrefix: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateInvoiceSettingsInput {
  businessName?: string;
  businessAddress?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  signatureUrl?: string;
  gstin?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  defaultPaymentTerms?: string;
  footerNote?: string;
  colorAccent?: string;
  templateStyle?: 'MODERN' | 'CLASSIC' | 'MINIMAL';
  invoicePrefix?: string;
}
