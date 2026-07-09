/**
 * Appointment Slot Management API
 * GET /api/my-business/slots — Get slot configuration
 * POST /api/my-business/slots — Create/update slot configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

const timeSlotSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  end: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
});

const slotConfigSchema = z.object({
  slotDuration: z.number().min(15).max(120), // minutes
  maxBookingsPerSlot: z.number().min(1).max(5),
  breakBetweenSlots: z.number().min(0).max(60), // minutes
  blockedDates: z.array(z.string()).optional(), // ["2024-12-25"]
  customSlots: z
    .record(
      z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
      z.array(timeSlotSchema)
    )
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Find user's brand and branch
    const brand = await prisma.brand.findFirst({
      where: {
        OR: [{ ownerId: user.id }, { users: { some: { id: user.id } } }],
      },
      include: {
        branches: { where: { isActive: true }, take: 1 },
      },
    });

    if (!brand || !brand.branches[0]) {
      return NextResponse.json({ error: 'No business found' }, { status: 404 });
    }

    const branch = brand.branches[0];
    const micrositeConfig = (branch.micrositeConfig as any) || {};
    const slotConfig = micrositeConfig.booking || getDefaultSlotConfig();

    return NextResponse.json({
      success: true,
      config: slotConfig,
    });
  } catch (error) {
    console.error('Get slots error:', error);
    return NextResponse.json({ error: 'Failed to fetch slot configuration' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const config = slotConfigSchema.parse(body);

    // Find user's brand and branch
    const brand = await prisma.brand.findFirst({
      where: {
        OR: [{ ownerId: user.id }, { users: { some: { id: user.id } } }],
      },
      include: {
        branches: { where: { isActive: true }, take: 1 },
      },
    });

    if (!brand || !brand.branches[0]) {
      return NextResponse.json({ error: 'No business found' }, { status: 404 });
    }

    const branch = brand.branches[0];
    const micrositeConfig = (branch.micrositeConfig as any) || {};

    // Save slot configuration under booking key
    const updatedConfig = {
      ...micrositeConfig,
      booking: {
        ...config,
        updatedAt: new Date().toISOString(),
      },
    };

    await prisma.branch.update({
      where: { id: branch.id },
      data: { micrositeConfig: updatedConfig },
    });

    return NextResponse.json({
      success: true,
      message: 'Slot configuration saved successfully',
      config: updatedConfig.booking,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Save slots error:', error);
    return NextResponse.json({ error: 'Failed to save slot configuration' }, { status: 500 });
  }
}

function getDefaultSlotConfig() {
  return {
    slotDuration: 30,
    maxBookingsPerSlot: 1,
    breakBetweenSlots: 10,
    blockedDates: [],
    customSlots: {
      monday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
      tuesday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
      wednesday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
      thursday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
      friday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
      saturday: [{ start: '10:00', end: '14:00' }],
      sunday: [],
    },
  };
}
