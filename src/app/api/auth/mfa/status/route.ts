import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';

/**
 * GET /api/auth/mfa/status
 * Get MFA status for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = await verifyToken(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        mfaEnabled: true,
        backupCodes: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Count remaining backup codes
    const backupCodesArray = user.backupCodes as string[] | null;
    const remainingBackupCodes = backupCodesArray ? backupCodesArray.length : 0;

    return NextResponse.json({
      mfaEnabled: user.mfaEnabled,
      remainingBackupCodes,
    });
  } catch (error) {
    console.error('MFA status error:', error);
    return NextResponse.json(
      { error: 'Failed to get MFA status' },
      { status: 500 }
    );
  }
}
