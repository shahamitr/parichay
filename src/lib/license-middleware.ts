/**
 * License validation middleware
 */

import { prisma } from './prisma';
import { shouldSuspendSubscription, isInGracePeriod } from './subscription-utils';

export interface LicenseValidationResult {
  isValid: boolean;
  subscription?: any;
  message?: string;
  inGracePeriod?: boolean;
}

/**
 * Validate license key and subscription status
 */
export async function validateLicense(licenseKey: string): Promise<LicenseValidationResult> {
  try {
    // Find subscription by license key
    const subscription = await prisma.subscription.findUnique({
      where: { licenseKey },
      include: {
        plan: true,
        brand: true,
      },
    });

    if (!subscription) {
      return {
        isValid: false,
        message: 'Invalid license key',
      };
    }

    // Check if subscription is cancelled
    if (subscription.status === 'CANCELLED') {
      return {
        isValid: false,
        subscription,
        message: 'Subscription has been cancelled',
      };
    }

    // Check if subscription is suspended
    if (subscription.status === 'SUSPENDED') {
      return {
        isValid: false,
        subscription,
        message: 'Subscription is suspended due to non-payment',
      };
    }

    // Check if subscription has expired
    const now = new Date();
    const endDate = new Date(subscription.endDate);

    if (now > endDate) {
      // Check if in grace period
      if (isInGracePeriod(endDate)) {
        return {
          isValid: true,
          subscription,
          inGracePeriod: true,
          message: 'Subscription is in grace period. Please renew soon.',
        };
      }

      // Should be suspended
      if (shouldSuspendSubscription(endDate)) {
        // Update subscription status to suspended
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'SUSPENDED' },
        });

        return {
          isValid: false,
          subscription,
          message: 'Subscription has expired and grace period has ended',
        };
      }

      // Update status to expired
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'EXPIRED' },
      });

      return {
        isValid: false,
        subscription,
        message: 'Subscription has expired',
      };
    }

    // Subscription is active and valid
    return {
      isValid: true,
      subscription,
      message: 'License is valid',
    };
  } catch (error) {
    console.error('License validation error:', error);
    return {
      isValid: false,
      message: 'Error validating license',
    };
  }
}

/**
 * Validate brand subscription
 */
export async function validateBrandSubscription(brandId: string): Promise<LicenseValidationResult> {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!brand) {
      return {
        isValid: false,
        message: 'Brand not found',
      };
    }

    if (!brand.subscription) {
      return {
        isValid: false,
        message: 'No active subscription found for this brand',
      };
    }

    return validateLicense(brand.subscription.licenseKey);
  } catch (error) {
    console.error('Brand subscription validation error:', error);
    return {
      isValid: false,
      message: 'Error validating brand subscription',
    };
  }
}

/**
 * Check if brand can create more branches based on subscription limits
 */
export async function canCreateBranch(brandId: string): Promise<{
  allowed: boolean;
  currentCount: number;
  maxAllowed: number;
  message?: string;
}> {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
        branches: true,
      },
    });

    if (!brand) {
      return {
        allowed: false,
        currentCount: 0,
        maxAllowed: 0,
        message: 'Brand not found',
      };
    }

    if (!brand.subscription) {
      return {
        allowed: false,
        currentCount: brand.branches.length,
        maxAllowed: 0,
        message: 'No active subscription',
      };
    }

    // Validate subscription is active
    const validation = await validateLicense(brand.subscription.licenseKey);
    if (!validation.isValid) {
      return {
        allowed: false,
        currentCount: brand.branches.length,
        maxAllowed: 0,
        message: validation.message,
      };
    }

    const features = brand.subscription.plan.features as any;
    const maxBranches = features.maxBranches || 0;
    const currentCount = brand.branches.length;

    return {
      allowed: currentCount < maxBranches,
      currentCount,
      maxAllowed: maxBranches,
      message: currentCount >= maxBranches
        ? 'Branch limit reached. Please upgrade your subscription.'
        : undefined,
    };
  } catch (error) {
    console.error('Branch creation check error:', error);
    return {
      allowed: false,
      currentCount: 0,
      maxAllowed: 0,
      message: 'Error checking branch creation limits',
    };
  }
}
