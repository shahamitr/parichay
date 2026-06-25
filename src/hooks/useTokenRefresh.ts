'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Automatically refreshes the access token before it expires.
 * Access tokens are 15 minutes; this refreshes every 12 minutes.
 * Also refreshes on 401 responses from API calls.
 */
export function useTokenRefresh() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        // Refresh failed — user needs to re-login
        // Only redirect if we get a 401 (token truly expired)
        if (response.status === 401) {
          window.location.href = '/login';
        }
      }
    } catch {
      // Network error — don't redirect, just retry next interval
    }
  }, []);

  useEffect(() => {
    // Refresh every 12 minutes (access token expires in 15)
    const REFRESH_INTERVAL_MS = 12 * 60 * 1000;

    // Do an initial refresh to ensure token is fresh
    refreshToken();

    intervalRef.current = setInterval(refreshToken, REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshToken]);

  return { refreshToken };
}
