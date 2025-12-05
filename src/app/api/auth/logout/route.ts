import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🚪 Logout requested');

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Delete cookies on the response object
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    console.log('✅ Cookies cleared');

    return response;
  } catch (error) {
    console.error('❌ Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
