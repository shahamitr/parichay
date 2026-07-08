/**
 * Branch API — Individual branch operations
 * GET /api/branches/[id] — Get branch details
 * PATCH /api/branches/[id] — Update branch (including feature toggles)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: { brand: { select: { id: true, name: true, slug: true, ownerId: true } } },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    return NextResponse.json(branch);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch branch' }, { status: 500 });
  }
}

const updateBranchSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.any().optional(),
  contact: z.any().optional(),
  businessHours: z.any().optional(),
  micrositeConfig: z.any().optional(),
  sectionOrder: z.array(z.object({ id: z.string(), enabled: z.boolean() })).optional(),
  isActive: z.boolean().optional(),
}).passthrough();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: { brand: { select: { ownerId: true } } },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    if (user.role !== 'SUPER_ADMIN' && branch.brand.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const data = updateBranchSchema.parse(body);

    // If sectionOrder is provided, merge it into micrositeConfig
    if (data.sectionOrder) {
      const currentConfig = (branch.micrositeConfig as Record<string, any>) || {};
      const updatedConfig = {
        ...currentConfig,
        sectionOrder: data.sectionOrder,
        // Also update individual section enabled states
        sections: {
          ...(currentConfig.sections || {}),
        },
      };

      // Sync enabled state into sections
      for (const item of data.sectionOrder) {
        if (updatedConfig.sections[item.id]) {
          updatedConfig.sections[item.id].enabled = item.enabled;
        } else {
          updatedConfig.sections[item.id] = { enabled: item.enabled };
        }
      }

      const updated = await prisma.branch.update({
        where: { id },
        data: { micrositeConfig: updatedConfig },
      });

      return NextResponse.json({ success: true, branch: updated });
    }

    // General update
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.address) updateData.address = data.address;
    if (data.contact) updateData.contact = data.contact;
    if (data.businessHours) updateData.businessHours = data.businessHours;
    if (data.micrositeConfig) updateData.micrositeConfig = data.micrositeConfig;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const updated = await prisma.branch.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, branch: updated });
  } catch (error) {
    console.error('Branch update error:', error);
    return NextResponse.json({ error: 'Failed to update branch' }, { status: 500 });
  }
}
