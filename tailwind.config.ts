/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
    './src/config/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Dynamic gradient classes
    {
      pattern: /^(from|via|to)-(primary|accent)-(500|600)$/,
    },
    // Dynamic animation classes
    {
      pattern: /^animate-(fade|slide|zoom)-(in|up|down|left|right)$/,
    },
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Design system colors
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
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        // Typography scale as per requirements (2.1)
        hero: ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],      // 48px
        h1: ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],     // 36px
        h2: ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],    // 30px
        h3: ['1.5rem', { lineHeight: '1.4', fontWeight: '700' }],                                // 24px
        h4: ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],                               // 20px
        body: ['1.125rem', { lineHeight: '1.75', fontWeight: '400' }],                           // 18px
        small: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],                           // 14px
      },
      fontWeight: {
        // Font weights as per requirements (2.2)
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        // Line heights as per requirements (2.3, 2.4)
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
        loose: '2',
      },
      spacing: {
        section: '4rem',
        container: '2rem',
        element: '1.5rem',
        compact: '1rem',
        tight: '0.5rem',
      },
      borderRadius: {
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'soft-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'soft-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'soft-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '300ms',
        slow: '500ms',
      },
      zIndex: {
        dropdown: '1000',
        sticky: '1100',
        fixed: '1200',
        'modal-backdrop': '1300',
        modal: '1400',
        popover: '1500',
        tooltip: '1600',
      },
      keyframes: {
        ripple: {
          '0%': { width: '0', height: '0', opacity: '0.5' },
          '100%': { width: '500px', height: '500px', opacity: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-left': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-from-right': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        ripple: 'ripple 600ms ease-out',
        shimmer: 'shimmer 2s infinite',
        'fade-in': 'fade-in 200ms ease-out',
        'slide-in-from-top': 'slide-in-from-top 200ms ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 200ms ease-out',
        'slide-in-from-left': 'slide-in-from-left 200ms ease-out',
        'slide-in-from-right': 'slide-in-from-right 200ms ease-out',
        'scale-in': 'scale-in 200ms ease-out',
      },
    },
  },
  plugins: [],
}
