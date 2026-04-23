import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getAuthUser } from '@/lib/auth';

/**
 * GET /api/birthday-templates
 * Get birthday template for a branch
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getAuthUser(token);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    if (!branchId) {
      return NextResponse.json({ error: 'Branch ID required' }, { status: 400 });
    }

    // Get template or return default
    const template = await prisma.birthdayTemplate.findUnique({
      where: { branchId },
    });

    if (template) {
      return NextResponse.json({ success: true, template });
    }

    // Return default template structure
    return NextResponse.json({
      success: true,
      template: {
        branchId,
        subject: 'Happy Birthday! 🎂',
        message: `Dear {{name}},\n\nWishing you a wonderful birthday from all of us at {{businessName}}!\n\nAs a token of our appreciation, here's a special discount code just for you: {{discount}}\n\nEnjoy your special day!\n\nBest wishes,\n{{businessName}}`,
        discountCode: null,
        discountPercent: null,
        discountValidDays: 7,
        isActive: false,
        sendVia: 'email',
      },
    });
  } catch (error) {
    console.error('Error fetching birthday template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/birthday-templates
 * Create or update birthday template
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getAuthUser(token);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      branchId,
      subject,
      message,
      discountCode,
      discountPercent,
      discountValidDays,
      isActive,
      sendVia,
    } = body;

    if (!branchId) {
      return NextResponse.json({ error: 'Branch ID required' }, { status: 400 });
    }

    // Verify user has access to this branch
    const branch = await prisma.branch.findFirst({
      where: {
        id: branchId,
        OR: [
          { brandId: user.brandId || '' },
          { admins: { some: { id: user.id } } },
        ],
      },
    });

    if (!branch && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Upsert template
    const template = await prisma.birthdayTemplate.upsert({
      where: { branchId },
      update: {
        subject: subject || 'Happy Birthday! 🎂',
        message: message || '',
        discountCode,
        discountPercent: discountPercent ? parseInt(discountPercent) : null,
        discountValidDays: discountValidDays || 7,
        isActive: isActive ?? false,
        sendVia: sendVia || 'email',
      },
      create: {
        branchId,
        subject: subject || 'Happy Birthday! 🎂',
        message: message || '',
        discountCode,
        discountPercent: discountPercent ? parseInt(discountPercent) : null,
        discountValidDays: discountValidDays || 7,
        isActive: isActive ?? false,
        sendVia: sendVia || 'email',
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Error saving birthday template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
