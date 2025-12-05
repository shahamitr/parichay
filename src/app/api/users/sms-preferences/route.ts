// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        phone: true,
        smsEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      phone: user.phone,
      smsEnabled: user.smsEnabled,
    });
  } catch (error) {
    console.error('Get SMS preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SMS preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { phone, smsEnabled } = body;

    // Validate phone number format if provided
    if (phone && typeof phone === 'string') {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return NextResponse.json(
          { error: 'Invalid phone number format. Use international format (e.g., +1234567890)' },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        phone: phone || null,
        smsEnabled: smsEnabled === true,
      },
      select: {
        phone: true,
        smsEnabled: true,
      },
    });

    return NextResponse.json({
      message: 'SMS preferences updated successfully',
      phone: updatedUser.phone,
      smsEnabled: updatedUser.smsEnabled,
    });
  } catch (error) {
    console.error('Update SMS preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to update SMS preferences' },
      { status: 500 }
    );
  }
}
