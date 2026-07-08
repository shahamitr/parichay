/**
 * Referral Program API
 * GET /api/referrals — Get user's referral stats and code
 * POST /api/referrals/claim — Claim referral reward when referee subscribes
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import crypto from 'crypto';

/**
 * GET — Get user's referral code and stats
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get or generate referral code for this user
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, firstName: true, lastName: true, brandId: true },
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate deterministic referral code from user ID
    const referralCode = generateReferralCode(user.id);
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${referralCode}`;

    // Count successful referrals (users who registered with this referral code)
    // We track this via the Voucher system — each referral creates a voucher usage
    const referralVoucher = await prisma.voucher.findFirst({
      where: { code: `REF-${referralCode}` },
      select: { usedCount: true },
    });

    // Count referred users (those who have this user's ID in their metadata)
    const referredUsers = await prisma.user.count({
      where: {
        industryCategory: `ref:${user.id}`, // We store referrer in this field temporarily
      },
    });

    return NextResponse.json({
      referralCode,
      referralLink,
      stats: {
        totalReferred: referredUsers,
        successfulConversions: referralVoucher?.usedCount || 0,
        rewardEarned: (referralVoucher?.usedCount || 0) * 30, // 30 days per referral
      },
      reward: {
        referrer: '30 days free added to your subscription',
        referee: '7 extra days on trial (21 days instead of 14)',
      },
    });
  } catch (error) {
    console.error('Referral fetch error:', error);
    return NextResponse.json({ error: 'Failed to load referral data' }, { status: 500 });
  }
}

/**
 * POST — Track a referral sign-up (called during registration if ?ref= param exists)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, newUserId } = body;

    if (!referralCode || !newUserId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Find the referrer
    const allUsers = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    let referrerId: string | null = null;
    for (const u of allUsers) {
      if (generateReferralCode(u.id) === referralCode) {
        referrerId = u.id;
        break;
      }
    }

    if (!referrerId) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 });
    }

    // Prevent self-referral
    if (referrerId === newUserId) {
      return NextResponse.json({ error: 'Cannot refer yourself' }, { status: 400 });
    }

    // Mark the new user as referred
    await prisma.user.update({
      where: { id: newUserId },
      data: { industryCategory: `ref:${referrerId}` },
    });

    // Give referee extra trial days (extend trial by 7 days)
    const newUserBrand = await prisma.brand.findFirst({
      where: { ownerId: newUserId },
      include: { subscription: true },
    });

    if (newUserBrand?.subscription?.isTrial) {
      const currentEnd = new Date(newUserBrand.subscription.endDate);
      const newEnd = new Date(currentEnd.getTime() + 7 * 24 * 60 * 60 * 1000);
      await prisma.subscription.update({
        where: { id: newUserBrand.subscription.id },
        data: { endDate: newEnd, trialEndsAt: newEnd },
      });
    }

    // Give referrer 30 days extension on their subscription
    const referrerBrand = await prisma.brand.findFirst({
      where: { ownerId: referrerId },
      include: { subscription: true },
    });

    if (referrerBrand?.subscription) {
      const currentEnd = new Date(referrerBrand.subscription.endDate);
      const newEnd = new Date(currentEnd.getTime() + 30 * 24 * 60 * 60 * 1000);
      await prisma.subscription.update({
        where: { id: referrerBrand.subscription.id },
        data: { endDate: newEnd },
      });

      // Notify referrer
      await prisma.notification.create({
        data: {
          userId: referrerId,
          type: 'SYSTEM_ALERT',
          title: '🎉 Referral Reward!',
          message: 'Someone signed up using your referral link! 30 free days have been added to your subscription.',
          metadata: { reward: '30_days', referredUserId: newUserId },
        },
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: 'Referral tracked successfully',
    });
  } catch (error) {
    console.error('Referral tracking error:', error);
    return NextResponse.json({ error: 'Failed to process referral' }, { status: 500 });
  }
}

/**
 * Generate a short, deterministic referral code from user ID.
 */
function generateReferralCode(userId: string): string {
  const hash = crypto.createHash('sha256').update(userId + 'parichay-ref').digest('hex');
  return hash.slice(0, 8).toUpperCase();
}
