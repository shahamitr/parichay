import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MFAService } from '@/lib/mfa';
import { AuthService } from '@/lib/auth';
import { verifyToken } from '@/lib/auth-utils';
import { z } from 'zod';

const disableMFASchema = z.object({
  password: z.string().min(1, 'Password is required'),
  token: z.string().optional(),
});

/**
 * POST /api/auth/mfa/disable
 * Disable MFA for the user (requires password and MFA token)
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
    const validatedData = disableMFASchema.parse(body);

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

    // Verify password
    const isValidPassword = await AuthService.verifyPassword(
      validatedData.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // If MFA is enabled, require MFA token to disable it
    if (user.mfaEnabled && user.mfaSecret) {
      if (!validatedData.token) {
        return NextResponse.json(
          { error: 'MFA token required to disable MFA' },
          { status: 400 }
        );
      }

      const isValidToken = MFAService.verifyTOTP(validatedData.token, user.mfaSecret);

      if (!isValidToken) {
        return NextResponse.json(
          { error: 'Invalid MFA token' },
          { status: 400 }
        );
      }
    }

    // Disable MFA and clear secrets
    await prisma.user.update({
      where: { id: user.id },
      data: {
        mfaEnabled: false,
        mfaSecret: null as any,
        backupCodes: null as any,
      },
    });

    return NextResponse.json({
      message: 'MFA disabled successfully',
      mfaEnabled: false,
    });
  } catch (error) {
    console.error('MFA disable error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to disable MFA' },
      { status: 500 }
    );
  }
}
