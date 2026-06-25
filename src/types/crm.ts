/**
 * CRM module type definitions
 * Covers Customer management, Interactions, Segments, and Review Requests
 */

// ============================================================================
// Enums
// ============================================================================

export enum InteractionType {
  PHONE_CALL = 'PHONE_CALL',
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  IN_PERSON = 'IN_PERSON',
  SMS = 'SMS',
  CUSTOM = 'CUSTOM',
  APPOINTMENT_BOOKED = 'APPOINTMENT_BOOKED',
  INVOICE_SENT = 'INVOICE_SENT',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
}

export enum ReviewRequestStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  CLICKED = 'CLICKED',
  REVIEWED = 'REVIEWED',
}

// ============================================================================
// Customer Types
// ============================================================================

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  companyName: string | null;
  tags: string[];
  customFields: Record<string, string>;
  notes: string | null;
  birthday: Date | null;
  anniversary: Date | null;
  deletedAt: Date | null;
  totalInvoiceValue: number;
  lastInteractionAt: Date | null;
  branchId: string;
  leadId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerInput {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  companyName?: string;
  tags?: string[];
  customFields?: Record<string, string>;
  notes?: string;
  birthday?: Date;
  anniversary?: Date;
  branchId: string;
}

export interface CustomerFilters {
  search?: string;
  tags?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
  lastInteractionAfter?: Date;
  lastInteractionBefore?: Date;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'lastInteractionAt' | 'totalInvoiceValue';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// Interaction Types
// ============================================================================

export interface Attachment {
  name: string;
  url: string;
  size: number;
}

export interface CustomerInteraction {
  id: string;
  type: InteractionType;
  summary: string | null;
  duration: number | null;
  attachments: Attachment[] | null;
  metadata: Record<string, unknown> | null;
  loggedById: string | null;
  loggedByName: string | null;
  customerId: string;
  createdAt: Date;
}

export interface CreateInteractionInput {
  type: InteractionType;
  summary?: string;
  duration?: number;
  attachments?: Attachment[];
  metadata?: Record<string, unknown>;
  loggedById?: string;
  loggedByName?: string;
  customerId: string;
}

// ============================================================================
// Segment Types
// ============================================================================

export interface SegmentCriteria {
  tags?: string[];
  lastInteractionBefore?: Date;
  lastInteractionAfter?: Date;
  minInvoiceValue?: number;
  maxInvoiceValue?: number;
  createdBefore?: Date;
  createdAfter?: Date;
}

export interface CustomerSegment {
  id: string;
  name: string;
  criteria: SegmentCriteria;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSegmentInput {
  name: string;
  criteria: SegmentCriteria;
  branchId: string;
}

// ============================================================================
// Review Request Types
// ============================================================================

export interface ReviewRequest {
  id: string;
  status: ReviewRequestStatus;
  scheduledFor: Date;
  sentAt: Date | null;
  clickedAt: Date | null;
  channel: 'email' | 'whatsapp';
  customerId: string;
  invoiceId: string | null;
  branchId: string;
  createdAt: Date;
}

export interface CreateReviewRequestInput {
  customerId: string;
  channel: 'email' | 'whatsapp';
  scheduledFor: Date;
  invoiceId?: string;
  branchId: string;
}

// ============================================================================
// Import / Export Types
// ============================================================================

export interface ImportResult {
  totalRows: number;
  importedCount: number;
  errorCount: number;
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

// ============================================================================
// Pagination
// ============================================================================

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
