/**
 * Design Tokens Configuration
 * Central source of truth for all design values used across the application
 */

export const designTokens = {
  colors: {
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#7b61ff',
      600: '#6d4aff',
      700: '#5b3fd9',
      800: '#4c34b3',
      900: '#4c1d95',
    },
    accent: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#ff7b00',
      600: '#ff9f45',
      700: '#ea580c',
      800: '#c2410c',
      900: '#7c2d12',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      900: '#7f1d1d',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
    },
    fontSize: {
      hero: ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],      // 48px
      h1: ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],     // 36px
      h2: ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],    // 30px
      h3: ['1.5rem', { lineHeight: '1.4' }],                                 // 24px
      h4: ['1.25rem', { lineHeight: '1.5' }],                                // 20px
      body: ['1.125rem', { lineHeight: '1.75' }],                            // 18px
      base: ['1rem', { lineHeight: '1.5' }],                                 // 16px
      small: ['0.875rem', { lineHeight: '1.5' }],                            // 14px
      xs: ['0.75rem', { lineHeight: '1.5' }],                                // 12px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2',
    },
  },
  spacing: {
    section: '4rem',      // 64px - vertical spacing between major sections
    container: '2rem',    // 32px - container padding
    element: '1.5rem',    // 24px - spacing between elements
    compact: '1rem',      // 16px - compact spacing
    tight: '0.5rem',      // 8px - tight spacing
  },
  borderRadius: {
    none: '0',
    sm: '0.375rem',       // 6px
    md: '0.5rem',         // 8px
    lg: '0.75rem',        // 12px
    xl: '1rem',           // 16px
    '2xl': '1.5rem',      // 24px
    '3xl': '2rem',        // 32px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000',
  },
  gradients: {
    // Primary gradients with full opacity
    primary: 'linear-gradient(135deg, #7b61ff 0%, #ff7b00 100%)',
    accent: 'linear-gradient(135deg, #ff7b00 0%, #ff9f45 100%)',

    // Softened gradients with transparency (0.7-0.9 range) - Requirement 3.1
    primarySoft: 'linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(255, 123, 0, 0.8) 100%)',
    accentSoft: 'linear-gradient(135deg, rgba(255, 123, 0, 0.7) 0%, rgba(255, 159, 69, 0.7) 100%)',

    // Two-tone pastel gradients - Requirement 3.2
    pastelPurpleOrange: 'linear-gradient(135deg, rgba(123, 97, 255, 0.3) 0%, rgba(255, 123, 0, 0.3) 100%)',
    pastelBlueGreen: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%)',
    pastelPinkYellow: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(251, 191, 36, 0.3) 100%)',
    pastelTealBlue: 'linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',

    // Subtle background gradients
    subtle: 'linear-gradient(180deg, rgba(123, 97, 255, 0.05) 0%, rgba(255, 123, 0, 0.05) 100%)',
    subtleVertical: 'linear-gradient(180deg, rgba(123, 97, 255, 0.08) 0%, transparent 100%)',
    subtleRadial: 'radial-gradient(circle at top right, rgba(123, 97, 255, 0.1) 0%, transparent 50%)',

    // Button-specific gradients with transparency
    buttonPrimary: 'linear-gradient(135deg, rgba(123, 97, 255, 0.9) 0%, rgba(255, 123, 0, 0.9) 100%)',
    buttonSecondary: 'linear-gradient(135deg, rgba(255, 123, 0, 0.85) 0%, rgba(255, 159, 69, 0.85) 100%)',
    buttonHover: 'linear-gradient(135deg, rgba(123, 97, 255, 1) 0%, rgba(255, 123, 0, 1) 100%)',

    // Header-specific gradients
    headerPrimary: 'linear-gradient(135deg, rgba(123, 97, 255, 0.75) 0%, rgba(255, 123, 0, 0.75) 100%)',
    headerAccent: 'linear-gradient(90deg, rgba(123, 97, 255, 0.8) 0%, rgba(255, 123, 0, 0.8) 50%, rgba(255, 159, 69, 0.8) 100%)',

    // Overlay gradients for backgrounds
    overlayDark: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%)',
    overlayLight: 'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.9) 100%)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  zIndex: {
    base: '0',
    dropdown: '1000',
    sticky: '1100',
    fixed: '1200',
    modalBackdrop: '1300',
    modal: '1400',
    popover: '1500',
    tooltip: '1600',
  },
} as const;

/**
 * Dark Mode Color Palette
 * Requirements: 3.4, 3.5
 */
export const darkModeColors = {
  primary: {
    50: '#1a1625',
    100: '#2d2440',
    200: '#3d3154',
    300: '#5a4a7f',
    400: '#7b61ff',
    500: '#9580ff',
    600: '#a995ff',
    700: '#bdaaff',
    800: '#d1c0ff',
    900: '#e5d5ff',
  },
  accent: {
    50: '#2d1a0a',
    100: '#4a2b15',
    200: '#663c20',
    300: '#995730',
    400: '#ff7b00',
    500: '#ff9f45',
    600: '#ffb366',
    700: '#ffc788',
    800: '#ffdba9',
    900: '#ffefcb',
  },
  neutral: {
    50: '#0a0a0a',
    100: '#171717',
    200: '#262626',
    300: '#404040',
    400: '#525252',
    500: '#737373',
    600: '#a3a3a3',
    700: '#d4d4d4',
    800: '#e5e5e5',
    900: '#fafafa',
  },
  background: {
    primary: '#0a0a0a',
    secondary: '#171717',
    tertiary: '#262626',
  },
  surface: {
    primary: '#171717',
    secondary: '#262626',
    tertiary: '#404040',
  },
  text: {
    primary: '#fafafa',
    secondary: '#d4d4d4',
    tertiary: '#a3a3a3',
  },
  border: {
    primary: '#262626',
    secondary: '#404040',
    tertiary: '#525252',
  },
} as const;

// Type exports for TypeScript support
export type DesignTokens = typeof designTokens;
export type ColorScale = keyof typeof designTokens.colors;
export type ColorShade = keyof typeof designTokens.colors.primary;
export type DarkModeColors = typeof darkModeColors;
