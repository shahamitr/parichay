import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import {
  listMicrositeAssets,
  getMicrositeStorageUsage,
  deleteMicrositeAsset,
  AssetType,
  formatBytes,
} from '@/lib/microsite-assets';

/**
 * GET /api/microsites/[id]/assets
 * List all assets for a microsite
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: branchId } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify branch exists and user has access
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        brand: {
          select: { id: true, ownerId: true },
        },
      },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Check access
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      branch.brand.ownerId === user.id ||
      user.brandId === branch.brandId;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get assets and storage usage
    const [assets, storage] = await Promise.all([
      listMicrositeAssets(branchId),
      getMicrositeStorageUsage(branchId),
    ]);

    return NextResponse.json({
      success: true,
      branchId,
      branchName: branch.name,
      assets,
      storage: {
        total: storage.total,
        totalFormatted: formatBytes(storage.total),
        byType: Object.entries(storage.byType).reduce(
          (acc, [type, bytes]) => ({
            ...acc,
            [type]: {
              bytes,
              formatted: formatBytes(bytes as number),
            },
          }),
          {}
        ),
      },
    });
  } catch (error) {
    console.error('Error listing microsite assets:', error);
    return NextResponse.json(
      { error: 'Failed to list assets' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/microsites/[id]/assets
 * Delete a specific asset from a microsite
 *
 * Query params:
 * - type: Asset type (logo, gallery, video, etc.)
 * - filename: Filename to delete
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: branchId } = await params;
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assetType = searchParams.get('type') as AssetType | null;
    const filename = searchParams.get('filename');

    if (!assetType || !filename) {
      return NextResponse.json(
        { error: 'type and filename are required' },
        { status: 400 }
      );
    }

    // Verify branch exists and user has access
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        brand: {
          select: { id: true, ownerId: true },
        },
      },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Check access (only owner or admin can delete)
    const hasAccess =
      user.role === 'SUPER_ADMIN' ||
      branch.brand.ownerId === user.id;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the asset
    const deleted = await deleteMicrositeAsset(branchId, assetType, filename);

    if (!deleted) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully',
      branchId,
      assetType,
      filename,
    });
  } catch (error) {
    console.error('Error deleting microsite asset:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}
