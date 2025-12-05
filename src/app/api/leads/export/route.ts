/**
 * Leads Export API
 * GET /api/leads/export - Export leads data as CSV
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';
import { generateCSVString } from '@/lib/csv-export';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause based on user role and filters
    const where: any = {};

    if (user.role === 'SUPER_ADMIN') {
      if (branchId) where.branchId = branchId;
    } else if (user.role === 'BRAND_MANAGER') {
      // Get all branches for the brand
      const branches = await prisma.branch.findMany({
        where: { brandId: user.brandId },
        select: { id: true },
      });
      where.branchId = {
        in: branches.map((b) => b.id),
      };
      if (branchId) where.branchId = branchId;
    } else {
      where.branchId = {
        in: user.branches?.map((b) => b.id),
      };
      if (branchId && user.branches?.some((b) => b.id === branchId)) {
        where.branchId = branchId;
      }
    }

    // Add date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Fetch leads
    const leads = await prisma.lead.findMany({
      where,
      include: {
        branch: {
          select: {
            name: true,
            slug: true,
            brand: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format data for CSV
    const csvData = leads.map((lead) => ({
      Date: lead.createdAt.toISOString(),
      Name: lead.name,
      Email: lead.email || 'N/A',
      Phone: lead.phone || 'N/A',
      Message: lead.message || 'N/A',
      Source: lead.source,
      Branch: lead.branch.name,
      Brand: lead.branch?.brand.name,
      Metadata: JSON.stringify(lead.metadata || {}),
    }));

    // Generate CSV
    const csv = generateCSVString(csvData);

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Leads export error:', error);
    return NextResponse.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    );
  }
}
