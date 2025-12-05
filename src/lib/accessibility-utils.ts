/**
 * Accessibility Utilities
 *
 * Helper functions for managing accessibility features including
 * ARIA live regions for dynamic content announcements.
 */

/**
 * Announce a message to screen readers using an ARIA live region
 * @param message - The message to announce
 * @param priority - The priority level ('polite' or 'assertive')
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;

  // Find or create the live region
  let liveRegion = document.getElementById('aria-live-region');

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only'; // Screen reader only
    document.body.appendChild(liveRegion);
  } else {
    // Update the priority if needed
    liveRegion.setAttribute('aria-live', priority);
  }

  // Clear previous message
  liveRegion.textContent = '';

  // Set new message after a brief delay to ensure screen readers pick it up
  setTimeout(() => {
    if (liveRegion != null) {
      liveRegion.textContent = message;
    }
  }, 100);

  // Clear the message after it's been announced
  setTimeout(() => {
    if (liveRegion != null) {
      liveRegion.textContent = '';
    }
  }, 3000);
}

/**
 * Create a visually hidden but screen-reader accessible element
 * @param text - The text content
 * @returns HTMLElement
 */
export function createScreenReaderOnlyElement(text: string): HTMLElement {
  const element = document.createElement('span');
  element.className = 'sr-only';
  element.textContent = text;
  return element;
}

/**
 * Check if an element is focusable
 * @param element - The element to check
 * @returns boolean
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.tabIndex < 0) return false;
  if (element.hasAttribute('disabled')) return false;

  const tagName = element.tagName.toLowerCase();
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];

  if (focusableTags.includes(tagName)) {
    return true;
  }

  return element.tabIndex >= 0;
}

/**
 * Get all focusable elements within a container
 * @param container - The container element
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
}

/**
 * Trap focus within a container (useful for modals)
 * @param container - The container element
 * @param event - The keyboard event
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return;

  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }
}

/**
 * Generate a unique ID for accessibility attributes
 * @param prefix - Optional prefix for the ID
 * @returns string
 */
export function generateA11yId(prefix: string = 'a11y'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if reduced motion is preferred
 * @returns boolean
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if high contrast mode is enabled
 * @returns boolean
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Calculate color contrast ratio between two colors
 * @param color1 - First color in hex format
 * @param color2 - Second color in hex format
 * @returns number - Contrast ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    // Remove # if present
    hex = hex.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const [rs, gs, bs] = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color combination meets WCAG AA standards
 * @param foreground - Foreground color in hex
 * @param background - Background color in hex
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns boolean
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 3 : 4.5;
  return ratio >= requiredRatio;
}

/**
 * Check if a color combination meets WCAG AAA standards
 * @param foreground - Foreground color in hex
 * @param background - Background color in hex
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns boolean
 */
export function meetsWCAGAAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 4.5 : 7;
  return ratio >= requiredRatio;
}
