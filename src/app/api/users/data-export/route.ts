import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';

/**
 * GET /api/users/data-export - Export user data (GDPR compliance)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all user data
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        brand: {
          include: {
            branches: true,
            qrCodes: true,
            analytics: true,
          },
        },
        branches: true,
        notifications: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive data
    const exportData = {
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: userData.createdAt,
        lastLoginAt: userData.lastLoginAt,
      },
      brand: userData.brand,
      branches: userData.branches,
      notifications: userData.notifications,
    };

    // Return as JSON download
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="user-data-${user.id}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
