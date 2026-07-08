/**
 * Cron: Check & Expire Subscriptions
 * GET /api/cron/check-subscriptions?secret=CRON_SECRET
 *
 * Run every hour via cron or external scheduler (e.g., cron-job.org, AWS EventBridge).
 *
 * Actions:
 * 1. Expire active subscriptions past their endDate
 * 2. Send expiry warning emails (7 days, 3 days, 1 day before)
 * 3. Suspend subscriptions past 7-day grace period
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized execution
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const results = { expired: 0, warned: 0, suspended: 0, errors: 0 };

  try {
    // 1. Expire active subscriptions that have passed their end date
    const expiredSubs = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: { lt: now },
      },
      include: { brand: { select: { id: true, name: true, ownerId: true } } },
    });

    for (const sub of expiredSubs) {
      try {
        // Check if within 7-day grace period
        const gracePeriodEnd = new Date(sub.endDate);
        gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);

        if (now > gracePeriodEnd) {
          // Past grace period — suspend
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: 'SUSPENDED' },
          });
          results.suspended++;
          logger.info({ subId: sub.id, brandId: sub.brand?.id }, 'Subscription suspended (past grace)');
        } else {
          // Within grace period — mark as expired
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: 'EXPIRED' },
          });
          results.expired++;
          logger.info({ subId: sub.id, brandId: sub.brand?.id }, 'Subscription expired');
        }

        // Send notification to brand owner
        if (sub.brand?.ownerId) {
          await prisma.notification.create({
            data: {
              userId: sub.brand.ownerId,
              type: 'SYSTEM_ALERT',
              title: now > gracePeriodEnd ? 'Subscription Suspended' : 'Subscription Expired',
              message: now > gracePeriodEnd
                ? 'Your subscription has been suspended. Renew now to restore access.'
                : 'Your subscription has expired. You have 7 days to renew before suspension.',
              metadata: { subscriptionId: sub.id },
            },
          }).catch(() => {}); // Don't fail the cron if notification fails
        }
      } catch (err) {
        results.errors++;
        logger.error({ err, subId: sub.id }, 'Error processing subscription expiry');
      }
    }

    // 2. Send warning notifications for subscriptions expiring soon
    const warningDays = [7, 3, 1];
    for (const days of warningDays) {
      const warningDate = new Date(now);
      warningDate.setDate(warningDate.getDate() + days);
      const warningStart = new Date(warningDate);
      warningStart.setHours(0, 0, 0, 0);
      const warningEnd = new Date(warningDate);
      warningEnd.setHours(23, 59, 59, 999);

      const expiringSoon = await prisma.subscription.findMany({
        where: {
          status: 'ACTIVE',
          endDate: { gte: warningStart, lte: warningEnd },
        },
        include: { brand: { select: { ownerId: true, name: true } }, plan: true },
      });

      for (const sub of expiringSoon) {
        if (sub.brand?.ownerId) {
          await prisma.notification.create({
            data: {
              userId: sub.brand.ownerId,
              type: 'SYSTEM_ALERT',
              title: `Subscription expires in ${days} day${days > 1 ? 's' : ''}`,
              message: `Your ${sub.plan.name} plan for "${sub.brand.name}" expires on ${new Date(sub.endDate).toLocaleDateString()}. Renew to avoid interruption.`,
              metadata: { subscriptionId: sub.id, daysUntilExpiry: days },
            },
          }).catch(() => {});
          results.warned++;
        }
      }
    }

    logger.info(results, 'Subscription cron completed');

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Subscription cron failed');
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
