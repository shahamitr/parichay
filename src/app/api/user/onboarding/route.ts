/**
 * User Onboarding API
 * GET /api/user/onboarding - Check if user has completed onboarding
 * POST /api/user/onboarding - Mark onboarding as complete
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authResult.user.userId },
      select: { onboardingCompletedAt: true },
    });

    return NextResponse.json({
      completed: !!user?.onboardingCompletedAt,
      completedAt: user?.onboardingCompletedAt,
    });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to check onboarding status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.update({
      where: { id: authResult.user.userId },
      data: { onboardingCompletedAt: new Date() },
      select: {
        id: true,
        onboardingCompletedAt: true,
        firstName: true,
        lastName: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Onboarding marked as complete',
      completedAt: user.onboardingCompletedAt,
    });
  } catch (error) {
    console.error('Error updating onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to update onboarding status' },
      { status: 500 }
    );
  }
}
