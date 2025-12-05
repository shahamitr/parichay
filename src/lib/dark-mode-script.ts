/**
 * Dark Mode Script
 * Prevents flash of unstyled content (FOUC) by applying dark mode class before page renders
 * This should be injected as an inline script in the document head
 * Requirements: 3.5
 */

export const darkModeScript = `
(function() {
  const DARK_MODE_KEY = 'onetouch-dark-mode';

  function applyDarkMode() {
    try {
      // Check localStorage first
      const stored = localStorage.getItem(DARK_MODE_KEY);
      if (stored !== null) {
        if (stored === 'true') {
          document.documentElement.classList.add('dark');
        }
        return;
      }

      // Fall back to system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // Fail silently
    }
  }

  applyDarkMode();
})();
`;

/**
 * Get the dark mode script as a string for inline injection
 */
export function getDarkModeScript(): string {
  return darkModeScript;
}
