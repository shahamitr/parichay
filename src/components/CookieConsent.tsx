'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shield, X } from 'lucide-react';

// =============================================================================
// Cookie consent utility — importable by other modules
// =============================================================================
const CONSENT_KEY = 'cookieConsent';
const CONSENT_TIMESTAMP_KEY = 'cookieConsentTimestamp';

export type ConsentStatus = 'accepted' | 'declined' | 'pending';

/**
 * Read the current cookie consent status.
 * Safe to call on server (returns 'pending').
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') return 'pending';
  return (localStorage.getItem(CONSENT_KEY) as ConsentStatus) || 'pending';
}

/**
 * Check if analytics/tracking is allowed.
 * Returns true only when the user has explicitly accepted.
 */
export function isTrackingAllowed(): boolean {
  return getConsentStatus() === 'accepted';
}

/**
 * Remove all non-essential cookies from the browser.
 * Keeps only cookies whose names start with known essential prefixes.
 */
function removeNonEssentialCookies() {
  const essentialPrefixes = ['accessToken', 'refreshToken', 'cookieConsent', 'NEXT'];
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const name = cookie.split('=')[0].trim();
    const isEssential = essentialPrefixes.some((prefix) => name.startsWith(prefix));
    if (!isEssential && name) {
      // Delete cookie on current path and root
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    }
  }
}

/**
 * Disable tracking scripts by removing GA / analytics script tags.
 */
function disableTrackingScripts() {
  // Remove Google Analytics / Tag Manager scripts
  const trackingSelectors = [
    'script[src*="googletagmanager"]',
    'script[src*="google-analytics"]',
    'script[src*="analytics"]',
    'script[src*="hotjar"]',
    'script[src*="mixpanel"]',
    'script[src*="segment"]',
  ];

  for (const selector of trackingSelectors) {
    document.querySelectorAll(selector).forEach((el) => el.remove());
  }

  // Disable window-level tracking objects
  if ('ga' in window) (window as any).ga = () => {};
  if ('gtag' in window) (window as any).gtag = () => {};
  if ('dataLayer' in window) (window as any).dataLayer = [];
}

// =============================================================================
// Component
// =============================================================================
export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const status = getConsentStatus();
    if (status === 'pending') {
      setShowBanner(true);
    } else if (status === 'declined') {
      // Enforce blocking on every page load
      removeNonEssentialCookies();
      disableTrackingScripts();
    }
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
    setShowBanner(false);
  }, []);

  const handleDecline = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
    removeNonEssentialCookies();
    disableTrackingScripts();
    setShowBanner(false);
  }, []);

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Shield className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                We value your privacy
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                We use essential cookies for authentication and site functionality.
                Analytics cookies help us improve your experience but are only enabled with your consent.{' '}
                <a
                  href="/privacy-policy"
                  className="underline text-primary-600 dark:text-primary-400 hover:text-primary-700"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
