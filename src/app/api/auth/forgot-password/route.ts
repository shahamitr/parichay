import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email-service';
import crypto from 'crypto';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // Always return success to prevent email enumeration
    if (!user || !user.isActive) {
      return NextResponse.json({
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send password reset email
    await emailService.sendPasswordResetEmail(user.email, resetToken);

    return NextResponse.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address', type: 'VALIDATION_ERROR' },
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

      // Email service errors
      if (errorMessage.includes('email') || errorMessage.includes('smtp')) {
        console.error('📧 Email service error:', error.message);
        return NextResponse.json(
          {
            error: 'Failed to send email. Please try again later or contact support.',
            type: 'EMAIL_ERROR'
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
