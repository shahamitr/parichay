import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would get user from token
    // const token = request.headers.get('authorization')?.replace('Bearer ', '');
    // const user = await verifyToken(token);
    // const profile = await db.user.findUnique({
    //   where: { id: user.id },
    //   select: {
    //     id: true,
    //     firstName: true,
    //     lastName: true,
    //     email: true,
    //     phone: true,
    //     preferences: true
    //   }
    // });

    const mockProfile = {
      id: '1',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@onetouchbizcard.in',
      phone: '+91 98765 43210',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        leadNotifications: true,
        paymentNotifications: true,
        marketingEmails: false,
        language: 'en',
        timezone: 'IST',
        dateFormat: 'dd/mm/yyyy'
      }
    };

    return NextResponse.json({
      success: true,
      profile: mockProfile
    });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, preferences } = body;

    // In a real app, you would update in database
    // const token = request.headers.get('authorization')?.replace('Bearer ', '');
    // const user = await verifyToken(token);
    // const updatedProfile = await db.user.update({
    //   where: { id: user.id },
    //   data: {
    //     firstName,
    //     lastName,
    //     email,
    //     phone,
    //     preferences
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}