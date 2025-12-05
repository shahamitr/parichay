/**
 * Keyboard Navigation Utilities
 *
 * Helper functions and constants for implementing keyboard navigation
 * and keyboard shortcuts throughout the application.
 *
 * Requirements: 10.4 - Keyboard navigation support
 */

/**
 * Keyboard shortcuts configuration
 */
export const KEYBOARD_SHORTCUTS = {
  // Navigation shortcuts
  HOME: { key: 'Home', description: 'Go to top of page' },
  END: { key: 'End', description: 'Go to bottom of page' },
  ESCAPE: { key: 'Escape', description: 'Close modal or menu' },

  // Section navigation (with Alt key)
  NEXT_SECTION: { key: 'ArrowDown', modifier: 'alt', description: 'Go to next section' },
  PREV_SECTION: { key: 'ArrowUp', modifier: 'alt', description: 'Go to previous section' },

  // Quick actions (with Ctrl/Cmd key)
  CONTACT: { key: 'k', modifier: 'ctrl', description: 'Jump to contact section' },
  SEARCH: { key: '/', description: 'Focus search' },
} as const;

/**
 * Section IDs in order for keyboard navigation
 */
export const SECTION_ORDER = [
  'profile',
  'hero',
  'about',
  'services',
  'impact',
  'testimonials',
  'gallery',
  'trust-indicators',
  'videos',
  'cta',
  'contact',
  'payment',
  'feedback',
] as const;

/**
 * Check if a keyboard event matches a shortcut
 */
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: { key: string; modifier?: 'ctrl' | 'alt' | 'shift' }
): boolean {
  const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();

  if (!shortcut.modifier) {
    return keyMatches && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey;
  }

  switch (shortcut.modifier) {
    case 'ctrl':
      return keyMatches && (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey;
    case 'alt':
      return keyMatches && event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
    case 'shift':
      return keyMatches && event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey;
    default:
      return false;
  }
}

/**
 * Navigate to a section by ID
 */
export function navigateToSection(sectionId: string, offset: number = 80): void {
  const element = document.getElementById(sectionId);
  if (element != null) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    });

    // Focus the section for screen readers
    element.focus({ preventScroll: true });
  }
}

/**
 * Get the current active section based on scroll position
 */
export function getCurrentSection(): string | null {
  const scrollPosition = window.scrollY + 100;

  for (const sectionId of SECTION_ORDER) {
    const element = document.getElementById(sectionId);
    if (element != null) {
      const offsetTop = element.offsetTop;
      const offsetBottom = offsetTop + element.offsetHeight;

      if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
        return sectionId;
      }
    }
  }

  return null;
}

/**
 * Navigate to the next section
 */
export function navigateToNextSection(): void {
  const currentSection = getCurrentSection();
  if (!currentSection) return;

  const currentIndex = SECTION_ORDER.indexOf(currentSection as any);
  if (currentIndex < SECTION_ORDER.length - 1) {
    const nextSection = SECTION_ORDER[currentIndex + 1];
    navigateToSection(nextSection);
  }
}

/**
 * Navigate to the previous section
 */
export function navigateToPreviousSection(): void {
  const currentSection = getCurrentSection();
  if (!currentSection) return;

  const currentIndex = SECTION_ORDER.indexOf(currentSection as any);
  if (currentIndex > 0) {
    const prevSection = SECTION_ORDER[currentIndex - 1];
    navigateToSection(prevSection);
  }
}

/**
 * Handle global keyboard shortcuts
 */
export function handleGlobalKeyboardShortcuts(event: KeyboardEvent): void {
  // Home key - scroll to top
  if (event.key === 'Home' && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // End key - scroll to bottom
  if (event.key === 'End' && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    return;
  }

  // Alt + Arrow Down - next section
  if (matchesShortcut(event, KEYBOARD_SHORTCUTS.NEXT_SECTION)) {
    event.preventDefault();
    navigateToNextSection();
    return;
  }

  // Alt + Arrow Up - previous section
  if (matchesShortcut(event, KEYBOARD_SHORTCUTS.PREV_SECTION)) {
    event.preventDefault();
    navigateToPreviousSection();
    return;
  }

  // Ctrl/Cmd + K - jump to contact
  if (matchesShortcut(event, KEYBOARD_SHORTCUTS.CONTACT)) {
    event.preventDefault();
    navigateToSection('contact');
    return;
  }
}

/**
 * Initialize keyboard navigation
 */
export function initializeKeyboardNavigation(): () => void {
  // Add keyboard event listener
  document.addEventListener('keydown', handleGlobalKeyboardShortcuts);

  // Make sections focusable for keyboard navigation
  SECTION_ORDER.forEach(sectionId => {
    const element = document.getElementById(sectionId);
    if (element && !element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '-1');
    }
  });

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleGlobalKeyboardShortcuts);
  };
}

/**
 * Get keyboard shortcuts help text
 */
export function getKeyboardShortcutsHelp(): Array<{ keys: string; description: string }> {
  return [
    { keys: 'Home', description: 'Go to top of page' },
    { keys: 'End', description: 'Go to bottom of page' },
    { keys: 'Alt + ↓', description: 'Go to next section' },
    { keys: 'Alt + ↑', description: 'Go to previous section' },
    { keys: 'Ctrl/Cmd + K', description: 'Jump to contact section' },
    { keys: 'Tab', description: 'Navigate to next interactive element' },
    { keys: 'Shift + Tab', description: 'Navigate to previous interactive element' },
    { keys: 'Enter/Space', description: 'Activate focused element' },
    { keys: 'Esc', description: 'Close modal or menu' },
  ];
}
