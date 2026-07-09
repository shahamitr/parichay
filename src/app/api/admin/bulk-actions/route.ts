/**
 * Admin Bulk Actions API
 * POST /api/admin/bulk-actions — Perform actions on multiple users/branches at once
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { logAuditEvent, AuditEventType, getIpAddress } from '@/lib/audit-trail';
import { z } from 'zod';

const bulkActionSchema = z.object({
  action: z.enum(['activate', 'deactivate', 'delete', 'restore', 'verify', 'unverify']),
  resourceType: z.enum(['user', 'branch']),
  ids: z.array(z.string()).min(1).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Super Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { action, resourceType, ids } = bulkActionSchema.parse(body);

    let affected = 0;

    if (resourceType === 'user') {
      switch (action) {
        case 'activate':
          const activateResult = await prisma.user.updateMany({
            where: { id: { in: ids }, deletedAt: null },
            data: { isActive: true },
          });
          affected = activateResult.count;
          break;

        case 'deactivate':
          // Prevent deactivating yourself
          const safeIds = ids.filter((id) => id !== user.id);
          const deactivateResult = await prisma.user.updateMany({
            where: { id: { in: safeIds }, deletedAt: null },
            data: { isActive: false },
          });
          affected = deactivateResult.count;
          break;

        case 'delete':
          const deleteIds = ids.filter((id) => id !== user.id);
          const deleteResult = await prisma.user.updateMany({
            where: { id: { in: deleteIds }, deletedAt: null },
            data: { deletedAt: new Date(), isActive: false },
          });
          affected = deleteResult.count;
          break;

        case 'restore':
          const restoreResult = await prisma.user.updateMany({
            where: { id: { in: ids }, deletedAt: { not: null } },
            data: { deletedAt: null, isActive: true },
          });
          affected = restoreResult.count;
          break;
      }
    } else if (resourceType === 'branch') {
      switch (action) {
        case 'activate':
          const branchActivate = await prisma.branch.updateMany({
            where: { id: { in: ids } },
            data: { isActive: true },
          });
          affected = branchActivate.count;
          break;

        case 'deactivate':
          const branchDeactivate = await prisma.branch.updateMany({
            where: { id: { in: ids } },
            data: { isActive: false },
          });
          affected = branchDeactivate.count;
          break;

        case 'verify':
          const branchVerify = await prisma.branch.updateMany({
            where: { id: { in: ids } },
            data: { isVerified: true, verifiedAt: new Date(), verifiedBy: user.id },
          });
          affected = branchVerify.count;
          break;

        case 'unverify':
          const branchUnverify = await prisma.branch.updateMany({
            where: { id: { in: ids } },
            data: { isVerified: false, verifiedAt: null, verifiedBy: null },
          });
          affected = branchUnverify.count;
          break;
      }
    }

    // Audit log
    await logAuditEvent({
      eventType: AuditEventType.DATA_MODIFIED,
      userId: user.id,
      resourceType: resourceType === 'user' ? 'User' : 'Branch',
      ipAddress: getIpAddress(request.headers),
      metadata: { action, ids, affected, bulkOperation: true },
    });

    return NextResponse.json({
      success: true,
      affected,
      message: `${action} applied to ${affected} ${resourceType}(s)`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 });
    }
    console.error('Bulk action error:', error);
    return NextResponse.json({ error: 'Bulk action failed' }, { status: 500 });
  }
}
