import { describe, it, expect, vi, beforeEach } from 'vitest';
import { customerService } from './customer-service';

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    customer: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    lead: {
      findFirst: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

const mockPrisma = prisma as any;

describe('Customer Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a customer with required and optional fields', async () => {
      const input = {
        name: 'John Doe',
        phone: '+919876543210',
        email: 'john@example.com',
        tags: ['vip', 'regular'],
        branchId: 'branch-1',
      };

      const mockCreated = {
        id: 'cust-1',
        ...input,
        address: null,
        companyName: null,
        customFields: {},
        notes: null,
        birthday: null,
        anniversary: null,
        deletedAt: null,
        totalInvoiceValue: 0,
        lastInteractionAt: null,
        leadId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.customer.create.mockResolvedValue(mockCreated);

      const result = await customerService.create(input);

      expect(result.name).toBe('John Doe');
      expect(result.phone).toBe('+919876543210');
      expect(result.email).toBe('john@example.com');
      expect(result.tags).toEqual(['vip', 'regular']);
      expect(result.branchId).toBe('branch-1');
      expect(result.deletedAt).toBeNull();
    });

    it('should reject creation with more than 20 tags', async () => {
      const input = {
        name: 'John Doe',
        tags: Array.from({ length: 21 }, (_, i) => `tag-${i}`),
        branchId: 'branch-1',
      };

      await expect(customerService.create(input)).rejects.toThrow(
        'Maximum 20 tags allowed per customer'
      );
      expect(mockPrisma.customer.create).not.toHaveBeenCalled();
    });

    it('should allow creation with exactly 20 tags', async () => {
      const tags = Array.from({ length: 20 }, (_, i) => `tag-${i}`);
      const input = {
        name: 'John Doe',
        tags,
        branchId: 'branch-1',
      };

      mockPrisma.customer.create.mockResolvedValue({
        id: 'cust-1',
        ...input,
        phone: null,
        email: null,
        address: null,
        companyName: null,
        customFields: {},
        notes: null,
        birthday: null,
        anniversary: null,
        deletedAt: null,
        totalInvoiceValue: 0,
        lastInteractionAt: null,
        leadId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await customerService.create(input);
      expect(result.tags).toHaveLength(20);
    });

    it('should default tags and customFields when not provided', async () => {
      const input = {
        name: 'Jane Doe',
        branchId: 'branch-1',
      };

      mockPrisma.customer.create.mockResolvedValue({
        id: 'cust-2',
        name: 'Jane Doe',
        phone: null,
        email: null,
        address: null,
        companyName: null,
        tags: [],
        customFields: {},
        notes: null,
        birthday: null,
        anniversary: null,
        deletedAt: null,
        totalInvoiceValue: 0,
        lastInteractionAt: null,
        branchId: 'branch-1',
        leadId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await customerService.create(input);
      expect(result.tags).toEqual([]);
      expect(result.customFields).toEqual({});
    });
  });

  describe('update', () => {
    it('should update only provided fields', async () => {
      const existing = {
        id: 'cust-1',
        name: 'John Doe',
        branchId: 'branch-1',
        deletedAt: null,
      };

      mockPrisma.customer.findFirst.mockResolvedValue(existing);
      mockPrisma.customer.update.mockResolvedValue({
        ...existing,
        name: 'John Updated',
        phone: null,
        email: 'new@example.com',
        address: null,
        companyName: null,
        tags: [],
        customFields: {},
        notes: null,
        birthday: null,
        anniversary: null,
        totalInvoiceValue: 0,
        lastInteractionAt: null,
        leadId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await customerService.update('cust-1', 'branch-1', {
        name: 'John Updated',
        email: 'new@example.com',
      });

      expect(result.name).toBe('John Updated');
      expect(result.email).toBe('new@example.com');
    });

    it('should throw error when customer not found', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue(null);

      await expect(
        customerService.update('nonexistent', 'branch-1', { name: 'Test' })
      ).rejects.toThrow('Customer not found');
    });

    it('should enforce branch isolation on update (customer from other branch)', async () => {
      // findFirst returns null because branchId doesn't match
      mockPrisma.customer.findFirst.mockResolvedValue(null);

      await expect(
        customerService.update('cust-1', 'other-branch', { name: 'Hacker' })
      ).rejects.toThrow('Customer not found');
    });

    it('should reject update with more than 20 tags', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        branchId: 'branch-1',
        deletedAt: null,
      });

      await expect(
        customerService.update('cust-1', 'branch-1', {
          tags: Array.from({ length: 21 }, (_, i) => `tag-${i}`),
        })
      ).rejects.toThrow('Maximum 20 tags allowed per customer');
    });
  });

  describe('delete (soft)', () => {
    it('should set deletedAt timestamp for soft delete', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        branchId: 'branch-1',
        deletedAt: null,
      });
      mockPrisma.customer.update.mockResolvedValue({});

      await customerService.delete('cust-1', 'branch-1');

      expect(mockPrisma.customer.update).toHaveBeenCalledWith({
        where: { id: 'cust-1' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw error when customer not found or already deleted', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue(null);

      await expect(
        customerService.delete('cust-1', 'branch-1')
      ).rejects.toThrow('Customer not found');
    });

    it('should enforce branch isolation on delete', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue(null);

      await expect(
        customerService.delete('cust-1', 'other-branch')
      ).rejects.toThrow('Customer not found');
    });
  });

  describe('getById', () => {
    it('should return customer profile with interactions and invoice stats', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        name: 'John Doe',
        phone: '+919876543210',
        email: 'john@example.com',
        address: '123 Main St',
        companyName: 'Acme Corp',
        tags: ['vip'],
        customFields: { preference: 'email' },
        notes: 'Important customer',
        birthday: null,
        anniversary: null,
        deletedAt: null,
        totalInvoiceValue: 5000,
        lastInteractionAt: new Date('2024-01-15'),
        branchId: 'branch-1',
        leadId: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
        interactions: [
          {
            id: 'int-1',
            type: 'PHONE_CALL',
            summary: 'Discussed project',
            duration: 300,
            attachments: null,
            metadata: null,
            loggedById: 'user-1',
            loggedByName: 'Admin',
            customerId: 'cust-1',
            createdAt: new Date('2024-01-15'),
          },
        ],
        invoices: [
          { id: 'inv-1', amountPaid: 3000 },
          { id: 'inv-2', amountPaid: 2000 },
        ],
      });

      const result = await customerService.getById('cust-1', 'branch-1');

      expect(result.name).toBe('John Doe');
      expect(result.interactions).toHaveLength(1);
      expect(result.invoiceCount).toBe(2);
      expect(result.totalPaid).toBe(5000);
    });

    it('should throw error when customer not found', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue(null);

      await expect(
        customerService.getById('nonexistent', 'branch-1')
      ).rejects.toThrow('Customer not found');
    });

    it('should enforce branch isolation on getById', async () => {
      mockPrisma.customer.findFirst.mockResolvedValue(null);

      await expect(
        customerService.getById('cust-1', 'other-branch')
      ).rejects.toThrow('Customer not found');
    });
  });

  describe('list', () => {
    it('should return paginated results with defaults', async () => {
      const customers = [
        {
          id: 'cust-1',
          name: 'John Doe',
          phone: null,
          email: null,
          address: null,
          companyName: null,
          tags: [],
          customFields: {},
          notes: null,
          birthday: null,
          anniversary: null,
          deletedAt: null,
          totalInvoiceValue: 0,
          lastInteractionAt: null,
          branchId: 'branch-1',
          leadId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.customer.count.mockResolvedValue(1);
      mockPrisma.customer.findMany.mockResolvedValue(customers);

      const result = await customerService.list('branch-1', {});

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
    });

    it('should calculate totalPages correctly', async () => {
      mockPrisma.customer.count.mockResolvedValue(45);
      mockPrisma.customer.findMany.mockResolvedValue([]);

      const result = await customerService.list('branch-1', { limit: 20 });

      expect(result.totalPages).toBe(3); // ceil(45/20) = 3
    });

    it('should always filter by branchId and exclude soft-deleted', async () => {
      mockPrisma.customer.count.mockResolvedValue(0);
      mockPrisma.customer.findMany.mockResolvedValue([]);

      await customerService.list('branch-1', {});

      const countCall = mockPrisma.customer.count.mock.calls[0][0];
      expect(countCall.where.branchId).toBe('branch-1');
      expect(countCall.where.deletedAt).toBeNull();
    });

    it('should apply search filter across name, phone, and email', async () => {
      mockPrisma.customer.count.mockResolvedValue(0);
      mockPrisma.customer.findMany.mockResolvedValue([]);

      await customerService.list('branch-1', { search: 'john' });

      const countCall = mockPrisma.customer.count.mock.calls[0][0];
      expect(countCall.where.OR).toEqual([
        { name: { contains: 'john', mode: 'insensitive' } },
        { phone: { contains: 'john', mode: 'insensitive' } },
        { email: { contains: 'john', mode: 'insensitive' } },
      ]);
    });

    it('should apply tag filters requiring all tags to be present', async () => {
      mockPrisma.customer.count.mockResolvedValue(0);
      mockPrisma.customer.findMany.mockResolvedValue([]);

      await customerService.list('branch-1', { tags: ['vip', 'premium'] });

      const countCall = mockPrisma.customer.count.mock.calls[0][0];
      expect(countCall.where.AND).toEqual([
        { tags: { array_contains: ['vip'] } },
        { tags: { array_contains: ['premium'] } },
      ]);
    });

    it('should apply date range filters', async () => {
      mockPrisma.customer.count.mockResolvedValue(0);
      mockPrisma.customer.findMany.mockResolvedValue([]);

      const after = new Date('2024-01-01');
      const before = new Date('2024-12-31');

      await customerService.list('branch-1', {
        createdAfter: after,
        createdBefore: before,
      });

      const countCall = mockPrisma.customer.count.mock.calls[0][0];
      expect(countCall.where.createdAt).toEqual({
        gte: after,
        lte: before,
      });
    });

    it('should apply last interaction date filters', async () => {
      mockPrisma.customer.count.mockResolvedValue(0);
      mockPrisma.customer.findMany.mockResolvedValue([]);

      const after = new Date('2024-06-01');

      await customerService.list('branch-1', {
        lastInteractionAfter: after,
      });

      const countCall = mockPrisma.customer.count.mock.calls[0][0];
      expect(countCall.where.lastInteractionAt).toEqual({
        gte: after,
      });
    });

    it('should respect pagination parameters', async () => {
      mockPrisma.customer.count.mockResolvedValue(50);
      mockPrisma.customer.findMany.mockResolvedValue([]);

      await customerService.list('branch-1', { page: 3, limit: 10 });

      const findCall = mockPrisma.customer.findMany.mock.calls[0][0];
      expect(findCall.skip).toBe(20); // (3-1) * 10
      expect(findCall.take).toBe(10);
    });

    it('should apply sorting', async () => {
      mockPrisma.customer.count.mockResolvedValue(0);
      mockPrisma.customer.findMany.mockResolvedValue([]);

      await customerService.list('branch-1', {
        sortBy: 'totalInvoiceValue',
        sortOrder: 'desc',
      });

      const findCall = mockPrisma.customer.findMany.mock.calls[0][0];
      expect(findCall.orderBy).toEqual({ totalInvoiceValue: 'desc' });
    });
  });

  describe('convertFromLead', () => {
    it('should convert a lead to a customer with lead data', async () => {
      const mockLead = {
        id: 'lead-1',
        name: 'Jane Smith',
        phone: '+919876543210',
        email: 'jane@example.com',
        branchId: 'branch-1',
        status: 'CONVERTED',
      };

      const mockCreatedCustomer = {
        id: 'cust-new',
        name: 'Jane Smith',
        phone: '+919876543210',
        email: 'jane@example.com',
        address: null,
        companyName: null,
        tags: [],
        customFields: {},
        notes: null,
        birthday: null,
        anniversary: null,
        deletedAt: null,
        totalInvoiceValue: 0,
        lastInteractionAt: null,
        branchId: 'branch-1',
        leadId: 'lead-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.lead.findFirst.mockResolvedValue(mockLead);
      // First findFirst call is for lead, second is for checking existing customer
      mockPrisma.customer.findFirst.mockResolvedValue(null);
      mockPrisma.customer.create.mockResolvedValue(mockCreatedCustomer);

      const result = await customerService.convertFromLead('lead-1', 'branch-1');

      expect(result.name).toBe('Jane Smith');
      expect(result.phone).toBe('+919876543210');
      expect(result.email).toBe('jane@example.com');
      expect(result.leadId).toBe('lead-1');
      expect(result.branchId).toBe('branch-1');
      expect(mockPrisma.customer.create).toHaveBeenCalledWith({
        data: {
          name: 'Jane Smith',
          phone: '+919876543210',
          email: 'jane@example.com',
          address: null,
          companyName: null,
          tags: [],
          customFields: {},
          notes: null,
          birthday: null,
          anniversary: null,
          branchId: 'branch-1',
          leadId: 'lead-1',
        },
      });
    });

    it('should handle lead with null phone and email', async () => {
      const mockLead = {
        id: 'lead-2',
        name: 'No Contact Info',
        phone: null,
        email: null,
        branchId: 'branch-1',
        status: 'NEW',
      };

      const mockCreatedCustomer = {
        id: 'cust-new-2',
        name: 'No Contact Info',
        phone: null,
        email: null,
        address: null,
        companyName: null,
        tags: [],
        customFields: {},
        notes: null,
        birthday: null,
        anniversary: null,
        deletedAt: null,
        totalInvoiceValue: 0,
        lastInteractionAt: null,
        branchId: 'branch-1',
        leadId: 'lead-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.lead.findFirst.mockResolvedValue(mockLead);
      mockPrisma.customer.findFirst.mockResolvedValue(null);
      mockPrisma.customer.create.mockResolvedValue(mockCreatedCustomer);

      const result = await customerService.convertFromLead('lead-2', 'branch-1');

      expect(result.name).toBe('No Contact Info');
      expect(result.phone).toBeNull();
      expect(result.email).toBeNull();
      expect(result.leadId).toBe('lead-2');
    });

    it('should throw error when lead not found', async () => {
      mockPrisma.lead.findFirst.mockResolvedValue(null);

      await expect(
        customerService.convertFromLead('nonexistent', 'branch-1')
      ).rejects.toThrow('Lead not found');
      expect(mockPrisma.customer.create).not.toHaveBeenCalled();
    });

    it('should enforce branch isolation - lead from different branch', async () => {
      mockPrisma.lead.findFirst.mockResolvedValue(null);

      await expect(
        customerService.convertFromLead('lead-1', 'other-branch')
      ).rejects.toThrow('Lead not found');
      expect(mockPrisma.customer.create).not.toHaveBeenCalled();
    });

    it('should prevent duplicate conversion when customer already linked to lead', async () => {
      const mockLead = {
        id: 'lead-1',
        name: 'Jane Smith',
        phone: '+919876543210',
        email: 'jane@example.com',
        branchId: 'branch-1',
        status: 'CONVERTED',
      };

      const existingCustomer = {
        id: 'cust-existing',
        leadId: 'lead-1',
        branchId: 'branch-1',
      };

      mockPrisma.lead.findFirst.mockResolvedValue(mockLead);
      mockPrisma.customer.findFirst.mockResolvedValue(existingCustomer);

      await expect(
        customerService.convertFromLead('lead-1', 'branch-1')
      ).rejects.toThrow('Lead has already been converted to a customer');
      expect(mockPrisma.customer.create).not.toHaveBeenCalled();
    });
  });
});
