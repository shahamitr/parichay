/**
 * Design System Utilities
 * Helper functions for working with design tokens in components
 */

import { designTokens } from '@/config/design-tokens';

/**
 * Get a color value from the design tokens
 * @example getColor('primary', 500) // returns '#7b61ff'
 */
export function getColor(scale: keyof typeof designTokens.colors, shade: number): string {
  const colorScale = designTokens.colors[scale];
  if (!colorScale) return '';
  return colorScale[shade as keyof typeof colorScale] || '';
}

/**
 * Get a spacing value from the design tokens
 * @example getSpacing('section') // returns '4rem'
 */
export function getSpacing(key: keyof typeof designTokens.spacing): string {
  return designTokens.spacing[key];
}

/**
 * Get a border radius value from the design tokens
 * @example getBorderRadius('xl') // returns '1rem'
 */
export function getBorderRadius(key: keyof typeof designTokens.borderRadius): string {
  return designTokens.borderRadius[key];
}

/**
 * Get a shadow value from the design tokens
 * @example getShadow('lg') // returns the shadow string
 */
export function getShadow(key: keyof typeof designTokens.shadows): string {
  return designTokens.shadows[key];
}

/**
 * Get a gradient value from the design tokens
 * @example getGradient('primary') // returns the gradient string
 */
export function getGradient(key: keyof typeof designTokens.gradients): string {
  return designTokens.gradients[key];
}

/**
 * Generate CSS custom properties from design tokens
 * Useful for dynamic theming
 */
export function generateCSSVariables(theme?: {
  primary?: string;
  accent?: string;
  neutral?: string;
}): Record<string, string> {
  return {
    '--color-primary': theme?.primary || designTokens.colors.primary[500],
    '--color-accent': theme?.accent || designTokens.colors.accent[500],
    '--color-neutral': theme?.neutral || designTokens.colors.neutral[500],
    '--spacing-section': designTokens.spacing.section,
    '--spacing-container': designTokens.spacing.container,
    '--spacing-element': designTokens.spacing.element,
    '--radius-base': designTokens.borderRadius.lg,
    '--radius-lg': designTokens.borderRadius.xl,
    '--radius-xl': designTokens.borderRadius['2xl'],
    '--transition-fast': designTokens.transitions.fast,
    '--transition-base': designTokens.transitions.base,
    '--transition-slow': designTokens.transitions.slow,
  };
}

/**
 * Class name builder utility for consistent styling
 * @example cn('base-class', condition && 'conditional-class', 'another-class')
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get responsive breakpoint value
 */
export function getBreakpoint(key: keyof typeof designTokens.breakpoints): string {
  return designTokens.breakpoints[key];
}

/**
 * Get z-index value
 */
export function getZIndex(key: keyof typeof designTokens.zIndex): string {
  return designTokens.zIndex[key];
}

// Export design tokens for direct access
export { designTokens };
