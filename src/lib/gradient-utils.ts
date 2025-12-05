/**
 * Gradient Utilities
 * Helper functions for working with gradients programmatically
 * Requirements: 3.1, 3.2, 3.3
 */

import { designTokens } from '@/config/design-tokens';

export type GradientType = keyof typeof designTokens.gradients;

/**
 * Get gradient CSS string by type
 */
export function getGradient(type: GradientType): string {
  return designTokens.gradients[type];
}

/**
 * Get gradient class name by type
 */
export function getGradientClass(type: GradientType): string {
  // Convert camelCase to kebab-case
  const kebabCase = type.replace(/([A-Z])/g, '-$1').toLowerCase();
  return `gradient-${kebabCase}`;
}

/**
 * Create custom gradient with transparency
 * @param color1 - First color (hex)
 * @param color2 - Second color (hex)
 * @param opacity - Opacity value (0-1)
 * @param angle - Gradient angle in degrees (default: 135)
 */
export function createCustomGradient(
  color1: string,
  color2: string,
  opacity: number = 0.8,
  angle: number = 135
): string {
  // Convert hex to rgba
  const rgba1 = hexToRgba(color1, opacity);
  const rgba2 = hexToRgba(color2, opacity);

  return `linear-gradient(${angle}deg, ${rgba1} 0%, ${rgba2} 100%)`;
}

/**
 * Create two-tone pastel gradient
 * @param color1 - First color (hex)
 * @param color2 - Second color (hex)
 */
export function createPastelGradient(color1: string, color2: string): string {
  return createCustomGradient(color1, color2, 0.3, 135);
}

/**
 * Convert hex color to rgba
 */
function hexToRgba(hex: string, alpha: number): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Get gradient for button based on variant
 */
export function getButtonGradient(variant: 'primary' | 'secondary' | 'hover'): string {
  switch (variant) {
    case 'primary':
      return designTokens.gradients.buttonPrimary;
    case 'secondary':
      return designTokens.gradients.buttonSecondary;
    case 'hover':
      return designTokens.gradients.buttonHover;
    default:
      return designTokens.gradients.buttonPrimary;
  }
}

/**
 * Get gradient for header based on variant
 */
export function getHeaderGradient(variant: 'primary' | 'accent'): string {
  switch (variant) {
    case 'primary':
      return designTokens.gradients.headerPrimary;
    case 'accent':
      return designTokens.gradients.headerAccent;
    default:
      return designTokens.gradients.headerPrimary;
  }
}

/**
 * Get pastel gradient by color scheme
 */
export function getPastelGradient(
  scheme: 'purple-orange' | 'blue-green' | 'pink-yellow' | 'teal-blue'
): string {
  switch (scheme) {
    case 'purple-orange':
      return designTokens.gradients.pastelPurpleOrange;
    case 'blue-green':
      return designTokens.gradients.pastelBlueGreen;
    case 'pink-yellow':
      return designTokens.gradients.pastelPinkYellow;
    case 'teal-blue':
      return designTokens.gradients.pastelTealBlue;
    default:
      return designTokens.gradients.pastelPurpleOrange;
  }
}

/**
 * Apply gradient as inline style
 */
export function gradientStyle(type: GradientType): React.CSSProperties {
  return {
    background: getGradient(type),
  };
}

/**
 * Check if gradient should be limited to specific elements (Requirement 3.3)
 * Returns true if gradient is appropriate for the given element type
 */
export function isGradientAppropriate(
  gradientType: GradientType,
  elementType: 'button' | 'header' | 'background' | 'text' | 'accent'
): boolean {
  const buttonGradients = ['buttonPrimary', 'buttonSecondary', 'buttonHover'];
  const headerGradients = ['headerPrimary', 'headerAccent', 'primary', 'accent'];
  const backgroundGradients = ['subtle', 'subtleVertical', 'subtleRadial'];
  const accentGradients = ['pastelPurpleOrange', 'pastelBlueGreen', 'pastelPinkYellow', 'pastelTealBlue'];

  switch (elementType) {
    case 'button':
      return buttonGradients.includes(gradientType) || gradientType.includes('button');
    case 'header':
      return headerGradients.includes(gradientType) || gradientType.includes('header');
    case 'background':
      return backgroundGradients.includes(gradientType) || gradientType.includes('subtle');
    case 'accent':
      return accentGradients.includes(gradientType) || gradientType.includes('pastel');
    case 'text':
      return true; // Text can use any gradient
    default:
      return false;
  }
}
