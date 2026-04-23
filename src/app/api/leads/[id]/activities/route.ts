import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { LeadActivityType } from '@/generated/prisma';

/**
 * GET - Fetch all activities for a lead
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Verify lead exists
    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const [activities, total] = await Promise.all([
      prisma.leadActivity.findMany({
        where: { leadId: id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.leadActivity.count({ where: { leadId: id } }),
    ]);

    return NextResponse.json({
      success: true,
      activities,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching lead activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST - Add a new activity to a lead
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { type, description, metadata } = body;

    // Validate required fields
    if (!type || !description) {
      return NextResponse.json(
        { error: 'Activity type and description are required' },
        { status: 400 }
      );
    }

    // Validate activity type
    const validTypes: LeadActivityType[] = [
      'CREATED', 'STATUS_CHANGED', 'NOTE_ADDED', 'CALL_MADE',
      'EMAIL_SENT', 'WHATSAPP_SENT', 'MEETING_SCHEDULED',
      'FOLLOW_UP_SET', 'ASSIGNED', 'TAG_ADDED', 'TAG_REMOVED',
      'CONVERTED', 'ARCHIVED'
    ];

    if (!validTypes.includes(type as LeadActivityType)) {
      return NextResponse.json(
        { error: `Invalid activity type. Valid types: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify lead exists
    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Get user name
    const performedBy = await prisma.user.findUnique({
      where: { id: user.id },
      select: { firstName: true, lastName: true },
    });
    const performedByName = performedBy
      ? `${performedBy.firstName} ${performedBy.lastName}`
      : 'Unknown User';

    // Create the activity
    const activity = await prisma.leadActivity.create({
      data: {
        leadId: id,
        type: type as LeadActivityType,
        description,
        metadata: metadata || {},
        performedById: user.id,
        performedByName,
      },
    });

    // Update lastContactedAt for contact activities
    if (['CALL_MADE', 'EMAIL_SENT', 'WHATSAPP_SENT', 'MEETING_SCHEDULED'].includes(type)) {
      await prisma.lead.update({
        where: { id },
        data: { lastContactedAt: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error('Error creating lead activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
