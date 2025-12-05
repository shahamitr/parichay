// @ts-nocheck
/**
 * Agency Billing API
 * GET /api/agency/billing - Get billing history and current usage
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    if (!user.tenantId || user.role !== 'TENANT_ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Tenant admin required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Get tenant info
    const tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
      select: {
        id: true,
        name: true,
        plan: true,
        clientLimit: true,
        pricePerClient: true,
        status: true,
        trialEndsAt: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    // Get current usage
    const activeClients = await prisma.tenantClient.count({
      where: {
        tenantId: user.tenantId,
        status: 'ACTIVE',
      },
    });

    // Get billing history
    const [billingRecords, total] = await Promise.all([
      prisma.tenantBilling.findMany({
        where: { tenantId: user.tenantId },
        orderBy: { periodStart: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.tenantBilling.count({
        where: { tenantId: user.tenantId },
      }),
    ]);

    // Calculate current month estimate
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const currentMonthBilling = await prisma.tenantBilling.findFirst({
      where: {
        tenantId: user.tenantId,
        periodStart: currentMonthStart,
      },
    });

    // Get plan pricing
    const planPricing = {
      AGENCY_STARTER: 99,
      AGENCY_PRO: 299,
      AGENCY_ENTERPRISE: 999,
    };

    const baseFee = planPricing[tenant.plan] || 0;
    const clientFees = activeClients * tenant.pricePerClient;
    const estimatedTotal = baseFee + clientFees;

    // Calculate year-to-date
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const ytdBilling = await prisma.tenantBilling.aggregate({
      where: {
        tenantId: user.tenantId,
        periodStart: { gte: yearStart },
        status: 'PAID',
      },
      _sum: {
        total: true,
      },
    });

    return NextResponse.json({
      tenant: {
        name: tenant.name,
        plan: tenant.plan,
        clientLimit: tenant.clientLimit,
        pricePerClient: tenant.pricePerClient,
        status: tenant.status,
        trialEndsAt: tenant.trialEndsAt,
      },
      currentUsage: {
        activeClients,
        clientLimit: tenant.clientLimit,
        utilizationPercent: Math.round((activeClients / tenant.clientLimit) * 100),
      },
      currentMonth: {
        baseFee,
        clientFees,
        estimatedTotal,
        billingRecord: currentMonthBilling,
      },
      yearToDate: {
        total: ytdBilling._sum.total || 0,
      },
      billingHistory: billingRecords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Billing error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billing data' },
      { status: 500 }
    );
  }
}
