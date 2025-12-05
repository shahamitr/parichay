import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MFAService } from '@/lib/mfa';
import { verifyToken } from '@/lib/auth-utils';

export interface MFAVerificationResult {
  success: boolean;
  error?: string;
  userId?: string;
}

/**
 * Middleware to enforce MFA verification for sensitive operations
 */
export async function requireMFAForSensitiveOperation(
  request: NextRequest,
  operation: string
): Promise<MFAVerificationResult> {
  try {
    // Verify authentication
    const authUser = await verifyToken(request);
    if (!authUser) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Check if MFA is enabled for this user
    if (!user.mfaEnabled || !user.mfaSecret) {
      // MFA not enabled, allow operation
      return {
        success: true,
        userId: user.id,
      };
    }

    // Check if this is a sensitive operation
    if (!MFAService.isSensitiveOperation(operation)) {
      // Not a sensitive operation, allow
      return {
        success: true,
        userId: user.id,
      };
    }

    // For sensitive operations with MFA enabled, require verification
    const body = await request.json();
    const mfaToken = body.mfaToken;

    if (!mfaToken) {
      return {
        success: false,
        error: 'MFA verification required for this operation',
      };
    }

    // Verify MFA token
    const isValid = MFAService.verifyTOTP(mfaToken, user.mfaSecret);

    if (!isValid) {
      return {
        success: false,
        error: 'Invalid MFA token',
      };
    }

    return {
      success: true,
      userId: user.id,
    };
  } catch (error) {
    console.error('MFA middleware error:', error);
    return {
      success: false,
      error: 'MFA verification failed',
    };
  }
}

/**
 * Helper to create a response for MFA requirement
 */
export function createMFARequiredResponse(operation: string): NextResponse {
  return NextResponse.json(
    {
      requiresMFA: true,
      operation,
      message: 'This operation requires MFA verification',
    },
    { status: 403 }
  );
}
