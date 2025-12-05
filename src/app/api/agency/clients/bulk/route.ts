// @ts-nocheck
/**
 * Bulk Client Operations API
 * POST /api/agency/clients/bulk - Perform bulk operations on clients
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

const bulkOperationSchema = z.object({
  operation: z.enum(['activate', 'deactivate', 'delete', 'update_fee']),
  clientIds: z.array(z.string()).min(1),
  data: z.any().optional(), // Operation-specific data
});

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { operation, clientIds, data } = bulkOperationSchema.parse(body);

    // Verify all clients belong to this tenant
    const clients = await prisma.tenantClient.findMany({
      where: {
        id: { in: clientIds },
        tenantId: user.tenantId,
      },
    });

    if (clients.length !== clientIds.length) {
      return NextResponse.json(
        { error: 'Some clients not found or access denied' },
        { status: 403 }
      );
    }

    let result;

    switch (operation) {
      case 'activate':
        result = await prisma.tenantClient.updateMany({
          where: {
            id: { in: clientIds },
            tenantId: user.tenantId,
          },
          data: {
            status: 'ACTIVE',
            isActive: true,
          },
        });
        break;

      case 'deactivate':
        result = await prisma.tenantClient.updateMany({
          where: {
            id: { in: clientIds },
            tenantId: user.tenantId,
          },
          data: {
            status: 'INACTIVE',
            isActive: false,
          },
        });
        break;

      case 'delete':
        // Soft delete - just deactivate
        result = await prisma.tenantClient.updateMany({
          where: {
            id: { in: clientIds },
            tenantId: user.tenantId,
          },
          data: {
            status: 'DELETED',
            isActive: false,
          },
        });
        break;

      case 'update_fee':
        if (!data?.monthlyFee) {
          return NextResponse.json(
            { error: 'Monthly fee required for update_fee operation' },
            { status: 400 }
          );
        }
        result = await prisma.tenantClient.updateMany({
          where: {
            id: { in: clientIds },
            tenantId: user.tenantId,
          },
          data: {
            monthlyFee: data.monthlyFee,
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      operation,
      affected: result.count,
      message: `Successfully ${operation}d ${result.count} client(s)`,
    });
  } catch (error) {
    console.error('Bulk operation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}
