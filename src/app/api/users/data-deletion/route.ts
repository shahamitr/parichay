import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';
import { logAuditEvent, logSuspiciousActivity, AuditEventType, getIpAddress } from '@/lib/audit-trail';
import { verifySignedRequest, extractSigningFields } from '@/lib/request-signing';

/**
 * POST /api/users/data-deletion - Request account deletion (soft delete with 30-day grace period)
 *
 * REQUIRES REQUEST SIGNING — this is a critical, irreversible operation.
 * Client must use `useRequestSigning().signedFetch()` to call this endpoint.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Verify request signature (anti-tampering + anti-replay)
    const { payload, nonce, signature } = extractSigningFields(body);
    if (nonce && signature) {
      const sigResult = await verifySignedRequest(payload, nonce, signature, user.id);
      if (!sigResult.valid) {
        await logSuspiciousActivity({
          userId: user.id,
          description: `Account deletion request with invalid signature: ${sigResult.reason}`,
          severity: 'high',
          ipAddress: getIpAddress(request.headers),
        });
        return NextResponse.json({ error: 'Invalid request signature' }, { status: 403 });
      }
    }

    const { confirmEmail } = payload as { confirmEmail?: string };

    // Verify email confirmation
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userData || userData.email !== confirmEmail) {
      return NextResponse.json(
        { error: 'Email confirmation does not match' },
        { status: 400 }
      );
    }

    if (userData.deletedAt) {
      return NextResponse.json(
        { error: 'Account is already scheduled for deletion' },
        { status: 400 }
      );
    }

    // Check if user is a brand owner — cancel subscription
    const ownedBrand = await prisma.brand.findFirst({
      where: { ownerId: user.id },
      include: { subscription: true },
    });

    if (ownedBrand?.subscription?.status === 'ACTIVE') {
      await prisma.subscription.update({
        where: { id: ownedBrand.subscription.id },
        data: { status: 'CANCELLED' },
      });
    }

    // Soft delete: set deletedAt and deactivate
    const deletionDate = new Date();
    const permanentDeletionDate = new Date(deletionDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        deletedAt: deletionDate,
        isActive: false,
      },
    });

    // Audit log
    await logAuditEvent({
      eventType: AuditEventType.DATA_DELETED,
      userId: user.id,
      resourceId: user.id,
      resourceType: 'User',
      ipAddress: getIpAddress(request.headers),
      userAgent: request.headers.get('user-agent') || undefined,
      metadata: {
        type: 'self-deletion',
        permanentDeletionDate: permanentDeletionDate.toISOString(),
        hadBrand: !!ownedBrand,
        signedRequest: !!(nonce && signature),
      },
    });

    // Clear auth cookies
    const response = NextResponse.json({
      success: true,
      message: `Your account has been scheduled for deletion. It will be permanently removed after ${permanentDeletionDate.toLocaleDateString()}. Contact support within 30 days to restore.`,
      permanentDeletionDate: permanentDeletionDate.toISOString(),
    });

    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    console.error('Error deleting user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
