import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/auth';
import logger from '@/lib/logger';

/**
 * POST /api/auth/refresh - Refresh access token using refresh token cookie
 */
export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = AuthService.verifyRefreshToken(refreshToken);

    if (!payload) {
      const response = NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    // Fetch current user data (ensures user still exists and is active)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        brandId: true,
        isActive: true,
        deletedAt: true,
      },
    });

    if (!user || !user.isActive || user.deletedAt) {
      const response = NextResponse.json(
        { error: 'User account is no longer active' },
        { status: 401 }
      );
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    // Generate new access token
    const newAccessToken = AuthService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      brandId: user.brandId || undefined,
    });

    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    });

    // Set new access token cookie (15 minutes)
    response.cookies.set({
      name: 'accessToken',
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    return response;
  } catch (error) {
    logger.error({ error }, 'Token refresh error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
