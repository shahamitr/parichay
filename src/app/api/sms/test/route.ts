// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/sms-service';
import { verifyToken } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
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
    const { phone, message } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    const success = await smsService.sendSMS({ to: phone, message });

    if (success != null) {
      return NextResponse.json({
        message: 'Test SMS sent successfully',
        phone,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test SMS' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Send test SMS error:', error);
    return NextResponse.json(
      { error: 'Failed to send test SMS' },
      { status: 500 }
    );
  }
}
