/**
 * Feature Flag Service — DB-backed, no external paid service.
 * Supports: global toggles, role-based, plan-based, and percentage rollouts.
 */

import { prisma } from './prisma';
import { withCache, cacheDel } from './cache';

interface FeatureFlagRules {
  roles?: string[];       // Enabled for specific roles
  plans?: string[];       // Enabled for specific subscription plans
  userIds?: string[];     // Enabled for specific users
  percentage?: number;    // Percentage rollout (0-100)
}

interface FeatureFlagContext {
  userId?: string;
  role?: string;
  planId?: string;
}

/**
 * Check if a feature flag is enabled for a given context.
 */
export async function isFeatureEnabled(
  key: string,
  context?: FeatureFlagContext
): Promise<boolean> {
  const flag = await withCache(
    `ff:${key}`,
    async () => {
      return prisma.featureFlag.findUnique({ where: { key } });
    },
    120 // Cache for 2 minutes
  );

  if (!flag) return false;
  if (!flag.isEnabled) return false;

  // If no rules, flag is globally enabled
  const rules = flag.rules as FeatureFlagRules | null;
  if (!rules) return true;

  // Check user-specific override
  if (rules.userIds && context?.userId) {
    if (rules.userIds.includes(context.userId)) return true;
  }

  // Check role-based access
  if (rules.roles && rules.roles.length > 0 && context?.role) {
    if (!rules.roles.includes(context.role)) return false;
  }

  // Check plan-based access
  if (rules.plans && rules.plans.length > 0 && context?.planId) {
    if (!rules.plans.includes(context.planId)) return false;
  }

  // Check percentage rollout
  if (rules.percentage !== undefined && rules.percentage < 100 && context?.userId) {
    const hash = simpleHash(context.userId + key);
    if (hash % 100 >= rules.percentage) return false;
  }

  return true;
}

/**
 * Get all feature flags (for admin UI).
 */
export async function getAllFeatureFlags() {
  return prisma.featureFlag.findMany({ orderBy: { key: 'asc' } });
}

/**
 * Toggle a feature flag.
 */
export async function toggleFeatureFlag(key: string, isEnabled: boolean) {
  const flag = await prisma.featureFlag.update({
    where: { key },
    data: { isEnabled },
  });
  await cacheDel(`ff:${key}`);
  return flag;
}

/**
 * Create or update a feature flag.
 */
export async function upsertFeatureFlag(
  key: string,
  data: { name: string; description?: string; isEnabled: boolean; rules?: FeatureFlagRules }
) {
  const flag = await prisma.featureFlag.upsert({
    where: { key },
    create: { key, ...data },
    update: data,
  });
  await cacheDel(`ff:${key}`);
  return flag;
}

/**
 * Simple deterministic hash for percentage rollouts.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
