import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';
import {
  Customer,
  CreateCustomerInput,
  CustomerFilters,
  CustomerInteraction,
  ImportResult,
  ImportError,
  PaginatedResult,
} from '@/types/crm';

/**
 * CustomerProfile extends the base Customer with related data
 * for the detailed profile view (requirement 2.5).
 */
export interface CustomerProfile extends Customer {
  interactions: CustomerInteraction[];
  invoiceCount: number;
  totalPaid: number;
}

/**
 * Maximum number of tags allowed per customer (requirement 2.6).
 */
const MAX_TAGS_PER_CUSTOMER = 20;

/**
 * Default pagination settings.
 */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

/**
 * Customer Service - CRUD operations with branch-level data isolation.
 *
 * Requirements covered:
 * - 2.1: Create customer records with required/optional fields
 * - 2.3: Create customers manually without an associated lead
 * - 2.4: Filter by name, phone, email, tags, creation date, last interaction date
 * - 2.6: Maximum 20 tags per customer
 * - 2.9: Branch-level data isolation
 * - 2.10: Soft delete with 30-day retention
 */
export const customerService = {
  /**
   * Create a new customer record.
   * Enforces max 20 tags and assigns to the specified branch.
   */
  async create(input: CreateCustomerInput): Promise<Customer> {
    if (input.tags && input.tags.length > MAX_TAGS_PER_CUSTOMER) {
      throw new Error(
        `Maximum ${MAX_TAGS_PER_CUSTOMER} tags allowed per customer. Received ${input.tags.length}.`
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name: input.name,
        phone: input.phone ?? null,
        email: input.email ?? null,
        address: input.address ?? null,
        companyName: input.companyName ?? null,
        tags: input.tags ?? [],
        customFields: input.customFields ?? {},
        notes: input.notes ?? null,
        birthday: input.birthday ?? null,
        anniversary: input.anniversary ?? null,
        branchId: input.branchId,
      },
    });

    return mapPrismaCustomer(customer);
  },

  /**
   * Update an existing customer record.
   * Enforces max 20 tags and branch-level isolation.
   * Only updates fields provided in the input.
   */
  async update(
    id: string,
    branchId: string,
    input: Partial<CreateCustomerInput>
  ): Promise<Customer> {
    // Verify customer exists and belongs to the branch (data isolation)
    const existing = await prisma.customer.findFirst({
      where: {
        id,
        branchId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new Error('Customer not found');
    }

    if (input.tags && input.tags.length > MAX_TAGS_PER_CUSTOMER) {
      throw new Error(
        `Maximum ${MAX_TAGS_PER_CUSTOMER} tags allowed per customer. Received ${input.tags.length}.`
      );
    }

    // Build update data only with provided fields
    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.phone !== undefined) updateData.phone = input.phone ?? null;
    if (input.email !== undefined) updateData.email = input.email ?? null;
    if (input.address !== undefined) updateData.address = input.address ?? null;
    if (input.companyName !== undefined) updateData.companyName = input.companyName ?? null;
    if (input.tags !== undefined) updateData.tags = input.tags;
    if (input.customFields !== undefined) updateData.customFields = input.customFields;
    if (input.notes !== undefined) updateData.notes = input.notes ?? null;
    if (input.birthday !== undefined) updateData.birthday = input.birthday ?? null;
    if (input.anniversary !== undefined) updateData.anniversary = input.anniversary ?? null;

    const updated = await prisma.customer.update({
      where: { id },
      data: updateData,
    });

    return mapPrismaCustomer(updated);
  },

  /**
   * Soft-delete a customer by setting the deletedAt timestamp.
   * The record is retained for 30 days before permanent removal.
   * Enforces branch-level isolation.
   */
  async delete(id: string, branchId: string): Promise<void> {
    const existing = await prisma.customer.findFirst({
      where: {
        id,
        branchId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new Error('Customer not found');
    }

    await prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  /**
   * Get a customer by ID with full profile data (interactions, invoice stats).
   * Enforces branch-level data isolation - never returns customers from other branches.
   */
  async getById(id: string, branchId: string): Promise<CustomerProfile> {
    const customer = await prisma.customer.findFirst({
      where: {
        id,
        branchId,
        deletedAt: null,
      },
      include: {
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 50, // Limit to most recent 50 interactions
        },
        invoices: {
          select: {
            id: true,
            amountPaid: true,
          },
        },
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const invoiceCount = customer.invoices.length;
    const totalPaid = customer.invoices.reduce(
      (sum, inv) => sum + inv.amountPaid,
      0
    );

    return {
      ...mapPrismaCustomer(customer),
      interactions: customer.interactions.map(mapPrismaInteraction),
      invoiceCount,
      totalPaid,
    };
  },

  /**
   * Convert a Lead into a Customer.
   * Populates the Customer record with the Lead's existing data (name, phone, email)
   * and links the Customer to the originating Lead via `leadId`.
   *
   * Requirements covered:
   * - 2.2: Lead-to-Customer conversion with data preservation
   */
  async convertFromLead(leadId: string, branchId: string): Promise<Customer> {
    // 1. Look up the Lead by ID and verify branch ownership
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        branchId,
      },
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    // 2. Check if a Customer is already linked to this Lead (prevent duplicate conversion)
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        leadId,
      },
    });

    if (existingCustomer) {
      throw new Error('Lead has already been converted to a customer');
    }

    // 3. Create a Customer record with the Lead's name, phone, and email
    // 4. Set the leadId field on the Customer to link back to the originating Lead
    const customer = await prisma.customer.create({
      data: {
        name: lead.name,
        phone: lead.phone ?? null,
        email: lead.email ?? null,
        address: null,
        companyName: null,
        tags: [],
        customFields: {},
        notes: null,
        birthday: null,
        anniversary: null,
        branchId,
        leadId,
      },
    });

    return mapPrismaCustomer(customer);
  },

  /**
   * List customers with filtering, pagination, and sorting.
   * Always filters by branchId (data isolation) and excludes soft-deleted records.
   *
   * Supports filtering by:
   * - search: matches against name, phone, or email (case-insensitive)
   * - tags: customers must have ALL specified tags
   * - createdAfter / createdBefore: creation date range
   * - lastInteractionAfter / lastInteractionBefore: last interaction date range
   */
  async list(
    branchId: string,
    filters: CustomerFilters
  ): Promise<PaginatedResult<Customer>> {
    const page = filters.page ?? DEFAULT_PAGE;
    const limit = filters.limit ?? DEFAULT_LIMIT;
    const skip = (page - 1) * limit;
    const sortBy = filters.sortBy ?? 'createdAt';
    const sortOrder = filters.sortOrder ?? 'desc';

    // Build where clause with branch isolation and soft-delete exclusion
    const where: Record<string, unknown> = {
      branchId,
      deletedAt: null,
    };

    // Search filter: match against name, phone, or email
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Tag filter: customer must have ALL specified tags
    if (filters.tags && filters.tags.length > 0) {
      // Use array_contains for JSON array fields - each tag must be present
      where.AND = filters.tags.map((tag) => ({
        tags: { array_contains: [tag] },
      }));
    }

    // Creation date range filters
    if (filters.createdAfter || filters.createdBefore) {
      const createdAt: Record<string, Date> = {};
      if (filters.createdAfter) createdAt.gte = filters.createdAfter;
      if (filters.createdBefore) createdAt.lte = filters.createdBefore;
      where.createdAt = createdAt;
    }

    // Last interaction date range filters
    if (filters.lastInteractionAfter || filters.lastInteractionBefore) {
      const lastInteractionAt: Record<string, Date> = {};
      if (filters.lastInteractionAfter)
        lastInteractionAt.gte = filters.lastInteractionAfter;
      if (filters.lastInteractionBefore)
        lastInteractionAt.lte = filters.lastInteractionBefore;
      where.lastInteractionAt = lastInteractionAt;
    }

    // Execute count and data queries in parallel for performance
    const [total, customers] = await Promise.all([
      prisma.customer.count({ where: where as any }),
      prisma.customer.findMany({
        where: where as any,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: customers.map(mapPrismaCustomer),
      total,
      page,
      limit,
      totalPages,
    };
  },
  /**
   * Import customers from a CSV file buffer.
   * Validates each row and imports valid entries while collecting errors.
   * Requirements: 2.7
   */
  async importFromCSV(file: Buffer, branchId: string): Promise<ImportResult> {
    const csvString = file.toString('utf-8');
    const errors: ImportError[] = [];
    let importedCount = 0;

    const parsed = Papa.parse<Record<string, string>>(csvString, {
      header: true,
      skipEmptyLines: true,
    });

    const totalRows = parsed.data.length;

    for (let i = 0; i < parsed.data.length; i++) {
      const row = parsed.data[i];
      const rowNumber = i + 1; // 1-indexed for user-facing error messages
      const rowErrors: ImportError[] = [];

      // Validate required field: name
      const name = row.name?.trim();
      if (!name) {
        rowErrors.push({
          row: rowNumber,
          field: 'name',
          message: 'Name is required',
        });
      }

      // Validate email format if provided
      const email = row.email?.trim() || undefined;
      if (email && !isValidEmail(email)) {
        rowErrors.push({
          row: rowNumber,
          field: 'email',
          message: 'Invalid email format',
        });
      }

      // Validate phone format if provided (at least 10 digits)
      const phone = row.phone?.trim() || undefined;
      if (phone && !isValidPhone(phone)) {
        rowErrors.push({
          row: rowNumber,
          field: 'phone',
          message: 'Phone must contain at least 10 digits',
        });
      }

      // Parse tags (comma-separated), enforce max 20
      let tags: string[] = [];
      if (row.tags?.trim()) {
        tags = row.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
        if (tags.length > MAX_TAGS_PER_CUSTOMER) {
          rowErrors.push({
            row: rowNumber,
            field: 'tags',
            message: `Maximum ${MAX_TAGS_PER_CUSTOMER} tags allowed, received ${tags.length}`,
          });
        }
      }

      // If there are validation errors for this row, skip it
      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
        continue;
      }

      // Import valid row
      await prisma.customer.create({
        data: {
          name: name!,
          phone: phone ?? null,
          email: email ?? null,
          address: row.address?.trim() || null,
          companyName: row.companyName?.trim() || null,
          tags,
          customFields: {},
          notes: row.notes?.trim() || null,
          branchId,
        },
      });

      importedCount++;
    }

    return {
      totalRows,
      importedCount,
      errorCount: errors.length,
      errors,
    };
  },

  /**
   * Export customers to CSV format with selectable fields.
   * Excludes soft-deleted customers and filters by branch.
   * Requirements: 2.8
   */
  async exportToCSV(branchId: string, fields: string[]): Promise<Buffer> {
    const customers = await prisma.customer.findMany({
      where: {
        branchId,
        deletedAt: null,
      },
    });

    // Map customers to only include the selected fields
    const data = customers.map((customer: any) => {
      const row: Record<string, string> = {};
      for (const field of fields) {
        const value = customer[field];
        if (Array.isArray(value)) {
          row[field] = value.join(',');
        } else if (value instanceof Date) {
          row[field] = value.toISOString();
        } else if (value !== null && value !== undefined) {
          row[field] = String(value);
        } else {
          row[field] = '';
        }
      }
      return row;
    });

    const csv = Papa.unparse(data, { columns: fields });
    return Buffer.from(csv, 'utf-8');
  },
};

// =============================================================================
// Helper functions
// =============================================================================

/**
 * Maps a Prisma customer record to the application Customer type.
 * Handles JSON field deserialization for tags and customFields.
 */
function mapPrismaCustomer(prismaCustomer: any): Customer {
  return {
    id: prismaCustomer.id,
    name: prismaCustomer.name,
    phone: prismaCustomer.phone,
    email: prismaCustomer.email,
    address: prismaCustomer.address,
    companyName: prismaCustomer.companyName,
    tags: Array.isArray(prismaCustomer.tags) ? prismaCustomer.tags : [],
    customFields:
      prismaCustomer.customFields &&
      typeof prismaCustomer.customFields === 'object'
        ? prismaCustomer.customFields
        : {},
    notes: prismaCustomer.notes,
    birthday: prismaCustomer.birthday,
    anniversary: prismaCustomer.anniversary,
    deletedAt: prismaCustomer.deletedAt,
    totalInvoiceValue: prismaCustomer.totalInvoiceValue,
    lastInteractionAt: prismaCustomer.lastInteractionAt,
    branchId: prismaCustomer.branchId,
    leadId: prismaCustomer.leadId,
    createdAt: prismaCustomer.createdAt,
    updatedAt: prismaCustomer.updatedAt,
  };
}

/**
 * Maps a Prisma interaction record to the application CustomerInteraction type.
 */
function mapPrismaInteraction(prismaInteraction: any): CustomerInteraction {
  return {
    id: prismaInteraction.id,
    type: prismaInteraction.type,
    summary: prismaInteraction.summary,
    duration: prismaInteraction.duration,
    attachments: prismaInteraction.attachments,
    metadata: prismaInteraction.metadata,
    loggedById: prismaInteraction.loggedById,
    loggedByName: prismaInteraction.loggedByName,
    customerId: prismaInteraction.customerId,
    createdAt: prismaInteraction.createdAt,
  };
}

/**
 * Validates email format using a standard regex pattern.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number - must contain at least 10 digits.
 */
function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}
