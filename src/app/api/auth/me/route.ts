import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import logger from '@/lib/logger';


/**
 * GET /api/auth/me
 * Get current authenticated user information
 */
export async function GET(request: NextRequest) {
  try {
    logger.debug('api/auth/me called');

    // Get all cookies for debugging (only in dev)
    if (process.env.NODE_ENV === 'development') {
      const allCookies = request.cookies.getAll();
      logger.debug({ cookies: allCookies.map(c => c.name) }, 'Cookies present');
    }

    // Verify authentication and get user
    const user = await getAuthUser(request);


    if (!user) {
      logger.warn({ userId: payload.userId }, 'User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // User found

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching user info');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


