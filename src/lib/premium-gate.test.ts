import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { checkPremiumAccess, withPremiumGate } from './premium-gate';
import type { PremiumGateResult } from './premium-gate';

// Mock dependencies
vi.mock('@/lib/auth-utils', () => ({
  getAuthenticatedUser: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    brand: {
      findUnique: vi.fn(),
    },
  },
}));

import { getAuthenticatedUser } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

const mockGetAuthenticatedUser = vi.mocked(getAuthenticatedUser);
const mockBrandFindUnique = vi.mocked(prisma.brand.findUnique);

function createMockRequest(url = 'http://localhost:3000/api/crm/customers'): NextRequest {
  return new NextRequest(new URL(url));
}

function createBrandWithSubscription(overrides: {
  planName?: string;
  status?: string;
  lastPaymentStatus?: string;
  lastPaymentDate?: Date;
} = {}) {
  const {
    planName = 'Professional',
    status = 'ACTIVE',
    lastPaymentStatus = 'COMPLETED',
    lastPaymentDate = new Date(),
  } = overrides;

  return {
    id: 'brand-123',
    subscription: {
      id: 'sub-123',
      status,
      plan: { id: 'plan-123', name: planName },
      payments: [
        { id: 'pay-1', status: lastPaymentStatus, createdAt: lastPaymentDate },
      ],
    },
    branches: [
      { id: 'branch-1' },
      { id: 'branch-2' },
    ],
  };
}

