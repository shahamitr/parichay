import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { generateNonce } from '@/lib/request-signing';

/**
 * GET /api/auth/nonce
 *
 * Generate a single-use nonce for signing sensitive mutations.
 * Requires authentication. The nonce is tied to the user's session
 * and expires after 5 minutes.
 */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const nonce = await generateNonce(user.id);

  return NextResponse.json({
    nonce,
    expiresIn: 300, // 5 minutes
  });
}
