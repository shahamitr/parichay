/**
 * Response Time Badge System
 *
 * Tracks how quickly a business responds to leads.
 * Calculates average response time and assigns a badge:
 * - ⚡ "Usually responds within 1 hour" (avg < 60 min)
 * - 🕐 "Usually responds within 4 hours" (avg < 240 min)
 * - 📨 "Usually responds within a day" (avg < 1440 min)
 * - No badge if avg > 24 hours or insufficient data
 */

import { prisma } from './prisma';

export type ResponseBadge = {
  label: string;
  emoji: string;
  minutes: number;
  tier: 'fast' | 'good' | 'normal' | 'none';
};

/**
 * Calculate average response time for a brand (based on lead status changes).
 * A "response" = time between lead.createdAt and first status change from NEW.
 */
export async function calculateResponseTime(brandId: string): Promise<ResponseBadge> {
  try {
    // Get leads from last 30 days that have been responded to
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const leads = await prisma.lead.findMany({
      where: {
        brandId,
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ['CONTACTED', 'QUALIFIED', 'CONVERTED'] },
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
      take: 50, // Last 50 responded leads
      orderBy: { createdAt: 'desc' },
    });

    if (leads.length < 3) {
      // Not enough data
      return { label: '', emoji: '', minutes: 0, tier: 'none' };
    }

    // Calculate average response time (updatedAt - createdAt)
    const responseTimes = leads.map((lead) => {
      const created = new Date(lead.createdAt).getTime();
      const responded = new Date(lead.updatedAt).getTime();
      return (responded - created) / (1000 * 60); // minutes
    });

    const avgMinutes = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

    return getBadgeForTime(avgMinutes);
  } catch (error) {
    return { label: '', emoji: '', minutes: 0, tier: 'none' };
  }
}

/**
 * Get badge for a given response time in minutes.
 */
export function getBadgeForTime(avgMinutes: number): ResponseBadge {
  if (avgMinutes <= 60) {
    return { label: 'Usually responds within 1 hour', emoji: '⚡', minutes: Math.round(avgMinutes), tier: 'fast' };
  }
  if (avgMinutes <= 240) {
    return { label: 'Usually responds within 4 hours', emoji: '🕐', minutes: Math.round(avgMinutes), tier: 'good' };
  }
  if (avgMinutes <= 1440) {
    return { label: 'Usually responds within a day', emoji: '📨', minutes: Math.round(avgMinutes), tier: 'normal' };
  }
  return { label: '', emoji: '', minutes: Math.round(avgMinutes), tier: 'none' };
}

/**
 * Get response badge for display on microsite profile.
 * Cached per brand for 1 hour.
 */
export async function getResponseBadge(brandId: string): Promise<ResponseBadge | null> {
  const { withCache } = await import('./cache');

  return withCache(
    `response-badge:${brandId}`,
    async () => {
      const badge = await calculateResponseTime(brandId);
      return badge.tier !== 'none' ? badge : null;
    },
    3600 // Cache for 1 hour
  );
}
