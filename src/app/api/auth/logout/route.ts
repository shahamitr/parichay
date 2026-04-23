import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

export async function POST() {
  try {
    logger.info('Logout requested');

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Delete cookies on the response object
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    logger.debug('Cookies cleared');

    return response;
  } catch (error) {
    logger.error({ error }, 'Logout error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
