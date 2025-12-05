'use client';

/**
 * AriaLiveRegion Component
 *
 * A global ARIA live region for announcing dynamic content changes to screen readers.
 * This component should be included once at the root level of the application.
 *
 * Requirements: 10.2, 10.4 - ARIA labels and dynamic content announcements
 */
export default function AriaLiveRegion() {
  return (
    <>
      {/* Polite announcements - for non-critical updates */}
      <div
        id="aria-live-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Assertive announcements - for critical updates */}
      <div
        id="aria-live-region-assertive"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </>
  );
}
