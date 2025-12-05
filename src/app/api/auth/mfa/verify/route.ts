import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MFAService } from '@/lib/mfa';
import { verifyToken } from '@/lib/auth-utils';
import { z } from 'zod';

const verifyMFASchema = z.object({
  token: z.string().length(6, 'Token must be 6 digits'),
});

/**
 * POST /api/auth/mfa/verify
 * Verify MFA token and enable MFA for the user
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
    const validatedData = verifyMFASchema.parse(body);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user || !user.mfaSecret) {
      return NextResponse.json(
        { error: 'MFA setup not initiated' },
        { status: 400 }
      );
    }

    // Verify the TOTP token
    const isValid = MFAService.verifyTOTP(validatedData.token, user.mfaSecret);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Enable MFA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        mfaEnabled: true,
      },
    });

    return NextResponse.json({
      message: 'MFA enabled successfully',
      mfaEnabled: true,
    });
  } catch (error) {
    console.error('MFA verification error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to verify MFA' },
      { status: 500 }
    );
  }
}
