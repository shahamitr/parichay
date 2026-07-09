/**
 * My Business Leads API
 * GET /api/my-business/leads — Get leads for the owner's business
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { decryptPhone } from '@/lib/encryption';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const status = searchParams.get('status') || '';

    // Find user's brand
    const brand = await prisma.brand.findFirst({
      where: {
        OR: [{ ownerId: user.id }, { users: { some: { id: user.id } } }],
      },
      select: { id: true },
    });

    if (!brand) {
      return NextResponse.json({ leads: [], total: 0 });
    }

    const where: any = { brandId: brand.id };
    if (status) where.status = status;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          message: true,
          source: true,
          status: true,
          createdAt: true,
          branch: { select: { name: true } },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    // Decrypt phone numbers for display
    const decryptedLeads = leads.map((lead) => ({
      ...lead,
      phone: decryptPhone(lead.phone) || lead.phone,
    }));

    return NextResponse.json({
      leads: decryptedLeads,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('My leads error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
