/**
 * Individual Lead API
 * GET /api/leads/[id] - Get lead details
 * PUT /api/leads/[id] - Update lead
 * DELETE /api/leads/[id] - Delete lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-utils';
import { z } from 'zod';

const updateLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  nextFollowUpAt: z.string().datetime().optional(),
  assignedTo: z.string().optional(),
  conversionValue: z.number().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        branch: {
          include: {
            brand: true,
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Check authorization
    if (
      user.role !== 'SUPER_ADMIN' &&
      user.brandId !== lead.branch.brandId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get activities and reminders
    // TODO: Implement leadActivity and leadReminder models in Prisma schema
    const activities: any[] = [];
    const reminders: any[] = [];

    return NextResponse.json({
      ...lead,
      activities,
      reminders,
    });
  } catch (error) {
    console.error('Lead fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateLeadSchema.parse(body);

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { branch: true },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Check authorization
    if (
      user.role !== 'SUPER_ADMIN' &&
      user.brandId !== lead.branch.brandId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update lead
    // TODO: Add tags, nextFollowUpAt, lastContactedAt fields to Lead model
    const { tags, nextFollowUpAt, lastContactedAt, ...leadData } = validatedData as any;
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...leadData,
        metadata: {
          ...(lead.metadata as any || {}),
          ...(tags && { tags }),
          ...(nextFollowUpAt && { nextFollowUpAt }),
          ...(lastContactedAt && { lastContactedAt }),
        },
      },
    });

    // Log activity if status changed
    // TODO: Implement leadActivity model
    /* if (validatedData.status && validatedData.status !== (lead as any).status) {
      await prisma.leadActivity.create({
        data: {
          id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          leadId: id,
          activityType: 'status_change',
          description: `Status changed from ${(lead as any).status} to ${validatedData.status}`,
          createdBy: user.id,
          metadata: JSON.stringify({
            oldStatus: (lead as any).status,
            newStatus: validatedData.status,
          }),
        },
      });
    } */

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { branch: true },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Check authorization
    if (
      user.role !== 'SUPER_ADMIN' &&
      user.brandId !== lead.branch.brandId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Lead deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
