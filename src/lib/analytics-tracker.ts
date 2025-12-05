/**
 * Client-side Analytics Tracking Utility
 * Provides functions to track user interactions
 */

export interface TrackEventOptions {
  eventType: 'PAGE_VIEW' | 'CLICK' | 'QR_SCAN' | 'LEAD_SUBMIT';
  branchId?: string;
  brandId?: string;
  metadata?: Record<string, any>;
}

/**
 * Track an analytics event
 */
export async function trackEvent(options: TrackEventOptions): Promise<void> {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Fail silently to not disrupt user experience
  }
}

/**
 * Track page view
 */
export function trackPageView(branchId?: string, brandId?: string): void {
  trackEvent({
    eventType: 'PAGE_VIEW',
    branchId,
    brandId,
    metadata: {
      path: window.location.pathname,
      referrer: document.referrer,
    },
  });
}

/**
 * Track contact action click
 */
export function trackContactClick(
  action: 'call' | 'whatsapp' | 'email' | 'directions',
  branchId?: string,
  brandId?: string
): void {
  trackEvent({
    eventType: 'CLICK',
    branchId,
    brandId,
    metadata: {
      action,
      path: window.location.pathname,
    },
  });
}

/**
 * Track lead form submission
 */
export function trackLeadSubmit(branchId?: string, brandId?: string): void {
  trackEvent({
    eventType: 'LEAD_SUBMIT',
    branchId,
    brandId,
    metadata: {
      path: window.location.pathname,
    },
  });
}

/**
 * Initialize analytics tracking for a page
 */
export function initializeAnalytics(branchId?: string, brandId?: string): void {
  // Track initial page view
  trackPageView(branchId, brandId);

  // Track clicks on contact buttons
  const contactButtons = document.querySelectorAll('[data-analytics-action]');
  contactButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-analytics-action');
      if (action != null) {
        trackContactClick(
          action as 'call' | 'whatsapp' | 'email' | 'directions',
          branchId,
          brandId
        );
      }
    });
  });
}
