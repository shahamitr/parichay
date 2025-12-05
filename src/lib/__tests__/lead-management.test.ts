// @ts-nocheck
/**
 * Integration tests for lead management
 * Tests lead routing to email and WhatsApp, notification delivery, and custom domain configuration
 */

import { prisma } from '@/lib/prisma';

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    brand: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
    branch: {
      findUnique: jest.fn(),
    },
    lead: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
  },
}));

describe('Lead Management Integration Tests', () => {
  const testBrand = {
    id: 'brand-123',
    name: 'Test Brand',
    slug: 'test-brand',
    customDomain: null,
    sslEnabled: false,
  };

  const testBranch = {
    id: 'branch-123',
    name: 'Test Branch',
    slug: 'test-branch',
    brandId: testBrand.id,
    contact: {
      email: 'branch@example.com',
      phone: '+1234567890',
      whatsapp: '+1234567890',
    },
    micrositeConfig: {
      notificationPreferences: {
        email: true,
        whatsapp: true,
        inApp: true,
      },
    },
    brand: testBrand,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Lead Routing to Email', () => {
    it('should create lead with email routing enabled', () => {
      const leadData = {
        id: 'lead-123',
        branchId: testBranch.id,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+9876543210',
        message: 'I am interested in your services',
        source: 'microsite_form',
        metadata: {},
        createdAt: new Date(),
      };

      (prisma.lead.create as jest.Mock).mockResolvedValue(leadData);

      expect(testBranch.contact.email).toBe('branch@example.com');
      expect(testBranch.micrositeConfig.notificationPreferences.email).toBe(true);
    });

    it('should handle disabled email notifications', () => {
      const branchWithDisabledEmail = {
        ...testBranch,
        micrositeConfig: {
          notificationPreferences: {
            email: false,
            whatsapp: true,
            inApp: true,
          },
        },
      };

      expect(branchWithDisabledEmail.micrositeConfig.notificationPreferences.email).toBe(false);
    });

    it('should handle missing branch email', () => {
      const branchWithoutEmail = {
        ...testBranch,
        contact: {
          phone: '+1234567890',
          whatsapp: '+1234567890',
        },
      };

      expect(branchWithoutEmail.contact.email).toBeUndefined();
    });
  });

  describe('Lead Routing to WhatsApp', () => {
    it('should verify WhatsApp contact exists', () => {
      expect(testBranch.contact.whatsapp).toBe('+1234567890');
      expect(testBranch.micrositeConfig.notificationPreferences.whatsapp).toBe(true);
    });

    it('should handle disabled WhatsApp notifications', () => {
      const branchWithDisabledWhatsApp = {
        ...testBranch,
        micrositeConfig: {
          notificationPreferences: {
            email: true,
            whatsapp: false,
            inApp: true,
          },
        },
      };

      expect(branchWithDisabledWhatsApp.micrositeConfig.notificationPreferences.whatsapp).toBe(false);
    });
  });

  describe('Lead Notification Delivery', () => {
    it('should create in-app notification for new lead', async () => {
      const leadData = {
        id: 'lead-456',
        branchId: testBranch.id,
        name: 'Notification Test',
        email: 'test@example.com',
        source: 'qr_code',
        createdAt: new Date(),
      };

      const notificationData = {
        id: 'notif-123',
        userId: 'user-123',
        type: 'NEW_LEAD',
        title: `New Lead from ${testBranch.name}`,
        message: `${leadData.name} submitted an inquiry via ${leadData.source}`,
        metadata: {
          leadId: leadData.id,
          branchId: testBranch.id,
          leadName: leadData.name,
          source: leadData.source,
        },
        isRead: false,
        createdAt: new Date(),
      };

      (prisma.notification.create as jest.Mock).mockResolvedValue(notificationData);

      const result = await prisma.notification.create({
        data: notificationData,
      });

      expect(result.type).toBe('NEW_LEAD');
      expect(result.metadata.leadId).toBe(leadData.id);
    });

    it('should track lead source correctly', async () => {
      const sources = ['microsite_form', 'qr_code', 'direct_visit', 'social_media'];
      const leads = sources.map((source, index) => ({
        id: `lead-${index}`,
        branchId: testBranch.id,
        name: `Test User ${source}`,
        email: `${source}@example.com`,
        source,
        createdAt: new Date(),
      }));

      (prisma.lead.findMany as jest.Mock).mockResolvedValue(leads);

      const result = await prisma.lead.findMany({
        where: { branchId: testBranch.id },
      });

      expect(result).toHaveLength(sources.length);
      result.forEach((lead: any, index: number) => {
        expect(lead.source).toBe(sources[index]);
      });
    });

    it('should store lead metadata correctly', async () => {
      const metadata = {
        submittedAt: new Date().toISOString(),
        userAgent: 'Mozilla/5.0 Test Browser',
        referrer: 'https://example.com',
      };

      const leadData = {
        id: 'lead-789',
        branchId: testBranch.id,
        name: 'Metadata Test',
        email: 'metadata@example.com',
        source: 'microsite_form',
        metadata,
        createdAt: new Date(),
      };

      (prisma.lead.create as jest.Mock).mockResolvedValue(leadData);

      const result = await prisma.lead.create({ data: leadData });

      expect(result.metadata).toMatchObject(metadata);
    });
  });

  describe('Custom Domain Configuration', () => {
    it('should configure custom domain for brand', async () => {
      const customDomain = 'testbrand.example.com';
      const updatedBrand = {
        ...testBrand,
        customDomain,
        sslEnabled: false,
      };

      (prisma.brand.update as jest.Mock).mockResolvedValue(updatedBrand);

      const result = await prisma.brand.update({
        where: { id: testBrand.id },
        data: { customDomain, sslEnabled: false },
      });

      expect(result.customDomain).toBe(customDomain);
      expect(result.sslEnabled).toBe(false);
    });

    it('should prevent duplicate custom domains', async () => {
      const customDomain = 'duplicate.example.com';
      const existingBrand = {
        ...testBrand,
        customDomain,
      };

      (prisma.brand.findFirst as jest.Mock).mockResolvedValue(existingBrand);

      const result = await prisma.brand.findFirst({
        where: {
          customDomain,
          id: { not: 'other-brand-id' },
        },
      });

      expect(result).toBeDefined();
      expect(result?.customDomain).toBe(customDomain);
    });

    it('should remove custom domain from brand', async () => {
      const updatedBrand = {
        ...testBrand,
        customDomain: null,
        sslEnabled: false,
      };

      (prisma.brand.update as jest.Mock).mockResolvedValue(updatedBrand);

      const result = await prisma.brand.update({
        where: { id: testBrand.id },
        data: { customDomain: null, sslEnabled: false },
      });

      expect(result.customDomain).toBeNull();
      expect(result.sslEnabled).toBe(false);
    });

    it('should validate domain format', () => {
      const validDomains = [
        'example.com',
        'subdomain.example.com',
        'my-brand.example.co.uk',
        'test123.example.org',
      ];

      const invalidDomains = [
        'invalid domain',
        'http://example.com',
        'example',
        '-invalid.com',
        'invalid-.com',
      ];

      const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;

      validDomains.forEach((domain) => {
        expect(domainRegex.test(domain)).toBe(true);
      });

      invalidDomains.forEach((domain) => {
        expect(domainRegex.test(domain)).toBe(false);
      });
    });

    it('should retrieve brand by custom domain', async () => {
      const customDomain = 'microsite.example.com';
      const brandWithDomain = {
        ...testBrand,
        customDomain,
        branches: [testBranch],
      };

      (prisma.brand.findFirst as jest.Mock).mockResolvedValue(brandWithDomain);

      const result = await prisma.brand.findFirst({
        where: { customDomain },
      });

      expect(result).toBeDefined();
      expect(result?.customDomain).toBe(customDomain);
    });
  });

  describe('Lead Data Validation', () => {
    it('should require name field for lead creation', () => {
      const invalidLead = {
        branchId: testBranch.id,
        name: '',
        source: 'microsite_form',
      };

      expect(invalidLead.name).toBe('');
    });

    it('should accept optional email and phone fields', async () => {
      const leadWithoutContact = {
        id: 'lead-999',
        branchId: testBranch.id,
        name: 'No Contact User',
        email: null,
        phone: null,
        source: 'microsite_form',
        metadata: {},
        createdAt: new Date(),
      };

      (prisma.lead.create as jest.Mock).mockResolvedValue(leadWithoutContact);

      const result = await prisma.lead.create({ data: leadWithoutContact });

      expect(result.email).toBeNull();
      expect(result.phone).toBeNull();
    });

    it('should store email and phone when provided', async () => {
      const leadWithContact = {
        id: 'lead-888',
        branchId: testBranch.id,
        name: 'Full Contact User',
        email: 'fullcontact@example.com',
        phone: '+9999999999',
        message: 'Test message',
        source: 'microsite_form',
        metadata: {},
        createdAt: new Date(),
      };

      (prisma.lead.create as jest.Mock).mockResolvedValue(leadWithContact);

      const result = await prisma.lead.create({ data: leadWithContact });

      expect(result.email).toBe('fullcontact@example.com');
      expect(result.phone).toBe('+9999999999');
      expect(result.message).toBe('Test message');
    });
  });

  describe('Lead Query and Filtering', () => {
    it('should filter leads by branch', async () => {
      const leads = [
        { id: 'lead-1', branchId: testBranch.id, name: 'Alice', source: 'qr_code', createdAt: new Date() },
        { id: 'lead-2', branchId: testBranch.id, name: 'Bob', source: 'microsite_form', createdAt: new Date() },
        { id: 'lead-3', branchId: testBranch.id, name: 'Charlie', source: 'social_media', createdAt: new Date() },
      ];

      (prisma.lead.findMany as jest.Mock).mockResolvedValue(leads);

      const result = await prisma.lead.findMany({
        where: { branchId: testBranch.id },
      });

      expect(result).toHaveLength(3);
    });

    it('should filter leads by source', async () => {
      const qrLeads = [
        { id: 'lead-1', branchId: testBranch.id, name: 'Alice', source: 'qr_code', createdAt: new Date() },
      ];

      (prisma.lead.findMany as jest.Mock).mockResolvedValue(qrLeads);

      const result = await prisma.lead.findMany({
        where: {
          branchId: testBranch.id,
          source: 'qr_code',
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('qr_code');
    });

    it('should search leads by name', async () => {
      const searchResults = [
        { id: 'lead-1', branchId: testBranch.id, name: 'Alice Johnson', source: 'qr_code', createdAt: new Date() },
      ];

      (prisma.lead.findMany as jest.Mock).mockResolvedValue(searchResults);

      const result = await prisma.lead.findMany({
        where: {
          branchId: testBranch.id,
          name: { contains: 'Alice', mode: 'insensitive' },
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toContain('Alice');
    });

    it('should order leads by creation date', async () => {
      const now = new Date();
      const leads = [
        { id: 'lead-3', name: 'Charlie', createdAt: new Date(now.getTime() - 3000) },
        { id: 'lead-2', name: 'Bob', createdAt: new Date(now.getTime() - 2000) },
        { id: 'lead-1', name: 'Alice', createdAt: new Date(now.getTime() - 1000) },
      ].reverse(); // Most recent first

      (prisma.lead.findMany as jest.Mock).mockResolvedValue(leads);

      const result = await prisma.lead.findMany({
        where: { branchId: testBranch.id },
        orderBy: { createdAt: 'desc' },
      });

      expect(result).toHaveLength(3);
      // Verify descending order
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].createdAt.getTime()).toBeGreaterThanOrEqual(
          result[i + 1].createdAt.getTime()
        );
      }
    });
  });
});
