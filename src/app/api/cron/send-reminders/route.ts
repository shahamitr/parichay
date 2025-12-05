import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint should be called by a cron job (e.g., Vercel Cron, AWS EventBridge)
// Recommended: Run every hour

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement lead reminder system with proper Prisma schema
    // This feature requires: nextFollowUpAt field on Lead model, branch.admins relation, etc.
    return NextResponse.json({
      message: 'Lead reminder system not yet implemented',
      remindersSent: 0,
      overdueNotifications: 0
    });

    /* Disabled until schema is updated
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    // Find leads with follow-ups in the next hour that haven't been notified
    const leadsWithFollowUps = await prisma.lead.findMany({
      where: {
        nextFollowUpAt: {
          gte: now,
          lte: oneHourFromNow,
        },
        // Check if reminder notification already sent
        NOT: {
          metadata: {
            path: ['reminderSent'],
            equals: true,
          },
        },
      },
      include: {
        branch: {
          include: {
            brand: true,
            admins: {
              include: { user: true },
            },
          },
        },
      },
    });

    const notifications: any[] = [];
    const updatedLeads: string[] = [];

    for (const lead of leadsWithFollowUps) {
      // Get users to notify (branch admins and brand managers)
      const usersToNotify = new Set<string>();

      // Add branch admins
      lead.branch.admins.forEach(admin => {
        usersToNotify.add(admin.userId);
      });

      // Create notifications for each user
      for (const userId of usersToNotify) {
        const notification = await prisma.notification.create({
          data: {
            userId,
            type: 'FOLLOW_UP_REMINDER',
            title: `⏰ Follow-up Reminder: ${lead.name}`,
            message: `You have a scheduled follow-up with ${lead.name} (${lead.phone || lead.email || 'No contact'}) at ${new Date(lead.nextFollowUpAt!).toLocaleTimeString()}`,
            metadata: {
              leadId: lead.id,
              branchId: lead.branchId,
              brandId: lead.branch?.brandId,
              followUpAt: lead.nextFollowUpAt,
            },
          },
        });
        notifications.push(notification);
      }

      // Mark lead as reminder sent
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          metadata: {
            ...(lead.metadata as object || {}),
            reminderSent: true,
            reminderSentAt: now.toISOString(),
          },
        },
      });
      updatedLeads.push(lead.id);
    }

    // Also check for overdue follow-ups (past due)
    const overdueLeads = await prisma.lead.findMany({
      where: {
        nextFollowUpAt: {
          lt: now,
        },
        status: {
          notIn: ['converted', 'lost'],
        },
        NOT: {
          metadata: {
            path: ['overdueNotified'],
            equals: true,
          },
        },
      },
      include: {
        branch: {
          include: {
            admins: { include: { user: true } },
          },
        },
      },
      take: 50, // Limit to prevent overwhelming
    });

    for (const lead of overdueLeads) {
      const usersToNotify = new Set<string>();
      lead.branch.admins.forEach(admin => usersToNotify.add(admin.userId));

      for (const userId of usersToNotify) {
        await prisma.notification.create({
          data: {
            userId,
            type: 'FOLLOW_UP_OVERDUE',
            title: `⚠️ Overdue Follow-up: ${lead.name}`,
            message: `Follow-up with ${lead.name} was due on ${new Date(lead.nextFollowUpAt!).toLocaleDateString()}. Please take action.`,
            metadata: {
              leadId: lead.id,
              branchId: lead.branchId,
              followUpAt: lead.nextFollowUpAt,
            },
          },
        });
      }

      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          metadata: {
            ...(lead.metadata as object || {}),
            overdueNotified: true,
            overdueNotifiedAt: now.toISOString(),
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      processed: {
        upcomingReminders: leadsWithFollowUps.length,
        overdueReminders: overdueLeads.length,
        notificationsSent: notifications.length,
      },
      timestamp: now.toISOString(),
    });
    */ // End of disabled code
  } catch (error) {
    console.error('Error sending reminders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
