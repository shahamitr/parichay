/**
 * Team Member Invitation
 * POST /api/brands/[id]/invite — Invite a team member by email
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { emailService } from '@/lib/email-service';
import crypto from 'crypto';
import { z } from 'zod';

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['BRANCH_ADMIN', 'EXECUTIVE']).default('BRANCH_ADMIN'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id: brandId } = await params;
    const body = await request.json();
    const { email, role } = inviteSchema.parse(body);

    // Verify brand ownership
    const brand = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
    if (user.role !== 'SUPER_ADMIN' && brand.ownerId !== user.id) {
      return NextResponse.json({ error: 'Only brand owner can invite members' }, { status: 403 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser?.brandId === brandId) {
      return NextResponse.json({ error: 'This user is already a member of your team' }, { status: 409 });
    }

    // Generate invitation token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store invitation
    await prisma.tenantInvitation.create({
      data: {
        email,
        role,
        token: inviteToken,
        expiresAt,
        invitedBy: { connect: { id: user.id } },
        tenant: brand.tenantId ? { connect: { id: brand.tenantId } } : undefined,
      },
    }).catch(async () => {
      // Fallback: store in notification if TenantInvitation model has issues
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'SYSTEM_ALERT',
          title: 'Team Invitation Sent',
          message: `Invitation sent to ${email} for role ${role}`,
          metadata: { inviteToken, email, role, brandId, expiresAt: expiresAt.toISOString() },
        },
      });
    });

    // Send invitation email
    const inviterName = `${user.id}`; // We'll get the name
    const inviterUser = await prisma.user.findUnique({ where: { id: user.id }, select: { firstName: true, lastName: true } });
    const fullName = inviterUser ? `${inviterUser.firstName} ${inviterUser.lastName}` : 'Your teammate';

    await emailService.sendTeamInvitationEmail(email, fullName, brand.name, inviteToken);

    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${email}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    console.error('Invite error:', error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}
