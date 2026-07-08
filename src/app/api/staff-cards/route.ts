/**
 * Staff Digital Cards API
 * GET /api/staff-cards?branchId=xxx — Get staff cards for a branch
 *
 * Each staff member gets their own shareable digital card link.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    if (!branchId) {
      return NextResponse.json({ error: 'branchId required' }, { status: 400 });
    }

    // Look up the branch with its microsite config (team section stores staff data)
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: {
        id: true,
        slug: true,
        name: true,
        micrositeConfig: true,
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Extract team/staff data from microsite config
    const config = branch.micrositeConfig as Record<string, unknown> | null;
    const sections = config?.sections as Record<string, unknown> | undefined;
    const teamSection = sections?.team as { enabled?: boolean; members?: StaffMember[] } | undefined;

    if (!teamSection?.enabled || !teamSection.members || teamSection.members.length === 0) {
      return NextResponse.json({ staffCards: [] });
    }

    // Generate individual card data for each staff member
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://parichay.app';
    const brandSlug = branch.brand.slug;
    const branchSlug = branch.slug;

    const staffCards = teamSection.members.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      photo: member.photo || null,
      email: member.email || null,
      phone: member.phone || null,
      bio: member.bio || null,
      social: member.social || null,
      // Individual shareable link for each staff member
      shareUrl: `${baseUrl}/${brandSlug}/${branchSlug}/staff/${member.id}`,
      // QR code generation URL (can be rendered client-side)
      qrCodeUrl: `${baseUrl}/api/qrcodes/generate?url=${encodeURIComponent(`${baseUrl}/${brandSlug}/${branchSlug}/staff/${member.id}`)}`,
      // Business context
      businessName: branch.brand.name,
      branchName: branch.name,
      brandLogo: branch.brand.logo,
    }));

    return NextResponse.json({
      staffCards,
      total: staffCards.length,
      branchName: branch.name,
      businessName: branch.brand.name,
    });
  } catch (error) {
    console.error('Staff cards fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff cards' },
      { status: 500 }
    );
  }
}

// Type for staff member from microsite team config
interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  email?: string;
  phone?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}
