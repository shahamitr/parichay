import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/auth';
import { MFAService } from '@/lib/mfa';
import { loginSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🔐 Login attempt for:', body.email);

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: { brand: true },
    });

    if (!user) {
      console.log('❌ User not found:', validatedData.email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      console.log('❌ User inactive:', validatedData.email);
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await AuthService.verifyPassword(
      validatedData.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      console.log('❌ Invalid password for:', validatedData.email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if MFA is enabled
    if (user.mfaEnabled && user.mfaSecret) {
      const mfaToken = (body as any).mfaToken;
      const backupCode = (body as any).backupCode;

      // If no MFA token or backup code provided, request it
      if (!mfaToken && !backupCode) {
        return NextResponse.json(
          {
            requiresMFA: true,
            message: 'MFA verification required',
            userId: user.id,
          },
          { status: 403 }
        );
      }

      // Verify MFA token or backup code
      let mfaValid = false;

      if (mfaToken != null) {
        mfaValid = MFAService.verifyTOTP(mfaToken, user.mfaSecret);
      } else if (backupCode && user.backupCodes) {
        const backupCodesArray = user.backupCodes as string[];
        const result = await MFAService.verifyBackupCode(backupCode, backupCodesArray);
        mfaValid = result.valid;

        if (result.valid) {
          await prisma.user.update({
            where: { id: user.id },
            data: { backupCodes: result.remainingCodes },
          });
        }
      }

      if (!mfaValid) {
        return NextResponse.json(
          { error: 'Invalid MFA code' },
          { status: 401 }
        );
      }
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const accessToken = AuthService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      brandId: user.brandId || undefined,
    });

    const refreshToken = AuthService.generateRefreshToken(user.id);

    console.log('✅ Tokens generated for:', user.email);
    console.log('📝 Access token length:', accessToken.length);

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        brandId: user.brandId,
        brand: user.brand,
      },
      accessToken,
    });

    // Set cookies on the response object
    response.cookies.set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    response.cookies.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    console.log('🍪 Cookies set on response');
    console.log('✅ Login successful for:', user.email, 'Role:', user.role);

    return response;
  } catch (error) {
    console.error('❌ Login error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Check for database connection errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      // Prisma connection errors
      if (errorMessage.includes('connect') ||
          errorMessage.includes('connection') ||
          errorMessage.includes('econnrefused') ||
          errorMessage.includes('etimedout') ||
          errorMessage.includes('database')) {
        console.error('🔴 Database connection error:', error.message);
        return NextResponse.json(
          {
            error: 'Database connection failed. Please ensure the database is running and try again.',
            type: 'DATABASE_ERROR'
          },
          { status: 503 }
        );
      }

      // Network errors
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return NextResponse.json(
          {
            error: 'Network error. Please check your connection and try again.',
            type: 'NETWORK_ERROR'
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again later.',
        type: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
