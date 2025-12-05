import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MFAService } from '@/lib/mfa';
import { verifyToken } from '@/lib/auth-utils';
import { z } from 'zod';

const regenerateBackupCodesSchema = z.object({
  token: z.string().length(6, 'Token must be 6 digits'),
});

/**
 * POST /api/auth/mfa/backup-code
 * Regenerate backup codes (requires MFA token)
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

    const body = await request.json();
    const validatedData = regenerateBackupCodesSchema.parse(body);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      return NextResponse.json(
        { error: 'MFA is not enabled' },
        { status: 400 }
      );
    }

    // Verify MFA token
    const isValid = MFAService.verifyTOTP(validatedData.token, user.mfaSecret);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid MFA token' },
        { status: 400 }
      );
    }

    // Generate new backup codes
    const backupCodes = MFAService.generateBackupCodes(10);
    const hashedBackupCodes = await MFAService.hashBackupCodes(backupCodes);

    // Update user with new backup codes
    await prisma.user.update({
      where: { id: user.id },
      data: {
        backupCodes: hashedBackupCodes,
      },
    });

    return NextResponse.json({
      backupCodes,
      message: 'New backup codes generated. Save them securely.',
    });
  } catch (error) {
    console.error('Backup code regeneration error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to regenerate backup codes' },
      { status: 500 }
    );
  }
}
