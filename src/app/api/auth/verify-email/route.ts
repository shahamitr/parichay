/**
 * Email Verification API
 * GET /api/auth/verify-email?token=xxx - Verify email with token
 * POST /api/auth/verify-email - Resend verification email
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';
import crypto from 'crypto';

// Verify email with token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    // Redirect to login with success message
    return NextResponse.redirect(
      new URL('/login?verified=true', request.url)
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}

// Resend verification email
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    let email: string;

    if (authResult.authenticated && authResult.user) {
      // Authenticated user requesting resend
      const user = await prisma.user.findUnique({
        where: { id: authResult.user.userId },
      });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      if (user.emailVerified) {
        return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
      }
      email = user.email;
    } else {
      // Unauthenticated - email must be provided in body
      const body = await request.json();
      email = body.email;
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a verification link will be sent',
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}`;

    // TODO: Integrate with actual email service
    // For now, log the URL (in production, use email service)
    console.log('📧 Verification email would be sent to:', email);
    console.log('📧 Verification URL:', verificationUrl);

    // In production, use email service like:
    // await sendEmail({
    //   to: email,
    //   subject: 'Verify your Parichay account',
    //   html: `
    //     <h1>Verify your email</h1>
    //     <p>Click the link below to verify your email address:</p>
    //     <a href="${verificationUrl}">${verificationUrl}</a>
    //     <p>This link expires in 24 hours.</p>
    //   `,
    // });

    return NextResponse.json({
      success: true,
      message: 'Verification email sent',
      // Only include token in development for testing
      ...(process.env.NODE_ENV === 'development' && { verificationUrl }),
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
