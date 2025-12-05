/**
 * Responsive Utilities
 *
 * Utilities for implementing mobile-first responsive design patterns
 * Requirements: 10.1, 10.5
 */

/**
 * Touch target size constants (WCAG 2.1 Level AAA)
 */
export const TOUCH_TARGET = {
  MIN: 44, // Minimum touch target size in pixels
  RECOMMENDED: 48, // Recommended touch target size
} as const;

/**
 * Responsive breakpoints matching Tailwind config
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Mobile-first spacing classes for stacked sections
 */
export const SECTION_SPACING = {
  mobile: 'gap-y-8',
  tablet: 'md:gap-y-12',
  desktop: 'lg:gap-y-16',
  combined: 'gap-y-8 md:gap-y-12 lg:gap-y-16',
} as const;

/**
 * Touch-optimized button classes
 */
export const TOUCH_BUTTON_CLASSES = 'min-h-[44px] touch-manipulation active:scale-95';

/**
 * Responsive container classes
 */
export const CONTAINER_CLASSES = 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8';

/**
 * Responsive grid classes for cards/items
 */
export const RESPONSIVE_GRID = {
  '1-2-3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  '1-2-4': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  '1-2': 'grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-12',
} as const;

/**
 * Responsive typography classes
 */
export const RESPONSIVE_TEXT = {
  hero: 'text-3xl sm:text-4xl md:text-5xl lg:text-hero',
  h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-h1',
  h2: 'text-xl sm:text-2xl md:text-3xl lg:text-h2',
  h3: 'text-lg sm:text-xl md:text-2xl lg:text-h3',
  body: 'text-base sm:text-lg',
} as const;

/**
 * Check if current viewport is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
}

/**
 * Check if current viewport is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg;
}

/**
 * Check if current viewport is desktop
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.lg;
}

/**
 * Get current breakpoint
 */
export function getCurrentBreakpoint(): keyof typeof BREAKPOINTS | 'xs' {
  if (typeof window === 'undefined') return 'xs';

  const width = window.innerWidth;

  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

/**
 * Hook for responsive breakpoint detection
 */
export function useResponsive() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'lg' as const,
    };
  }

  return {
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    breakpoint: getCurrentBreakpoint(),
  };
}

/**
 * Clamp a value for responsive sizing
 */
export function clampResponsive(
  min: number,
  preferred: number,
  max: number
): string {
  return `clamp(${min}px, ${preferred}vw, ${max}px)`;
}

/**
 * Generate responsive padding classes
 */
export function getResponsivePadding(
  size: 'sm' | 'md' | 'lg' = 'md'
): string {
  const sizes = {
    sm: 'px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12',
    md: 'px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20',
    lg: 'px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24',
  };
  return sizes[size];
}

/**
 * Test if screen size is within range (for testing purposes)
 */
export function testScreenSize(width: number, height: number = 800): boolean {
  // Test range: 320px to 2560px as per requirements
  return width >= 320 && width <= 2560 && height >= 568;
}
