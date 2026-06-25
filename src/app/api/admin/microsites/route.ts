import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    
    if (!payload || payload.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const branches = await prisma.branch.findMany({
      include: {
        brand: true,
        _count: {
          select: {
            leads: true,
            analytics: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const microsites = branches.map(branch => ({
      id: branch.id,
      slug: branch.slug,
      title: `${branch.name} - ${branch.brand.name}`,
      description: branch.businessType ? `A ${branch.businessType} business` : 'A microsite on Parichay',
      isActive: branch.isActive,
      customDomain: null,
      theme: (branch.micrositeConfig as any)?.theme || 'modern',
      views: branch._count.analytics,
      leads: branch._count.leads,
      lastUpdated: branch.updatedAt.toISOString(),
      branch: {
        id: branch.id,
        name: branch.name,
        brand: {
          id: branch.brand.id,
          name: branch.brand.name,
          slug: branch.brand.slug
        }
      },
      features: {
        appointments: true,
        gallery: true,
        testimonials: true,
        products: true,
        services: true
      }
    }));

    return NextResponse.json({
      success: true,
      microsites
    });
  } catch (error) {
    console.error('Failed to fetch microsites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch microsites' },
      { status: 500 }
    );
  }
}