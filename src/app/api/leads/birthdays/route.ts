import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getAuthUser } from '@/lib/auth';

/**
 * GET /api/leads/birthdays
 * Get leads with upcoming birthdays
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getAuthUser(token);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const month = searchParams.get('month'); // Optional: filter by month (1-12)
    const days = parseInt(searchParams.get('days') || '30'); // Days ahead to look

    // Build where clause
    const whereClause: any = {
      birthdayMonth: { not: null },
      birthdayDay: { not: null },
    };

    if (branchId) {
      whereClause.branchId = branchId;
    } else if (user.brandId) {
      whereClause.branch = { brandId: user.brandId };
    }

    if (month) {
      whereClause.birthdayMonth = parseInt(month);
    }

    // Fetch leads with birthdays
    const leads = await prisma.lead.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthdayMonth: true,
        birthdayDay: true,
        birthday: true,
        branchId: true,
        branch: {
          select: {
            name: true,
            brand: {
              select: {
                name: true,
              },
            },
          },
        },
        birthdayLogs: {
          where: {
            year: new Date().getFullYear(),
          },
          select: {
            sentAt: true,
            channel: true,
            status: true,
          },
        },
      },
      orderBy: [
        { birthdayMonth: 'asc' },
        { birthdayDay: 'asc' },
      ],
    });

    // Calculate days until birthday
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const leadsWithDaysUntil = leads.map(lead => {
      let birthdayYear = currentYear;

      // If birthday already passed this year, calculate for next year
      if (
        lead.birthdayMonth! < currentMonth ||
        (lead.birthdayMonth === currentMonth && lead.birthdayDay! < currentDay)
      ) {
        birthdayYear = currentYear + 1;
      }

      const nextBirthday = new Date(birthdayYear, lead.birthdayMonth! - 1, lead.birthdayDay!);
      const diffTime = nextBirthday.getTime() - today.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const alreadySent = lead.birthdayLogs.length > 0;

      return {
        ...lead,
        daysUntil,
        nextBirthday: nextBirthday.toISOString().split('T')[0],
        alreadySentThisYear: alreadySent,
      };
    });

    // Filter by days ahead
    const upcomingBirthdays = leadsWithDaysUntil
      .filter(lead => lead.daysUntil >= 0 && lead.daysUntil <= days)
      .sort((a, b) => a.daysUntil - b.daysUntil);

    // Group by category
    const todaysBirthdays = upcomingBirthdays.filter(l => l.daysUntil === 0);
    const thisWeek = upcomingBirthdays.filter(l => l.daysUntil > 0 && l.daysUntil <= 7);
    const thisMonth = upcomingBirthdays.filter(l => l.daysUntil > 7 && l.daysUntil <= 30);

    return NextResponse.json({
      success: true,
      data: {
        today: todaysBirthdays,
        thisWeek,
        thisMonth,
        all: upcomingBirthdays,
      },
      stats: {
        total: upcomingBirthdays.length,
        today: todaysBirthdays.length,
        thisWeek: thisWeek.length,
        thisMonth: thisMonth.length,
        alreadySent: upcomingBirthdays.filter(l => l.alreadySentThisYear).length,
      },
    });
  } catch (error) {
    console.error('Error fetching birthdays:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads/birthdays
 * Update lead birthday
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getAuthUser(token);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { leadId, birthdayMonth, birthdayDay } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    // Validate month and day
    if (birthdayMonth && (birthdayMonth < 1 || birthdayMonth > 12)) {
      return NextResponse.json({ error: 'Invalid month' }, { status: 400 });
    }

    if (birthdayDay && (birthdayDay < 1 || birthdayDay > 31)) {
      return NextResponse.json({ error: 'Invalid day' }, { status: 400 });
    }

    // Update lead
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        birthdayMonth: birthdayMonth || null,
        birthdayDay: birthdayDay || null,
        birthday: birthdayMonth && birthdayDay
          ? new Date(2000, birthdayMonth - 1, birthdayDay) // Use 2000 as placeholder year
          : null,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Error updating birthday:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
