import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/auth';
import { MFAService } from '@/lib/mfa';
import { verifyToken } from '@/lib/auth-utils';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  mfaToken: z.string().optional(),
});

/**
 * POST /api/auth/change-password
 * Change user password (requires MFA if enabled)
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
    const validatedData = changePasswordSchema.parse(body);

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

    // Verify current password
    const isValidPassword = await AuthService.verifyPassword(
      validatedData.currentPassword,
      user.passwordHash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Check if MFA is enabled and enforce for this sensitive operation
    if (user.mfaEnabled && user.mfaSecret) {
      if (!validatedData.mfaToken) {
        return NextResponse.json(
          {
            requiresMFA: true,
            operation: 'change_password',
            message: 'MFA verification required to change password',
          },
          { status: 403 }
        );
      }

      // Verify MFA token
      const isValidMFA = MFAService.verifyTOTP(validatedData.mfaToken, user.mfaSecret);

      if (!isValidMFA) {
        return NextResponse.json(
          { error: 'Invalid MFA token' },
          { status: 401 }
        );
      }
    }

    // Hash new password
    const hashedPassword = await AuthService.hashPassword(validatedData.newPassword);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
      },
    });

    return NextResponse.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
