/**
 * Admin Data Export API
 * GET /api/admin/export?type=users|leads|analytics&format=csv
 *
 * Exports data as CSV for compliance, reporting, and backup purposes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { logAuditEvent, AuditEventType, getIpAddress } from '@/lib/audit-trail';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'leads';
    const format = searchParams.get('format') || 'csv';

    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'users': {
        if (user.role !== 'SUPER_ADMIN') {
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        const users = await prisma.user.findMany({
          where: { deletedAt: null },
          select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true, lastLoginAt: true },
          orderBy: { createdAt: 'desc' },
        });
        const headers = ['ID', 'Email', 'First Name', 'Last Name', 'Role', 'Active', 'Created', 'Last Login'];
        const rows = users.map((u) => [u.id, u.email, u.firstName, u.lastName, u.role, u.isActive, u.createdAt.toISOString(), u.lastLoginAt?.toISOString() || '']);
        csvContent = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n');
        filename = `users-export-${Date.now()}.csv`;
        break;
      }

      case 'leads': {
        const where: any = {};
        if (user.role !== 'SUPER_ADMIN') {
          where.brandId = user.brandId;
        }
        const leads = await prisma.lead.findMany({
          where,
          select: { id: true, name: true, email: true, phone: true, message: true, source: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 1000,
        });
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Message', 'Source', 'Status', 'Date'];
        const rows = leads.map((l) => [l.id, l.name, l.email || '', l.phone || '', (l.message || '').replace(/"/g, '""'), l.source || '', l.status, l.createdAt.toISOString()]);
        csvContent = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n');
        filename = `leads-export-${Date.now()}.csv`;
        break;
      }

      case 'analytics': {
        const where: any = {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        };
        if (user.role !== 'SUPER_ADMIN') {
          where.brandId = user.brandId;
        }
        const events = await prisma.analyticsEvent.findMany({
          where,
          select: { id: true, eventType: true, branchId: true, createdAt: true, metadata: true },
          orderBy: { createdAt: 'desc' },
          take: 5000,
        });
        const headers = ['ID', 'Event Type', 'Branch ID', 'Date', 'Metadata'];
        const rows = events.map((e) => [e.id, e.eventType, e.branchId || '', e.createdAt.toISOString(), JSON.stringify(e.metadata || {}).replace(/"/g, '""')]);
        csvContent = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n');
        filename = `analytics-export-${Date.now()}.csv`;
        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid export type. Use: users, leads, analytics' }, { status: 400 });
    }

    // Audit log
    await logAuditEvent({
      eventType: AuditEventType.DATA_EXPORTED,
      userId: user.id,
      resourceType: type,
      ipAddress: getIpAddress(request.headers),
      metadata: { exportType: type, format },
    });

    // Return CSV
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
