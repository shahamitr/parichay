/**
 * Branch Verification API
 * POST /api/branches/[id]/verify - Verify a branch
 * GET /api/branches/[id]/verify - Get verification status
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';
import { z } from 'zod';

const verifyBranchSchema = z.object({
  notes: z.string().optional(),
});

// Calculate completion score based on available data
function calculateCompletionScore(branch: any): number {
  let score = 0;
  const maxScore = 100;

  // Basic info (20 points)
  if (branch.name) score += 5;
  if (branch.slug) score += 5;
  if (branch.isActive) score += 5;
  if (branch.brand?.logo) score += 5;

  // Contact info (20 points)
  const contact = branch.contact || {};
  if (contact.phone) score += 7;
  if (contact.email) score += 7;
  if (contact.whatsapp) score += 6;

  // Address (15 points)
  const address = branch.address || {};
  if (address.street) score += 3;
  if (address.city) score += 3;
  if (address.state) score += 3;
  if (address.zipCode) score += 3;
  if (address.country) score += 3;

  // Social media (10 points)
  const social = branch.socialMedia || {};
  if (social.facebook) score += 2.5;
  if (social.instagram) score += 2.5;
  if (social.linkedin) score += 2.5;
  if (social.twitter) score += 2.5;

  // Business hours (10 points)
  if (branch.businessHours) score += 10;

  // Microsite config (25 points)
  const config = branch.micrositeConfig?.sections || {};
  if (config.hero?.enabled) score += 5;
  if (config.about?.enabled && config.about?.content) score += 5;
  if (config.services?.enabled && config.services?.items?.length > 0) score += 5;
  if (config.gallery?.enabled && config.gallery?.images?.length > 0) score += 5;
  if (config.contact?.enabled) score += 5;

  return Math.min(Math.round(score), maxScore);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    // Only admins can verify
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'BRAND_MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = verifyBranchSchema.parse(body);

    // Get branch with all data
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        brand: true,
      },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Calculate completion score
    const completionScore = calculateCompletionScore(branch);

    // Branch must have at least 80% completion to be verified
    if (completionScore < 80) {
      return NextResponse.json(
        {
          error: 'Branch does not meet verification requirements',
          completionScore,
          requiredScore: 80,
          missingFields: getMissingFields(branch),
        },
        { status: 400 }
      );
    }

    // Update branch verification
    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: user.id,
        verificationNotes: validatedData.notes || null,
        completionScore,
      },
    });

    return NextResponse.json({
      success: true,
      branch: updatedBranch,
      completionScore,
    });
  } catch (error) {
    console.error('Branch verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify branch' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        brand: true,
      },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    const completionScore = calculateCompletionScore(branch);
    const missingFields = getMissingFields(branch);

    return NextResponse.json({
      isVerified: (branch as any).isVerified || false,
      verifiedAt: (branch as any).verifiedAt || null,
      completionScore,
      requiredScore: 80,
      canVerify: completionScore >= 80,
      missingFields,
    });
  } catch (error) {
    console.error('Verification status error:', error);
    return NextResponse.json(
      { error: 'Failed to get verification status' },
      { status: 500 }
    );
  }
}

function getMissingFields(branch: any): string[] {
  const missing: string[] = [];

  // Check contact
  const contact = branch.contact || {};
  if (!contact.phone) missing.push('Phone number');
  if (!contact.email) missing.push('Email address');

  // Check address
  const address = branch.address || {};
  if (!address.street) missing.push('Street address');
  if (!address.city) missing.push('City');
  if (!address.state) missing.push('State');
  if (!address.zipCode) missing.push('ZIP code');

  // Check business hours
  if (!branch.businessHours) missing.push('Business hours');

  // Check microsite content
  const config = branch.micrositeConfig?.sections || {};
  if (!config.about?.content) missing.push('About section content');
  if (!config.services?.items || config.services.items.length === 0) {
    missing.push('Services/Products');
  }
  if (!config.gallery?.images || config.gallery.images.length === 0) {
    missing.push('Gallery images');
  }

  // Check brand logo
  if (!branch.brand?.logo) missing.push('Brand logo');

  return missing;
}
