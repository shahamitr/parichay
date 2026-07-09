/**
 * Bulk WhatsApp Broadcast API
 * POST /api/my-business/broadcast — Generate broadcast message links for leads
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { decryptPhone } from '@/lib/encryption';
import { z } from 'zod';

const broadcastSchema = z.object({
  message: z.string().min(1).max(4096),
  filterStatus: z
    .enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CONVERTED', 'LOST', 'ARCHIVED', ''])
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { message, filterStatus } = broadcastSchema.parse(body);

    // Find user's brand
    const brand = await prisma.brand.findFirst({
      where: {
        OR: [{ ownerId: user.id }, { users: { some: { id: user.id } } }],
      },
      include: {
        branches: { where: { isActive: true }, select: { id: true } },
      },
    });

    if (!brand || brand.branches.length === 0) {
      return NextResponse.json({ error: 'No business found' }, { status: 404 });
    }

    const branchIds = brand.branches.map((b) => b.id);

    // Build filter query
    const where: any = {
      branchId: { in: branchIds },
    };

    if (filterStatus) {
      where.status = filterStatus;
    }

    // Get leads with phone numbers
    const leads = await prisma.lead.findMany({
      where,
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Build recipients with personalized messages
    const recipients = leads
      .map((lead) => {
        const phone = decryptPhone(lead.phone) || lead.phone;
        if (!phone) return null;

        // Clean phone number (remove spaces, dashes, etc.)
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '').replace(/^\+/, '');
        const personalizedMessage = message.replace(/\{name\}/gi, lead.name);

        return {
          id: lead.id,
          name: lead.name,
          phone,
          cleanPhone,
          status: lead.status,
          waLink: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalizedMessage)}`,
        };
      })
      .filter(Boolean);

    // Generate a generic broadcast URL (first recipient) for quick access
    const encodedMessage = encodeURIComponent(message.replace(/\{name\}/gi, ''));
    const broadcastUrl = `https://wa.me/?text=${encodedMessage}`;

    return NextResponse.json({
      success: true,
      totalLeads: leads.length,
      recipients,
      broadcastUrl,
      message,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Broadcast error:', error);
    return NextResponse.json({ error: 'Failed to generate broadcast' }, { status: 500 });
  }
}
