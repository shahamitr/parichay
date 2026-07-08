/**
 * Contact Form API
 * POST /api/contact — Handle contact page submissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateFormSubmission } from '@/lib/bot-protection';
import { rateLimiters } from '@/lib/rate-limiter';
import { emailService } from '@/lib/email-service';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Rate limit
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rl = await rateLimiters.formSubmission.checkLimit(`contact:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json({ success: true, message: 'Message sent!' });
    }

    // Bot protection
    const botCheck = validateFormSubmission(request, body);
    if (!botCheck.allowed) {
      return NextResponse.json({ success: true, message: 'Message sent!' });
    }

    const data = contactSchema.parse(body);

    // Send email to support
    const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@parichay.io';
    await emailService.sendEmail({
      to: supportEmail,
      subject: `Contact Form: ${data.name} — ${data.email}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:500px;">
          <h2 style="color:#111;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong></p>
          <p style="background:#f3f4f6;padding:12px;border-radius:8px;">${data.message}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! We\'ll get back to you within 24 hours.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please fill all fields correctly.' }, { status: 400 });
    }
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
