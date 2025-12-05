/**
 * Theme Storage Utilities
 * Handles saving, loading, and managing theme customizations
 */

import { BrandCustomization, ThemeConfig, ValidatedThemeConfig } from '@/types/theme';

const THEME_STORAGE_KEY = 'brand_customization';
const THEME_VERSION = '1.0';

/**
 * Save brand customization to localStorage
 */
export function saveBrandCustomization(
  brandId: string,
  customization: BrandCustomization
): void {
  try {
    const storageData = {
      version: THEME_VERSION,
      brandId,
      customization,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(
      `${THEME_STORAGE_KEY}_${brandId}`,
      JSON.stringify(storageData)
    );
  } catch (error) {
    console.error('Failed to save brand customization:', error);
    throw new Error('Failed to save customization settings');
  }
}

/**
 * Load brand customization from localStorage
 */
export function loadBrandCustomization(
  brandId: string
): BrandCustomization | null {
  try {
    const stored = localStorage.getItem(`${THEME_STORAGE_KEY}_${brandId}`);

    if (!stored) {
      return null;
    }

    const data = JSON.parse(stored);

    // Version check
    if (data.version !== THEME_VERSION) {
      console.warn('Theme version mismatch, clearing stored data');
      clearBrandCustomization(brandId);
      return null;
    }

    return data.customization;
  } catch (error) {
    console.error('Failed to load brand customization:', error);
    return null;
  }
}

/**
 * Clear brand customization from localStorage
 */
export function clearBrandCustomization(brandId: string): void {
  try {
    localStorage.removeItem(`${THEME_STORAGE_KEY}_${brandId}`);
  } catch (error) {
    console.error('Failed to clear brand customization:', error);
  }
}

/**
 * Validate theme configuration
 */
export function validateThemeConfig(theme: ThemeConfig): ValidatedThemeConfig {
  const errors: string[] = [];

  // Validate colors (hex format)
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (!hexColorRegex.test(theme.colors.primary)) {
    errors.push('Primary color must be a valid hex color');
  }

  if (!hexColorRegex.test(theme.colors.secondary)) {
    errors.push('Secondary color must be a valid hex color');
  }

  if (!hexColorRegex.test(theme.colors.accent)) {
    errors.push('Accent color must be a valid hex color');
  }

  // Validate font family
  if (!theme.typography.fontFamily || theme.typography.fontFamily.trim() === '') {
    errors.push('Font family is required');
  }

  return {
    ...theme,
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Generate CSS variables from theme config
 */
export function generateThemeVariables(theme: ThemeConfig): string {
  return `
    --theme-primary: ${theme.colors.primary};
    --theme-secondary: ${theme.colors.secondary};
    --theme-accent: ${theme.colors.accent};
    --theme-font-family: ${theme.typography.fontFamily};
    --theme-heading-font: ${theme.typography.headingFont || theme.typography.fontFamily};
  `.trim();
}

/**
 * Apply theme to document
 */
export function applyThemeToDocument(theme: ThemeConfig): void {
  const root = document.documentElement;

  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-secondary', theme.colors.secondary);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  root.style.setProperty('--theme-font-family', theme.typography.fontFamily);
  root.style.setProperty(
    '--theme-heading-font',
    theme.typography.headingFont || theme.typography.fontFamily
  );

  // Apply dark mode class
  if (theme.darkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Apply custom CSS if provided
  if (theme.customCSS) {
    applyCustomCSS(theme.customCSS);
  }
}

/**
 * Apply custom CSS safely
 */
function applyCustomCSS(css: string): void {
  const styleId = 'custom-theme-styles';
  let styleElement = document.getElementById(styleId) as HTMLStyleElement;

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  // Sanitize CSS (basic sanitization)
  const sanitizedCSS = sanitizeCSS(css);
  styleElement.textContent = sanitizedCSS;
}

/**
 * Basic CSS sanitization
 */
function sanitizeCSS(css: string): string {
  // Remove potentially dangerous patterns
  let sanitized = css
    .replace(/@import/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/expression\(/gi, '')
    .replace(/<script/gi, '');

  return sanitized;
}

/**
 * Get default theme configuration
 */
export function getDefaultThemeConfig(): ThemeConfig {
  return {
    colors: {
      primary: '#7b61ff',
      secondary: '#6d4aff',
      accent: '#ff7b00',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFont: 'Inter, system-ui, sans-serif',
    },
    darkMode: false,
  };
}

/**
 * Merge theme configs (for partial updates)
 */
export function mergeThemeConfig(
  base: ThemeConfig,
  updates: Partial<ThemeConfig>
): ThemeConfig {
  return {
    colors: {
      ...base.colors,
      ...updates.colors,
    },
    typography: {
      ...base.typography,
      ...updates.typography,
    },
    darkMode: updates.darkMode ?? base.darkMode,
    customCSS: updates.customCSS ?? base.customCSS,
  };
}

/**
 * Export theme configuration as JSON
 */
export function exportThemeConfig(theme: ThemeConfig): string {
  return JSON.stringify(theme, null, 2);
}

/**
 * Import theme configuration from JSON
 */
export function importThemeConfig(json: string): ThemeConfig | null {
  try {
    const parsed = JSON.parse(json);
    const validated = validateThemeConfig(parsed);

    if (!validated.isValid) {
      console.error('Invalid theme configuration:', validated.errors);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to parse theme configuration:', error);
    return null;
  }
}
