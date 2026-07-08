/**
 * OTP Verify API
 * POST /api/auth/otp/verify — Verify OTP and login/register user
 *
 * If user exists with that phone → login
 * If no user → create new user with phone (role: BUSINESS_OWNER)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/auth';
import { rateLimiters } from '@/lib/rate-limiter';
import { getRedisClient } from '@/lib/redis';
import logger from '@/lib/logger';
import { z } from 'zod';

const verifyOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  otp: z.string().length(6),
});

// In-memory OTP store (matches the send route fallback)
const otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp } = verifyOtpSchema.parse(body);

    // Normalize phone
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const normalizedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;

    // Rate limit verification attempts
    const rl = await rateLimiters.auth.checkLimit(`otp-verify:${normalizedPhone}`);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Retrieve stored OTP
    let storedData: { otp: string; attempts: number } | null = null;
    const redis = getRedisClient();

    if (redis) {
      const raw = await redis.get(`otp:${normalizedPhone}`);
      if (raw) {
        storedData = JSON.parse(raw);
      }
    } else {
      // In-memory fallback
      const memEntry = otpStore.get(normalizedPhone);
      if (memEntry && memEntry.expiresAt > Date.now()) {
        storedData = { otp: memEntry.otp, attempts: memEntry.attempts };
      } else if (memEntry) {
        otpStore.delete(normalizedPhone);
      }
    }

    if (!storedData) {
      return NextResponse.json(
        { error: 'OTP expired or not found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check max verification attempts (prevent brute force)
    if (storedData.attempts >= 5) {
      // Delete the OTP
      if (redis) {
        await redis.del(`otp:${normalizedPhone}`);
      } else {
        otpStore.delete(normalizedPhone);
      }
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      // Increment attempts
      storedData.attempts++;
      if (redis) {
        const ttl = await redis.ttl(`otp:${normalizedPhone}`);
        await redis.set(
          `otp:${normalizedPhone}`,
          JSON.stringify(storedData),
          'EX',
          ttl > 0 ? ttl : 300
        );
      } else {
        const memEntry = otpStore.get(normalizedPhone);
        if (memEntry) memEntry.attempts++;
      }
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 401 }
      );
    }

    // OTP is valid — delete it
    if (redis) {
      await redis.del(`otp:${normalizedPhone}`);
    } else {
      otpStore.delete(normalizedPhone);
    }

    // Find or create user by phone
    let user = await prisma.user.findFirst({
      where: { phone: normalizedPhone },
      include: { brand: true },
    });

    let isNewUser = false;

    if (!user) {
      // Create new user with phone
      isNewUser = true;
      const placeholderEmail = `${normalizedPhone.replace('+', '')}@phone.parichay.io`;

      user = await prisma.user.create({
        data: {
          email: placeholderEmail,
          phone: normalizedPhone,
          firstName: '',
          lastName: '',
          passwordHash: '', // No password for phone-only users
          role: 'BUSINESS_OWNER',
          isActive: true,
          emailVerified: false,
        },
        include: { brand: true },
      });

      logger.info({ phone: normalizedPhone, userId: user.id }, 'New user created via phone OTP');
    } else {
      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
        },
      });

      logger.info({ phone: normalizedPhone, userId: user.id }, 'Existing user logged in via OTP');
    }

    // Generate tokens (same as login route)
    const accessToken = AuthService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      brandId: user.brandId || undefined,
    });

    const refreshToken = AuthService.generateRefreshToken(user.id);

    // Create response
    const response = NextResponse.json({
      success: true,
      isNewUser,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        brandId: user.brandId,
        brand: user.brand,
      },
      accessToken,
    });

    // Set cookies (same as login route)
    response.cookies.set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
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

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number and 6-digit OTP' },
        { status: 400 }
      );
    }

    logger.error({ error }, 'OTP verify error');
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
