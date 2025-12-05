import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MFAService } from '@/lib/mfa';
import { verifyToken } from '@/lib/auth-utils';

/**
 * POST /api/auth/mfa/setup
 * Initialize MFA setup for the authenticated user
 */
export async function POST(request: NextRequest) {
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
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if MFA is already enabled
    if (user.mfaEnabled) {
      return NextResponse.json(
        { error: 'MFA is already enabled. Disable it first to set up again.' },
        { status: 400 }
      );
    }

    // Generate MFA secret and QR code
    const mfaSetup = await MFAService.generateMFASecret(user.email);

    // Hash backup codes before storing
    const hashedBackupCodes = await MFAService.hashBackupCodes(mfaSetup.backupCodes);

    // Store the secret temporarily (not enabled yet)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        mfaSecret: mfaSetup.secret,
        backupCodes: hashedBackupCodes,
        mfaEnabled: false, // Not enabled until verified
      },
    });

    return NextResponse.json({
      qrCodeUrl: mfaSetup.qrCodeUrl,
      backupCodes: mfaSetup.backupCodes, // Return plain codes for user to save
      message: 'Scan the QR code with your authenticator app and verify to enable MFA',
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to set up MFA' },
      { status: 500 }
    );
  }
}
