// @ts-nocheck
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initializeAnalytics, cleanupAnalytics } from '@/lib/analytics/enhanced-tracker';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize analytics tracking
    initializeAnalytics();

    // Cleanup on unmount
    return () => {
      cleanupAnalytics();
    };
  }, []);

  // Track page changes
  useEffect(() => {
    if (pathname) {
      // Track page view on route change
      import('@/lib/analytics/enhanced-tracker').then(({ trackPageView }) => {
        trackPageView();
      });
    }
  }, [pathname]);

  return <>{children}</>;
}
