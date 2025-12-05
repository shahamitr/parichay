import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';

/**
 * POST /api/users/data-deletion - Request account and data deletion (GDPR compliance)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { confirmEmail } = body;

    // Verify email confirmation
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userData || userData.email !== confirmEmail) {
      return NextResponse.json(
        { error: 'Email confirmation does not match' },
        { status: 400 }
      );
    }

    // Check if user is a brand owner
    const ownedBrand = await prisma.brand.findFirst({
      where: { ownerId: user.id },
      include: {
        subscription: true,
      },
    });

    if (ownedBrand != null) {
      // Cancel active subscription first
      if (ownedBrand.subscription?.status === 'ACTIVE') {
        await prisma.subscription.update({
          where: { id: ownedBrand.subscription.id },
          data: { status: 'CANCELLED' },
        });
      }

      // Delete brand and all related data (cascading deletes)
      await prisma.brand.delete({
        where: { id: ownedBrand.id },
      });
    }

    // Delete user account
    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Your account and all associated data have been deleted',
    });
  } catch (error) {
    console.error('Error deleting user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
