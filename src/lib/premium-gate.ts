/**
 * Premium Gate Middleware
 *
 * Controls access to premium features (CRM, Invoicing, Expenses, Revenue Dashboard)
 * based on the Brand's subscription plan and status.
 *
 * Access is enforced at the Brand level, granting access to all Branches within
 * the subscribed Brand.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// ============================================================================
// Types
// ============================================================================

export type PremiumFeature = 'CRM' | 'INVOICING' | 'EXPENSES' | 'REVENUE_DASHBOARD';

export interface PremiumGateResult {
  allowed: boolean;
  reason?: 'NO_AUTH' | 'NO_SUBSCRIPTION' | 'PLAN_INSUFFICIENT' | 'EXPIRED' | 'GRACE_PERIOD';
  readOnly?: boolean;
  brandId?: string;
  branchIds?: string[];
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Plan names that grant premium feature access.
 * Matches against SubscriptionPlan.name (case-insensitive comparison).
 */
const PREMIUM_PLANS = ['PRO', 'PROFESSIONAL', 'BUSINESS_PLUS', 'ENTERPRISE'];

/**
 * Number of days after a payment failure before access is revoked.
 */
const GRACE_PERIOD_DAYS = 7;

// ============================================================================
// Core Logic
// ============================================================================

/**
 * Checks whether the authenticated user has premium access for a given feature.
 *
 * Logic:
 * 1. Authenticate user from request
 * 2. Resolve the user's Brand and its subscription
 * 3. Check if the plan qualifies for premium features
 * 4. Check subscription status:
 *    - ACTIVE → full access
 *    - EXPIRED / CANCELLED → read-only access
 *    - SUSPENDED (failed payment) → check 7-day grace period
 */
export async function checkPremiumAccess(
  request: NextRequest,
  feature: PremiumFeature
): Promise<PremiumGateResult> {
  // Step 1: Authenticate
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return { allowed: false, reason: 'NO_AUTH' };
  }

  // Step 2: Resolve Brand with subscription
  const brandId = user.brandId;

  if (!brandId) {
    return { allowed: false, reason: 'NO_SUBSCRIPTION' };
  }

  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    include: {
      subscription: {
        include: {
          plan: true,
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
      branches: {
        select: { id: true },
      },
    },
  });

  if (!brand || !brand.subscription) {
    return { allowed: false, reason: 'NO_SUBSCRIPTION', brandId };
  }

  const subscription = brand.subscription;
  const plan = subscription.plan;
  const branchIds = brand.branches.map((b) => b.id);

  // Step 3: Check if plan qualifies
  const planName = plan.name.toUpperCase().replace(/\s+/g, '_');
  const isPremiumPlan = PREMIUM_PLANS.some(
    (premiumName) => premiumName === planName || plan.name.toUpperCase() === premiumName
  );

  if (!isPremiumPlan) {
    return {
      allowed: false,
      reason: 'PLAN_INSUFFICIENT',
      brandId,
      branchIds,
    };
  }

  // Step 4: Check subscription status
  switch (subscription.status) {
    case 'ACTIVE': {
      // Full unrestricted access
      return {
        allowed: true,
        readOnly: false,
        brandId,
        branchIds,
      };
    }

    case 'EXPIRED':
    case 'CANCELLED': {
      // Data accessible but not modifiable (read-only mode)
      return {
        allowed: true,
        reason: 'EXPIRED',
        readOnly: true,
        brandId,
        branchIds,
      };
    }

    case 'SUSPENDED': {
      // Check for grace period — 7 days from the last failed payment
      const lastPayment = subscription.payments[0];

      if (lastPayment && lastPayment.status === 'FAILED') {
        const failedAt = new Date(lastPayment.createdAt);
        const gracePeriodEnd = new Date(failedAt);
        gracePeriodEnd.setDate(gracePeriodEnd.getDate() + GRACE_PERIOD_DAYS);

        const now = new Date();

        if (now <= gracePeriodEnd) {
          // Within grace period — allow access in read-only mode
          return {
            allowed: true,
            reason: 'GRACE_PERIOD',
            readOnly: true,
            brandId,
            branchIds,
          };
        }
      }

      // Grace period expired or no failed payment record — revoke access
      return {
        allowed: false,
        reason: 'EXPIRED',
        brandId,
        branchIds,
      };
    }

    default: {
      return { allowed: false, reason: 'NO_SUBSCRIPTION', brandId };
    }
  }
}

// ============================================================================
// Higher-Order Function Wrapper
// ============================================================================

/**
 * Wraps an API route handler with premium gate enforcement.
 *
 * If the user does not have access, returns a 401 (unauthenticated) or
 * 403 (insufficient plan/expired) response with upgrade prompt data.
 *
 * If the user has access (full or read-only), the handler receives the
 * PremiumGateResult as context so it can enforce read-only restrictions.
 */
export function withPremiumGate(
  feature: PremiumFeature,
  handler: (req: NextRequest, context: PremiumGateResult) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest): Promise<NextResponse> => {
    const result = await checkPremiumAccess(req, feature);

    if (!result.allowed) {
      // Determine HTTP status
      if (result.reason === 'NO_AUTH') {
        return NextResponse.json(
          {
            error: 'Authentication required',
            code: 'NO_AUTH',
          },
          { status: 401 }
        );
      }

      // 403 for insufficient plan or expired access
      return NextResponse.json(
        {
          error: 'Premium subscription required',
          code: result.reason,
          upgrade: {
            message: getUpgradeMessage(result.reason),
            plans: [
              { name: 'Professional', price: 1999, features: ['CRM', 'Invoicing', 'Expenses', 'Revenue Dashboard'] },
              { name: 'Enterprise', price: 4999, features: ['All Professional features', 'Unlimited branches', 'API access', 'White label'] },
            ],
          },
        },
        { status: 403 }
      );
    }

    // Access granted — forward to handler
    return handler(req, result);
  };
}

// ============================================================================
// Helpers
// ============================================================================

function getUpgradeMessage(reason?: string): string {
  switch (reason) {
    case 'NO_SUBSCRIPTION':
      return 'Subscribe to a premium plan to access CRM and invoicing features.';
    case 'PLAN_INSUFFICIENT':
      return 'Upgrade to Professional or Enterprise plan to unlock CRM and invoicing features.';
    case 'EXPIRED':
      return 'Your subscription has expired. Renew to regain full access to premium features.';
    default:
      return 'A premium subscription is required to access this feature.';
  }
}
