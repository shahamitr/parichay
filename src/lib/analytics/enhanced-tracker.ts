/**
 * Enhanced Analytics Tracker
 * Tracks detailed user interactions for advanced analytics
 */

export interface TrackingEvent {
  eventType: string;
  eventData?: Record<string, any>;
  elementId?: string;
  elementType?: string;
  elementText?: string;
  pageUrl?: string;
  referrer?: string;
  sessionId?: string;
  userId?: string;
  deviceInfo?: DeviceInfo;
  locationInfo?: LocationInfo;
  timestamp?: Date;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
Type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
}

export interface LocationInfo {
  x: number;
  y: number;
  scrollX: number;
  scrollY: number;
  scrollDepth: number;
}

export interface HeatmapData {
  x: number;
  y: number;
  value: number;
  type: 'click' | 'move' | 'scroll';
}

/**
 * Get device information
 */
export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;
  const platform = navigator.platform;

  // Detect device type
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
  const isTablet = /iPad|Android/i.test(ua) && !/Mobile/i.test(ua);
  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  // Detect browser
  let browser = 'Unknown';
  let browserVersion = '';

  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Chrome/')) {
    browser = 'Chrome';
    browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Safari/')) {
    browser = 'Safari';
    browserVersion = ua.split('Version/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Edge/')) {
    browser = 'Edge';
    browserVersion = ua.split('Edge/')[1]?.split(' ')[0] || '';
  }

  // Detect OS
  let os = 'Unknown';
  let osVersion = '';

  if (ua.includes('Windows')) {
    os = 'Windows';
    osVersion = ua.split('Windows NT ')[1]?.split(';')[0] || '';
  } else if (ua.includes('Mac OS')) {
    os = 'macOS';
    osVersion = ua.split('Mac OS X ')[1]?.split(')')[0]?.replace(/_/g, '.') || '';
  } else if (ua.includes('Android')) {
    os = 'Android';
    osVersion = ua.split('Android ')[1]?.split(';')[0] || '';
  } else if (ua.includes('iOS')) {
    os = 'iOS';
    osVersion = ua.split('OS ')[1]?.split(' ')[0]?.replace(/_/g, '.') || '';
  }

  return {
    userAgent: ua,
    platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    deviceType,
    browser,
    browserVersion,
    os,
    osVersion,
  };
}

/**
 * Get location information
 */
export function getLocationInfo(event?: MouseEvent | TouchEvent): LocationInfo {
  const scrollDepth = Math.round(
    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
  );

  let x = 0;
  let y = 0;

  if (event) {
    if ('touches' in event && event.touches.length > 0) {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    } else if ('clientX' in event) {
      x = event.clientX;
      y = event.clientY;
    }
  }

  return {
    x,
    y,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    scrollDepth: isNaN(scrollDepth) ? 0 : scrollDepth,
  };
}

/**
 * Generate or retrieve session ID
 */
export function getSessionId(): string {
  const SESSION_KEY = 'parichay_session_id';
  const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

  const stored = sessionStorage.getItem(SESSION_KEY);
  const storedTime = sessionStorage.getItem(`${SESSION_KEY}_time`);

  if (stored && storedTime) {
    const elapsed = Date.now() - parseInt(storedTime);
    if (elapsed < SESSION_DURATION) {
      // Update timestamp
      sessionStorage.setItem(`${SESSION_KEY}_time`, Date.now().toString());
      return stored;
    }
  }

  // Generate new session ID
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem(SESSION_KEY, sessionId);
  sessionStorage.setItem(`${SESSION_KEY}_time`, Date.now().toString());

  return sessionId;
}

/**
 * Track event
 */
export async function trackEvent(event: TrackingEvent): Promise<void> {
  try {
    const sessionId = getSessionId();
    const deviceInfo = getDeviceInfo();

    const payload = {
      ...event,
      sessionId,
      deviceInfo,
      pageUrl: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
    };

    // Send to analytics endpoint
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

/**
 * Track page view
 */
export function trackPageView(): void {
  trackEvent({
    eventType: 'PAGE_VIEW',
    eventData: {
      title: document.title,
      url: window.location.href,
      referrer: document.referrer,
    },
  });
}

/**
 * Track click
 */
export function trackClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  const locationInfo = getLocationInfo(event);

  trackEvent({
    eventType: 'CLICK',
    elementId: target.id,
    elementType: target.tagName.toLowerCase(),
    elementText: target.innerText?.substring(0, 100),
    locationInfo,
    eventData: {
      href: target.getAttribute('href'),
      className: target.className,
    },
  });
}

/**
 * Track scroll depth
 */
let lastScrollDepth = 0;
const scrollMilestones = [25, 50, 75, 100];

export function trackScroll(): void {
  const locationInfo = getLocationInfo();
  const currentDepth = locationInfo.scrollDepth;

  // Track milestone reached
  for (const milestone of scrollMilestones) {
    if (currentDepth >= milestone && lastScrollDepth < milestone) {
      trackEvent({
        eventType: 'SCROLL_DEPTH',
        eventData: {
          depth: milestone,
          scrollY: window.scrollY,
        },
      });
    }
  }

  lastScrollDepth = currentDepth;
}

/**
 * Track form submission
 */
export function trackFormSubmit(formId: string, formData: Record<string, any>): void {
  trackEvent({
    eventType: 'FORM_SUBMIT',
    elementId: formId,
    eventData: {
      fields: Object.keys(formData),
      fieldCount: Object.keys(formData).length,
    },
  });
}

/**
 * Track button click
 */
export function trackButtonClick(buttonId: string, buttonText: string): void {
  trackEvent({
    eventType: 'BUTTON_CLICK',
    elementId: buttonId,
    elementText: buttonText,
  });
}

/**
 * Track video play
 */
export function trackVideoPlay(videoId: string, videoTitle: string): void {
  trackEvent({
    eventType: 'VIDEO_PLAY',
    elementId: videoId,
    eventData: {
      title: videoTitle,
    },
  });
}

/**
 * Track time on page
 */
let pageStartTime = Date.now();

export function trackTimeOnPage(): void {
  const timeSpent = Math.round((Date.now() - pageStartTime) / 1000); // seconds

  trackEvent({
    eventType: 'TIME_ON_PAGE',
    eventData: {
      seconds: timeSpent,
      minutes: Math.round(timeSpent / 60),
    },
  });
}

/**
 * Initialize analytics tracking
 */
export function initializeAnalytics(): void {
  // Track page view
  trackPageView();

  // Track clicks
  document.addEventListener('click', trackClick);

  // Track scroll
  let scrollTimeout: NodeJS.Timeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScroll, 100);
  });

  // Track time on page before leaving
  window.addEventListener('beforeunload', trackTimeOnPage);

  // Track visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      trackTimeOnPage();
    } else {
      pageStartTime = Date.now();
    }
  });
}

/**
 * Cleanup analytics tracking
 */
export function cleanupAnalytics(): void {
  document.removeEventListener('click', trackClick);
  window.removeEventListener('beforeunload', trackTimeOnPage);
}
