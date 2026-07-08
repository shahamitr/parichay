/**
 * OTP Send API
 * POST /api/auth/otp/send — Send OTP to phone number via SMS
 *
 * Used for phone-first login/registration (India market).
 * Rate limited: 3 OTPs per phone per 15 minutes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/rate-limiter';
import { validateFormSubmission } from '@/lib/bot-protection';
import { getRedisClient } from '@/lib/redis';
import logger from '@/lib/logger';
import { z } from 'zod';
import crypto from 'crypto';

const sendOtpSchema = z.object({
  phone: z.string().min(10).max(15),
});

// In-memory OTP store (fallback when Redis unavailable)
const otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Bot protection
    const botCheck = validateFormSubmission(request, body);
    if (!botCheck.allowed) {
      return NextResponse.json({ success: true, message: 'OTP sent' });
    }

    const { phone } = sendOtpSchema.parse(body);

    // Clean phone (keep only digits, allow leading +)
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const normalizedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;

    // Rate limit: 3 OTPs per phone per 15 min
    const rl = await rateLimiters.auth.checkLimit(`otp:${normalizedPhone}`);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait 15 minutes.' },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    const redis = getRedisClient();
    if (redis) {
      await redis.set(`otp:${normalizedPhone}`, JSON.stringify({ otp, attempts: 0 }), 'EX', 300);
    } else {
      otpStore.set(normalizedPhone, { otp, expiresAt, attempts: 0 });
    }

    // Send OTP via SMS (Twilio)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const twilio = await import('twilio');
        const client = twilio.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          body: `Your Parichay verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: normalizedPhone,
        });
        logger.info({ phone: normalizedPhone }, 'OTP sent via Twilio');
      } catch (smsError) {
        logger.error({ smsError, phone: normalizedPhone }, 'Twilio SMS failed');
        // Don't fail — in dev, log the OTP
        if (process.env.NODE_ENV === 'development') {
          logger.info({ phone: normalizedPhone, otp }, 'DEV OTP (Twilio failed)');
        }
      }
    } else {
      // No Twilio configured — log OTP for development
      logger.info({ phone: normalizedPhone, otp }, 'DEV MODE: OTP generated (no SMS provider)');
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your phone number',
      // Only expose OTP in development for testing
      ...(process.env.NODE_ENV === 'development' && { devOtp: otp }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please enter a valid phone number' }, { status: 400 });
    }
    logger.error({ error }, 'OTP send error');
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
