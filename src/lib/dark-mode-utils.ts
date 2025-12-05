/**
 * Dark Mode Utilities
 * Helper functions for working with dark mode
 * Requirements: 3.4, 3.5
 */

import { darkModeColors } from '@/config/design-tokens';

/**
 * Get color value based on current theme
 */
export function getThemeColor(
  lightColor: string,
  darkColor: string,
  isDarkMode: boolean
): string {
  return isDarkMode ? darkColor : lightColor;
}

/**
 * Get dark mode color by scale and shade
 */
export function getDarkModeColor(
  scale: keyof typeof darkModeColors,
  shade: keyof typeof darkModeColors.primary
): string {
  if (scale === 'background' || scale === 'surface' || scale === 'text' || scale === 'border') {
    return (darkModeColors[scale] as any)[shade];
  }
  return darkModeColors[scale][shade];
}

/**
 * Check if dark mode is enabled
 */
export function isDarkModeEnabled(): boolean {
  if (typeof window === 'undefined') return false;

  const stored = localStorage.getItem('onetouch-dark-mode');
  if (stored !== null) {
    return stored === 'true';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Get CSS class for dark mode variant
 */
export function getDarkModeClass(baseClass: string, darkClass: string): string {
  return `${baseClass} dark:${darkClass}`;
}

/**
 * Generate dark mode gradient
 */
export function getDarkModeGradient(
  color1: string,
  color2: string,
  opacity: number = 0.8
): string {
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}

/**
 * Validate WCAG AA contrast ratio for dark mode
 * Requirements: 3.5 (maintain WCAG AA contrast ratios)
 */
export function validateDarkModeContrast(
  foreground: string,
  background: string
): { isValid: boolean; ratio: number } {
  const fgLuminance = getRelativeLuminance(foreground);
  const bgLuminance = getRelativeLuminance(background);

  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) /
                (Math.min(fgLuminance, bgLuminance) + 0.05);

  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  const isValid = ratio >= 4.5;

  return { isValid, ratio };
}

/**
 * Calculate relative luminance for contrast checking
 */
function getRelativeLuminance(color: string): number {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Get appropriate text color for background
 */
export function getTextColorForBackground(backgroundColor: string): 'light' | 'dark' {
  const luminance = getRelativeLuminance(backgroundColor);
  return luminance > 0.5 ? 'dark' : 'light';
}

/**
 * Apply dark mode to inline styles
 */
export function applyDarkModeStyles(
  lightStyles: React.CSSProperties,
  darkStyles: React.CSSProperties,
  isDarkMode: boolean
): React.CSSProperties {
  return isDarkMode ? { ...lightStyles, ...darkStyles } : lightStyles;
}
