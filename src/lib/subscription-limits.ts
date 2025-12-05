// Subscription limits enforcement and usage tracking

import { prisma } from './prisma';

export interface SubscriptionLimits {
  maxBranches: number;
  customDomain: boolean;
  analytics: boolean;
  qrCodes: boolean;
  leadCapture: boolean;
}

export interface UsageStats {
  currentBranches: number;
  maxBranches: number;
  hasCustomDomain: boolean;
  canAddBranch: boolean;
  percentageUsed: number;
}

export async function getSubscriptionLimits(brandId: string): Promise<SubscriptionLimits> {
  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    include: {
      subscription: {
        include: {
          plan: true,
        },
      },
    },
  });

  if (!brand?.subscription?.plan) {
    // Default free tier limits
    return {
      maxBranches: 1,
      customDomain: false,
      analytics: false,
      qrCodes: false,
      leadCapture: true,
    };
  }

  const features = brand.subscription.plan.features as unknown as SubscriptionLimits;
  return features;
}

export async function getUsageStats(brandId: string): Promise<UsageStats> {
  const [branchCount, limits, brand] = await Promise.all([
    prisma.branch.count({ where: { brandId } }),
    getSubscriptionLimits(brandId),
    prisma.brand.findUnique({ where: { id: brandId } }),
  ]);

  const percentageUsed = limits.maxBranches > 0
    ? Math.round((branchCount / limits.maxBranches) * 100)
    : 0;

  return {
    currentBranches: branchCount,
    maxBranches: limits.maxBranches,
    hasCustomDomain: !!brand?.customDomain,
    canAddBranch: branchCount < limits.maxBranches,
    percentageUsed,
  };
}

export async function canAddBranch(brandId: string): Promise<{ allowed: boolean; reason?: string }> {
  const stats = await getUsageStats(brandId);

  if (!stats.canAddBranch) {
    return {
      allowed: false,
      reason: `Branch limit reached. You have ${stats.currentBranches} of ${stats.maxBranches} branches. Upgrade your plan to add more.`,
    };
  }

  return { allowed: true };
}

export async function checkFeatureAccess(
  brandId: string,
  feature: keyof SubscriptionLimits
): Promise<boolean> {
  const limits = await getSubscriptionLimits(brandId);
  return !!limits[feature];
}
