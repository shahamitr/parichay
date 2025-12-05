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

    // TODO: Implement reminder system with proper Prisma schema (nextFollowUpAt field)
    return NextResponse.json({
      reminders: [],
      message: 'Reminder system not yet implemented'
    });

    /* Disabled until schema is updated
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

    if (user.role === 'BRAND_MANAGER' && user.brandId) {
      whereClause.branch = { brandId: user.brandId };
    } else if (user.role === 'BRANCH_ADMIN' && user.branchId) {
      whereClause.branchId = user.branchId;
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      include: {
        branch: {
          select: { name: true, brand: { select: { name: true } } },
        },
      },
      orderBy: { nextFollowUpAt: 'asc' },
    });

    // Group by date
    const grouped = leads.reduce((acc: any, lead) => {
      const date = new Date(lead.nextFollowUpAt!).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(lead);
      return acc;
    }, {});

    return NextResponse.json({
      reminders: leads,
      grouped,
      total: leads.length,
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

    // Update lead with follow-up date
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        nextFollowUpAt: new Date(followUpAt),
        notes: notes ? `${notes}\n---\nFollow-up scheduled for ${new Date(followUpAt).toLocaleString()}` : undefined,
      },
    });

    // Create notification for the reminder
    await prisma.notification.create({
      data: {
        userId: payload.userId,
        type: 'FOLLOW_UP_REMINDER',
        title: `Follow-up reminder: ${lead.name}`,
        message: `Scheduled follow-up with ${lead.name} on ${new Date(followUpAt).toLocaleString()}`,
        metadata: {
          leadId: lead.id,
          scheduledAt: followUpAt,
        },
      },
    });

    return NextResponse.json({ success: true, lead });
    */ // End of disabled code
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
