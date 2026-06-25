import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user details to get email for matching appointments
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch appointments as service history
    const appointments = await prisma.appointment.findMany({
      where: {
        OR: [
          { customerEmail: user.email },
          { lead: { email: user.email } }
        ]
      },
      include: {
        branch: {
          include: {
            brand: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    const serviceHistory = appointments.map(apt => ({
      id: apt.id,
      businessId: apt.branch.brandId,
      businessName: apt.branch.name,
      serviceType: apt.serviceName || 'General Service',
      date: apt.date.toISOString(),
      status: apt.status.toLowerCase(),
      rating: null,
      notes: apt.notes
    }));

    return NextResponse.json({
      success: true,
      favorites: [], // Favorites model doesn't exist yet, returning empty array
      serviceHistory
    });

  } catch (error) {
    console.error('Customer Dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data', favorites: [], serviceHistory: [] },
      { status: 500 }
    );
  }
}
