import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { rateLimiters } from '@/lib/rate-limiter';
import { validateFormSubmission } from '@/lib/bot-protection';
import logger from '@/lib/logger';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Rate limit registration attempts by IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rlResult = await rateLimiters.auth.checkLimit(`register:${ip}`);

    if (!rlResult.allowed) {
      const retryAfter = Math.ceil((rlResult.resetTime - Date.now()) / 1000);
      logger.warn({ ip }, 'Registration rate limit exceeded');
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${Math.ceil(retryAfter / 60)} minute(s).` },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body = await request.json();

    // Bot protection (honeypot + timing)
    const botCheck = validateFormSubmission(request, body);
    if (!botCheck.allowed) {
      logger.warn({ ip }, 'Registration bot detected');
      return NextResponse.json(
        { error: 'Registration failed. Please try again.' },
        { status: 400 }
      );
    }

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser != null) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(validatedData.password);

    // Create user and brand in a transaction
    const result = await prisma.$transaction(async (tx) => {
      let brand = null;

      // Create brand if provided
      if (validatedData.brandName) {
        const slug = validatedData.brandName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Check if brand slug already exists
        const existingBrand = await tx.brand.findUnique({
          where: { slug },
        });

        if (existingBrand != null) {
          throw new Error('Brand name already taken');
        }

        brand = await tx.brand.create({
          data: {
            name: validatedData.brandName,
            slug,
            colorTheme: {
              primary: '#3B82F6',
              secondary: '#1E40AF',
              accent: '#F59E0B',
            },
            ownerId: '', // Will be updated after user creation
          },
        });
      }

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash: hashedPassword,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          role: validatedData.brandName ? 'BRAND_MANAGER' : 'BRANCH_ADMIN',
          brandId: brand?.id,
          emailVerified: false,
          emailVerificationToken,
          emailVerificationExpiry,
        },
      });

      // Update brand owner if brand was created
      if (brand != null) {
        await tx.brand.update({
          where: { id: brand.id },
          data: { ownerId: user.id },
        });
      }

      return { user, brand, emailVerificationToken };
    });

    // Send verification email
    const { emailService } = await import('@/lib/email-service');
    await emailService.sendVerificationEmail(
      result.user.email,
      result.emailVerificationToken,
      result.user.firstName
    );

    if (process.env.NODE_ENV === 'development') {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${result.emailVerificationToken}`;
      logger.info({ email: result.user.email, verificationUrl }, 'Verification email sent (dev URL logged)');
    } else {
      logger.info({ email: result.user.email }, 'Registration successful, verification email sent');
    }

    // Generate tokens
    const accessToken = AuthService.generateToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      brandId: result.user.brandId || undefined,
    });

    const refreshToken = AuthService.generateRefreshToken(result.user.id);

    // Set HTTP-only cookies
    const response = NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        brandId: result.user.brandId,
        brand: result.brand,
        emailVerified: false,
      },
      accessToken,
      message: 'Registration successful. Please check your email to verify your account.',
      // Only include verification URL in development
      ...(process.env.NODE_ENV === 'development' && { verificationUrl }),
    }, { status: 201 });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    logger.error({ error }, 'Registration error');

    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Invalid input data' },
          { status: 400 }
        );
      }

      if (error.message === 'Brand name already taken') {
        return NextResponse.json(
          { error: 'Brand name already taken' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}