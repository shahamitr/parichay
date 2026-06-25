import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth-utils';

// =============================================================================
// GET /api/users/export - Export all users as CSV
// =============================================================================
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';

    const where: Record<string, unknown> = {};
    if (status === 'deleted') {
      where.deletedAt = { not: null };
    } else if (status === 'active') {
      where.deletedAt = null;
      where.isActive = true;
    } else if (status === 'inactive') {
      where.deletedAt = null;
      where.isActive = false;
    } else {
      where.deletedAt = null;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        phone: true,
        lastLoginAt: true,
        lastLogoutAt: true,
        createdAt: true,
        deletedAt: true,
        brand: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Build CSV
    const headers = [
      'ID', 'First Name', 'Last Name', 'Email', 'Role',
      'Status', 'Phone', 'Brand', 'Last Login', 'Last Logout',
      'Created At', 'Deleted At',
    ];

    const rows = users.map(u => [
      u.id,
      u.firstName,
      u.lastName,
      u.email,
      u.role,
      u.deletedAt ? 'Deleted' : u.isActive ? 'Active' : 'Inactive',
      u.phone || '',
      u.brand?.name || '',
      u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : '',
      u.lastLogoutAt ? new Date(u.lastLogoutAt).toISOString() : '',
      new Date(u.createdAt).toISOString(),
      u.deletedAt ? new Date(u.deletedAt).toISOString() : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