describe('Premium Gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkPremiumAccess', () => {
    it('should deny access when user is not authenticated', async () => {
      mockGetAuthenticatedUser.mockResolvedValue(null);

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('NO_AUTH');
    });

    it('should deny access when user has no brandId', async () => {
      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: undefined,
        branchIds: [],
      });

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('NO_SUBSCRIPTION');
    });

    it('should deny access when brand has no subscription', async () => {
      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue({
        id: 'brand-123',
        subscription: null,
        branches: [{ id: 'branch-1' }],
      } as any);

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('NO_SUBSCRIPTION');
    });

    it('should deny access when plan is Basic (not premium)', async () => {
      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({ planName: 'Basic' }) as any
      );

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('PLAN_INSUFFICIENT');
      expect(result.brandId).toBe('brand-123');
    });

    it('should grant full access for Professional plan with ACTIVE status', async () => {
      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({ planName: 'Professional', status: 'ACTIVE' }) as any
      );

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      expect(result.allowed).toBe(true);
      expect(result.readOnly).toBe(false);
      expect(result.brandId).toBe('brand-123');
      expect(result.branchIds).toEqual(['branch-1', 'branch-2']);
    });

    it('should grant full access for Enterprise plan with ACTIVE status', async () => {
      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({ planName: 'Enterprise', status: 'ACTIVE' }) as any
      );

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      expect(result.allowed).toBe(true);
      expect(result.readOnly).toBe(false);
    });

    it('should grant read-only access for EXPIRED subscription', async () => {
      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({ planName: 'Professional', status: 'EXPIRED' }) as any
      );

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      expect(result.allowed).toBe(true);
      expect(result.readOnly).toBe(true);
      expect(result.reason).toBe('EXPIRED');
    });

    it('should grant read-only access for CANCELLED subscription', async () => {
      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({ planName: 'Professional', status: 'CANCELLED' }) as any
      );

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      expect(result.allowed).toBe(true);
      expect(result.readOnly).toBe(true);
      expect(result.reason).toBe('EXPIRED');
    });

    it('should grant read-only access during 7-day grace period after failed payment', async () => {
      const failedPaymentDate = new Date();
      failedPaymentDate.setDate(failedPaymentDate.getDate() - 3); // 3 days ago

      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({
          planName: 'Professional',
          status: 'SUSPENDED',
          lastPaymentStatus: 'FAILED',
          lastPaymentDate: failedPaymentDate,
        }) as any
      );

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      expect(result.allowed).toBe(true);
      expect(result.readOnly).toBe(true);
      expect(result.reason).toBe('GRACE_PERIOD');
    });

    it('should deny access after 7-day grace period expires', async () => {
      const failedPaymentDate = new Date();
      failedPaymentDate.setDate(failedPaymentDate.getDate() - 10); // 10 days ago

      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({
          planName: 'Professional',
          status: 'SUSPENDED',
          lastPaymentStatus: 'FAILED',
          lastPaymentDate: failedPaymentDate,
        }) as any
      );

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('EXPIRED');
    });

    it('should grant access on the 6th day of grace period (within 7 days)', async () => {
      const failedPaymentDate = new Date();
      failedPaymentDate.setDate(failedPaymentDate.getDate() - 6); // 6 days ago — still within 7-day window

      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({
          planName: 'Professional',
          status: 'SUSPENDED',
          lastPaymentStatus: 'FAILED',
          lastPaymentDate: failedPaymentDate,
        }) as any
      );

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('GRACE_PERIOD');
    });

    it('should deny access on the 8th day after failed payment', async () => {
      const failedPaymentDate = new Date();
      failedPaymentDate.setDate(failedPaymentDate.getDate() - 8); // 8 days ago — past 7-day window

      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({
          planName: 'Professional',
          status: 'SUSPENDED',
          lastPaymentStatus: 'FAILED',
          lastPaymentDate: failedPaymentDate,
        }) as any
      );

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('EXPIRED');
    });

    it('should include all branch IDs from the brand', async () => {
      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({ planName: 'Professional', status: 'ACTIVE' }) as any
      );

      const result = await checkPremiumAccess(createMockRequest(), 'CRM');

      // Access at Brand level grants access to all Branches
      expect(result.branchIds).toEqual(['branch-1', 'branch-2']);
    });
  });

  describe('withPremiumGate', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetAuthenticatedUser.mockResolvedValue(null);

      const handler = vi.fn();
      const gatedHandler = withPremiumGate('CRM', handler);
      const response = await gatedHandler(createMockRequest());

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.code).toBe('NO_AUTH');
      expect(handler).not.toHaveBeenCalled();
    });

    it('should return 403 with upgrade prompt for insufficient plan', async () => {
      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({ planName: 'Basic' }) as any
      );

      const handler = vi.fn();
      const gatedHandler = withPremiumGate('INVOICING', handler);
      const response = await gatedHandler(createMockRequest());

      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.code).toBe('PLAN_INSUFFICIENT');
      expect(body.upgrade).toBeDefined();
      expect(body.upgrade.plans).toHaveLength(2);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should call handler with context when access is granted', async () => {
      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({ planName: 'Professional', status: 'ACTIVE' }) as any
      );

      const { NextResponse } = await import('next/server');
      const handler = vi.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );

      const gatedHandler = withPremiumGate('CRM', handler);
      const request = createMockRequest();
      const response = await gatedHandler(request);

      expect(handler).toHaveBeenCalledWith(request, expect.objectContaining({
        allowed: true,
        readOnly: false,
        brandId: 'brand-123',
        branchIds: ['branch-1', 'branch-2'],
      }));
      expect(response.status).toBe(200);
    });

    it('should pass read-only context to handler for expired subscriptions', async () => {
      mockGetAuthenticatedUser.mockResolvedValue({
        id: 'user-1',
        userId: 'user-1',
        role: 'BUSINESS_OWNER',
        brandId: 'brand-123',
        branchIds: ['branch-1'],
      });
      mockBrandFindUnique.mockResolvedValue(
        createBrandWithSubscription({ planName: 'Professional', status: 'EXPIRED' }) as any
      );

      const { NextResponse } = await import('next/server');
      const handler = vi.fn().mockResolvedValue(
        NextResponse.json({ data: [] })
      );

      const gatedHandler = withPremiumGate('CRM', handler);
      await gatedHandler(createMockRequest());

      expect(handler).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        allowed: true,
        readOnly: true,
        reason: 'EXPIRED',
      }));
    });
  });
});
