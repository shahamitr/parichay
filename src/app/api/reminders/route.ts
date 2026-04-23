import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JWTService } from '@/lib/jwt';

// GET - Fetch upcoming reminders/follow-ups
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JWTService.verifyToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = payload;
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    // Build where clause based on user role
    let whereClause: any = {
      nextFollowUpAt: {
        gte: now,
        lte: futureDate,
      },
    };

    // Filter based on user role
    if (user.role === 'BRAND_MANAGER' && user.brandId) {
      whereClause.branch = { brandId: user.brandId };
    } else if (user.role === 'BRANCH_ADMIN') {
      // Get branches the user has access to
      const userWithBranches = await prisma.user.findUnique({
        where: { id: user.userId },
        include: { branches: { select: { id: true } } },
      });
      if (userWithBranches?.branches?.length) {
        whereClause.branchId = { in: userWithBranches.branches.map(b => b.id) };
      }
    } else if (user.role === 'EXECUTIVE') {
      // Get branches onboarded by this executive
      whereClause.branch = { onboardedById: user.userId };
    }
    // SUPER_ADMIN sees all

    const leads = await prisma.lead.findMany({
      where: whereClause,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            brand: { select: { id: true, name: true } }
          },
        },
      },
      orderBy: { nextFollowUpAt: 'asc' },
      take: 50, // Limit results
    });

    // Format reminders
    const reminders = leads.map(lead => ({
      id: lead.id,
      leadName: lead.name,
      leadEmail: lead.email,
      leadPhone: lead.phone,
      branchName: lead.branch.name,
      brandName: lead.branch.brand.name,
      followUpDate: lead.nextFollowUpAt,
      status: lead.status,
      priority: lead.priority,
      notes: lead.notes,
      daysUntil: Math.ceil((new Date(lead.nextFollowUpAt!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    }));

    // Group by date
    const grouped = reminders.reduce((acc: Record<string, typeof reminders>, reminder) => {
      const date = new Date(reminder.followUpDate!).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(reminder);
      return acc;
    }, {});

    // Get overdue reminders
    const overdueLeads = await prisma.lead.findMany({
      where: {
        nextFollowUpAt: {
          lt: now,
        },
        status: { notIn: ['CONVERTED', 'LOST', 'ARCHIVED'] },
        ...(user.role === 'BRAND_MANAGER' && user.brandId ? { branch: { brandId: user.brandId } } : {}),
      },
      include: {
        branch: {
          select: { name: true, brand: { select: { name: true } } },
        },
      },
      orderBy: { nextFollowUpAt: 'desc' },
      take: 20,
    });

    const overdue = overdueLeads.map(lead => ({
      id: lead.id,
      leadName: lead.name,
      branchName: lead.branch.name,
      brandName: lead.branch.brand.name,
      followUpDate: lead.nextFollowUpAt,
      daysOverdue: Math.ceil((now.getTime() - new Date(lead.nextFollowUpAt!).getTime()) / (1000 * 60 * 60 * 24)),
    }));

    return NextResponse.json({
      success: true,
      reminders,
      grouped,
      overdue,
      total: reminders.length,
      overdueCount: overdue.length,
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create/schedule a reminder
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JWTService.verifyToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, followUpAt, notes } = body;

    if (!leadId || !followUpAt) {
      return NextResponse.json({ error: 'Lead ID and follow-up date required' }, { status: 400 });
    }

    // Get existing lead to append notes
    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { notes: true, name: true },
    });

    if (!existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Update lead with follow-up date
    const followUpDate = new Date(followUpAt);
    const updatedNotes = notes
      ? `${existingLead.notes || ''}\n---\n[${new Date().toLocaleString()}] Follow-up scheduled for ${followUpDate.toLocaleString()}: ${notes}`.trim()
      : existingLead.notes;

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        nextFollowUpAt: followUpDate,
        notes: updatedNotes,
      },
      include: {
        branch: {
          select: { name: true, brand: { select: { name: true } } },
        },
      },
    });

    // Create lead activity
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: 'FOLLOW_UP_SCHEDULED',
        description: `Follow-up scheduled for ${followUpDate.toLocaleString()}${notes ? `: ${notes}` : ''}`,
        performedById: payload.userId,
        performedByName: `${payload.firstName} ${payload.lastName}`,
      },
    });

    // Create notification for the reminder
    try {
      await prisma.notification.create({
        data: {
          userId: payload.userId,
          type: 'FOLLOW_UP_REMINDER',
          title: `Follow-up reminder: ${lead.name}`,
          message: `Scheduled follow-up with ${lead.name} on ${followUpDate.toLocaleString()}`,
          metadata: {
            leadId: lead.id,
            scheduledAt: followUpAt,
          },
        },
      });
    } catch (notifError) {
      // Notification creation is non-critical
      console.error('Error creating notification:', notifError);
    }

    return NextResponse.json({
      success: true,
      lead,
      message: `Follow-up scheduled for ${followUpDate.toLocaleDateString()}`,
    });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove a reminder (clear follow-up date)
export async function DELETE(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JWTService.verifyToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: { nextFollowUpAt: null },
    });

    // Create activity log
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: 'NOTE_ADDED',
        description: 'Follow-up reminder cleared',
        performedById: payload.userId,
        performedByName: `${payload.firstName} ${payload.lastName}`,
      },
    });

    return NextResponse.json({ success: true, message: 'Reminder cleared' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
