/**
 * Admin System Announcements API
 * GET /api/admin/announcements — Get active announcements
 * POST /api/admin/announcements — Create a system-wide announcement
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';

// GET — Active announcements (for all users)
export async function GET(request: NextRequest) {
  try {
    // Announcements are stored as notifications with type 'ANNOUNCEMENT' for all users
    // But we need a broadcast mechanism. Use a dedicated approach:
    // Store in a lightweight table or use notification with userId = null (system-wide)

    // For now, fetch notifications of type ANNOUNCEMENT that are recent
    const announcements = await prisma.notification.findMany({
      where: {
        type: 'SYSTEM_ALERT',
        title: { startsWith: '📢' }, // Convention: announcements start with 📢
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        message: true,
        createdAt: true,
        metadata: true,
      },
    });

    return NextResponse.json({ announcements });
  } catch (error) {
    return NextResponse.json({ announcements: [] });
  }
}

// POST — Create announcement (SUPER_ADMIN only)
const announcementSchema = z.object({
  title: z.string().min(3).max(100),
  message: z.string().min(10).max(1000),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Super Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, priority } = announcementSchema.parse(body);

    // Get all active users
    const activeUsers = await prisma.user.findMany({
      where: { isActive: true, deletedAt: null },
      select: { id: true },
    });

    // Create notification for each user (batch)
    const notifications = activeUsers.map((u) => ({
      userId: u.id,
      type: 'SYSTEM_ALERT' as const,
      title: `📢 ${title}`,
      message,
      metadata: { type: 'announcement', priority, sentBy: user.id },
    }));

    // Batch create (Prisma createMany)
    await prisma.notification.createMany({
      data: notifications,
    });

    return NextResponse.json({
      success: true,
      message: `Announcement sent to ${activeUsers.length} users`,
      recipientCount: activeUsers.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid announcement data' }, { status: 400 });
    }
    console.error('Announcement error:', error);
    return NextResponse.json({ error: 'Failed to send announcement' }, { status: 500 });
  }
}
