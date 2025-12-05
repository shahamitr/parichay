/**
 * Theme Configuration Types
 * Defines interfaces for brand customization and theme management
 */

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    headingFont?: string;
  };
  darkMode: boolean;
  customCSS?: string;
}

export interface HeroCustomization {
  backgroundType: 'image' | 'video' | 'gradient';
  backgroundUrl?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export interface BrandAssets {
  favicon?: string;
  logo?: string;
}

export interface BrandCustomization {
  theme: ThemeConfig;
  hero: HeroCustomization;
  assets: BrandAssets;
}

/**
 * Extended theme configuration with validation
 */
export interface ValidatedThemeConfig extends ThemeConfig {
  isValid: boolean;
  errors?: string[];
}

/**
 * Theme preset for quick selection
 */
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  config: ThemeConfig;
  previewImage?: string;
}

/**
 * Font option for font selector
 */
export interface FontOption {
  name: string;
  family: string;
  category: 'serif' | 'sans-serif' | 'display' | 'monospace';
  weights: number[];
  googleFont: boolean;
}
