// @ts-nocheck
import { ThemeConfig } from '@/data/themes';
import { themes } from '@/data/themes';
import { MicrositeConfig } from '@/types/microsite';

/**
 * Apply a theme to a microsite configuration
 */
export function applyTheme(
  theme: ThemeConfig,
  existingConfig: MicrositeConfig
): MicrositeConfig {
  return {
    ...existingConfig,
    theme: {
      primaryColor: theme.colors.primary,
      secondaryColor: theme.colors.secondary,
      accentColor: theme.colors.accent,
      backgroundColor: theme.colors.background,
      textColor: theme.colors.text,
      fontFamily: theme.fonts.heading,
      bodyFontFamily: theme.fonts.body,
    },
  };
}

/**
 * Get theme by ID
 */
export function getThemeById(themeId: string): ThemeConfig | undefined {
  return themes.find(theme => theme.id === themeId);
}

/**
 * Get themes for a specific category
 */
export function getThemesByCategory(categoryId: string): ThemeConfig[] {
  return themes.filter(theme => theme.categoryId === categoryId);
}

/**
 * Generate CSS variables from theme
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  return `
    :root {
      /* Colors */
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text: ${theme.colors.text};
      --color-text-secondary: ${theme.colors.textSecondary};
      --color-border: ${theme.colors.border};
      --color-success: ${theme.colors.success};
      --color-warning: ${theme.colors.warning};
      --color-error: ${theme.colors.error};

      /* Typography */
      --font-heading: ${theme.fonts.heading}, sans-serif;
      --font-body: ${theme.fonts.body}, sans-serif;
      --font-mono: ${theme.fonts.mono}, monospace;

      /* Layout */
      --border-radius: ${getBorderRadiusValue(theme.layout.borderRadius)};
      --spacing: ${getSpacingValue(theme.layout.spacing)};
    }

    /* Apply theme styles */
    body {
      font-family: var(--font-body);
      color: var(--color-text);
      background-color: var(--color-background);
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
    }

    /* Shadow styles */
    ${getShadowStyles(theme.layout.shadows)}
  `;
}

function getBorderRadiusValue(size: string): string {
  const values: Record<string, string> = {
    none: '0',
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem',
  };
  return values[size] || values.medium;
}

function getSpacingValue(size: string): string {
  const values: Record<string, string> = {
    compact: '0.75rem',
    normal: '1rem',
    spacious: '1.5rem',
  };
  return values[size] || values.normal;
}

function getShadowStyles(shadowType: string): string {
  const shadows: Record<string, string> = {
    none: `
      .shadow-sm, .shadow, .shadow-md, .shadow-lg, .shadow-xl {
        box-shadow: none !important;
      }
    `,
    subtle: `
      .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
      .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
      .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
      .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
    `,
    normal: `
      .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
      .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
      .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
    `,
    prominent: `
      .shadow-sm { box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1); }
      .shadow { box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.15); }
      .shadow-md { box-shadow: 0 8px 12px -2px rgba(0, 0, 0, 0.15); }
      .shadow-lg { box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.15); }
      .shadow-xl { box-shadow: 0 25px 35px -8px rgba(0, 0, 0, 0.15); }
    `,
  };
  return shadows[shadowType] || shadows.normal;
}

/**
 * Preview theme on a sample microsite config
 */
export function previewTheme(theme: ThemeConfig, sampleConfig: MicrositeConfig): MicrositeConfig {
  return applyTheme(theme, sampleConfig);
}

/**
 * Get recommended theme for a category
 */
export function getRecommendedTheme(categoryId: string | null): ThemeConfig | undefined {
  if (!categoryId) {
    return themes[0]; // Return first theme as default
  }

  const categoryThemes = themes.filter(theme => theme.categoryId === categoryId);
  return categoryThemes[0]; // Return first theme for the category
}

/**
 * Compare two themes and return differences
 */
export function compareThemes(theme1: ThemeConfig, theme2: ThemeConfig): {
  colors: boolean;
  fonts: boolean;
  layout: boolean;
} {
  return {
    colors: JSON.stringify(theme1.colors) !== JSON.stringify(theme2.colors),
    fonts: JSON.stringify(theme1.fonts) !== JSON.stringify(theme2.fonts),
    layout: JSON.stringify(theme1.layout) !== JSON.stringify(theme2.layout),
  };
}
