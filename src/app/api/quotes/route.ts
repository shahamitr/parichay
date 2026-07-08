/**
 * Quote Requests API
 * POST /api/quotes — Submit a quote request (public, with bot protection)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateFormSubmission } from '@/lib/bot-protection';
import { rateLimiters } from '@/lib/rate-limiter';
import { z } from 'zod';

const quoteSchema = z.object({
  branchId: z.string().min(1),
  brandId: z.string().min(1),
  service: z.string().min(1).max(200),
  preferredDate: z.string().optional().or(z.literal('')),
  budgetRange: z.string().optional().or(z.literal('')),
  name: z.string().min(1).max(200),
  phone: z.string().min(7).max(20),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Rate limit
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rl = await rateLimiters.formSubmission.checkLimit(`quote:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json({ success: true, message: 'Quote request submitted!' });
    }

    // Bot protection
    const botCheck = validateFormSubmission(request, body);
    if (!botCheck.allowed) {
      return NextResponse.json({ success: true, message: 'Quote request submitted!' });
    }

    // Validate input
    const data = quoteSchema.parse(body);

    // Verify branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: data.branchId },
      select: { id: true, brandId: true },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Invalid branch' }, { status: 400 });
    }

    // Store as a lead with quote metadata
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        message: `Quote Request: ${data.service}${data.preferredDate ? ` | Date: ${data.preferredDate}` : ''}${data.budgetRange ? ` | Budget: ${data.budgetRange}` : ''}${data.notes ? ` | Notes: ${data.notes}` : ''}`,
        source: 'quote_request',
        status: 'NEW',
        branchId: data.branchId,
        brandId: branch.brandId,
        metadata: {
          type: 'quote_request',
          service: data.service,
          preferredDate: data.preferredDate || null,
          budgetRange: data.budgetRange || null,
          notes: data.notes || null,
        },
      },
    });

    // Track analytics event
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'LEAD_SUBMIT',
        branchId: data.branchId,
        brandId: branch.brandId,
        metadata: {
          leadId: lead.id,
          source: 'quote_request',
          service: data.service,
        },
      },
    });

    // Notify brand owner (non-blocking)
    try {
      const brand = await prisma.brand.findUnique({
        where: { id: branch.brandId },
        include: { users: { where: { role: 'BRAND_MANAGER' }, take: 1, select: { email: true } } },
      });
      if (brand?.users[0]?.email) {
        const { emailService } = await import('@/lib/email-service');
        emailService.sendLeadNotificationEmail(
          brand.users[0].email,
          data.name,
          brand.name,
          `Quote request for: ${data.service}`
        ).catch(() => {});
      }
    } catch {} // Silent — notification is best-effort

    return NextResponse.json({
      success: true,
      message: 'Your quote request has been submitted! We will get back to you soon.',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Please fill in all required fields correctly.' },
        { status: 400 }
      );
    }
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
