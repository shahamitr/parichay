/**
 * MFA Backup Codes API
 * POST /api/auth/mfa/backup-codes - Use backup code for login
 * PUT /api/auth/mfa/backup-codes - Regenerate backup codes
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';
import MFAService from '@/lib/mfa';
import logger from '@/lib/logger';

// Use a backup code for login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, code } = body;

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'User ID and backup code are required' },
        { status: 400 }
      );
    }

    // Get user with backup codes
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { backupCodes: true, mfaEnabled: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.mfaEnabled || !user.backupCodes) {
      return NextResponse.json({ error: 'MFA is not enabled' }, { status: 400 });
    }

    const hashedCodes = user.backupCodes as string[];
    const matchIndex = await MFAService.verifyBackupCode(code, hashedCodes);

    if (matchIndex === -1) {
      return NextResponse.json({ error: 'Invalid backup code' }, { status: 400 });
    }

    // Remove used backup code
    const updatedCodes = MFAService.removeBackupCode(hashedCodes, matchIndex);

    await prisma.user.update({
      where: { id: userId },
      data: { backupCodes: updatedCodes },
    });

    return NextResponse.json({
      success: true,
      message: 'Backup code verified',
      remainingCodes: updatedCodes.length,
    });
  } catch (error) {
    logger.error({ error }, 'Backup code verification error');
    return NextResponse.json(
      { error: 'Failed to verify backup code' },
      { status: 500 }
    );
  }
}

// Regenerate backup codes (requires authentication and MFA verification)
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = authResult.user.userId;
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'MFA verification code is required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaSecret: true, mfaEnabled: true },
    });

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      return NextResponse.json({ error: 'MFA is not enabled' }, { status: 400 });
    }

    // Verify MFA code first
    const isValid = MFAService.verifyTOTP(code, user.mfaSecret);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Generate new backup codes
    const backupCodes = MFAService.generateBackupCodes(8);
    const hashedBackupCodes = await MFAService.hashBackupCodes(backupCodes);

    await prisma.user.update({
      where: { id: userId },
      data: { backupCodes: hashedBackupCodes },
    });

    return NextResponse.json({
      success: true,
      backupCodes, // Return new backup codes
      message: 'Backup codes regenerated. Save these codes in a safe place.',
    });
  } catch (error) {
    logger.error({ error }, 'Backup codes regeneration error');
    return NextResponse.json(
      { error: 'Failed to regenerate backup codes' },
      { status: 500 }
    );
  }
}
