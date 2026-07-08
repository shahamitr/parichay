'use client';

/**
 * TrackedAction — wraps any microsite action button with analytics tracking.
 *
 * Tracks: CALL, WHATSAPP, DIRECTIONS, EMAIL, SHARE, BOOKING, DOWNLOAD
 *
 * Usage:
 * <TrackedAction action="call" branchId={id} brandId={brandId} value="+91 98765 43210">
 *   <a href="tel:+919876543210">Call</a>
 * </TrackedAction>
 */

import { ReactNode, useCallback } from 'react';

type ActionType = 'CALL' | 'WHATSAPP' | 'DIRECTIONS' | 'EMAIL' | 'SHARE' | 'BOOKING' | 'DOWNLOAD' | 'WEBSITE';

interface TrackedActionProps {
  children: ReactNode;
  action: ActionType;
  branchId: string;
  brandId: string;
  value?: string; // phone number, email, URL, etc.
  className?: string;
}

export default function TrackedAction({
  children,
  action,
  branchId,
  brandId,
  value,
  className,
}: TrackedActionProps) {
  const trackClick = useCallback(() => {
    // Fire and forget — don't block the user action
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: `ACTION_${action}`,
        eventData: {
          action,
          value: value ? maskSensitive(value, action) : undefined,
        },
        pageUrl: typeof window !== 'undefined' ? window.location.pathname : '/',
        branchId,
        brandId,
      }),
    }).catch(() => {}); // Silent — never block user
  }, [action, branchId, brandId, value]);

  return (
    <div onClick={trackClick} className={className} role="presentation">
      {children}
    </div>
  );
}

/** Mask phone/email in analytics for privacy (store partial only) */
function maskSensitive(value: string, action: ActionType): string {
  if (action === 'CALL' || action === 'WHATSAPP') {
    // Store last 4 digits only: +91 98765 XXXXX → ****3210
    return '****' + value.replace(/\D/g, '').slice(-4);
  }
  if (action === 'EMAIL') {
    // Store domain only: user@gmail.com → ***@gmail.com
    const parts = value.split('@');
    return '***@' + (parts[1] || 'unknown');
  }
  return value;
}
