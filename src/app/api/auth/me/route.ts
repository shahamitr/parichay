import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { JWTService } from '@/lib/jwt';

const prisma = new PrismaClient();

/**
 * GET /api/auth/me
 * Get current authenticated user information
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/auth/me called');

    // Get all cookies for debugging
    const allCookies = request.cookies.getAll();
    console.log('🍪 All cookies:', allCookies.map(c => c.name));

    // Verify authentication
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      console.log('❌ No access token found in cookies');
      return NextResponse.json(
        { error: 'Unauthorized - No token' },
        { status: 401 }
      );
    }

    console.log('✅ Access token found, length:', accessToken.length);

    const payload = JWTService.verifyToken(accessToken);

    if (!payload) {
      console.log('❌ Invalid token');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    console.log('✅ Token verified, userId:', payload.userId, 'role:', payload.role);

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        phone: true,
        createdAt: true,
        lastLoginAt: true,
        brandId: true,
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!user) {
      console.log('❌ User not found:', payload.userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ User found:', user.email);

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('❌ Error fetching user info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
