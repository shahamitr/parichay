/**
 * Individual Short Link API
 * DELETE /api/short-links/[id] - Delete short link
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = authResult.user;

    const { id } = await params;

    // Find the short link
    const shortLink = await prisma.shortLink.findUnique({
      where: { id },
    });

    if (!shortLink) {
      return NextResponse.json({ error: 'Short link not found' }, { status: 404 });
    }

    // Check authorization
    if (user.role !== 'SUPER_ADMIN') {
      const hasAccess =
        (shortLink.brandId && user.brandId === shortLink.brandId) ||
        (shortLink.branchId && user.branches.some((b: any) => b.id === shortLink.branchId));

      if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Delete the short link
    await prisma.shortLink.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Short link deleted successfully' });
  } catch (error) {
    console.error('Short link deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete short link' },
      { status: 500 }
    );
  }
}
