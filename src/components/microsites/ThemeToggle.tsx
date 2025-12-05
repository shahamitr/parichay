'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ThemeSettings } from '@/types/microsite';

interface ThemeToggleProps {
  settings?: ThemeSettings;
  onThemeChange?: (mode: 'light' | 'dark') => void;
}

export default function ThemeToggle({ settings, onThemeChange }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(settings?.mode || 'light');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Determine actual theme based on setting
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setActualTheme(prefersDark ? 'dark' : 'light');

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        setActualTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setActualTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;

    if (actualTheme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', settings?.customColors?.background || '#0f172a');
      root.style.setProperty('--text-primary', settings?.customColors?.text || '#f8fafc');
      root.style.setProperty('--card-bg', settings?.customColors?.cardBackground || '#1e293b');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--bg-primary', settings?.customColors?.background || '#ffffff');
      root.style.setProperty('--text-primary', settings?.customColors?.text || '#0f172a');
      root.style.setProperty('--card-bg', settings?.customColors?.cardBackground || '#ffffff');
    }

    // Apply custom colors if provided
    if (settings?.customColors) {
      if (settings.customColors.primary) {
        root.style.setProperty('--brand-primary', settings.customColors.primary);
      }
      if (settings.customColors.secondary) {
        root.style.setProperty('--brand-secondary', settings.customColors.secondary);
      }
      if (settings.customColors.accent) {
        root.style.setProperty('--brand-accent', settings.customColors.accent);
      }
    }

    // Apply border radius
    const radiusMap = {
      none: '0',
      small: '0.25rem',
      medium: '0.5rem',
      large: '1rem',
      full: '9999px',
    };
    root.style.setProperty('--border-radius', radiusMap[settings?.borderRadius || 'medium']);

    onThemeChange?.(actualTheme);
  }, [actualTheme, settings, onThemeChange]);

  const cycleTheme = () => {
    const themes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const icons = {
    light: <Sun className="w-5 h-5" />,
    dark: <Moon className="w-5 h-5" />,
    auto: <Monitor className="w-5 h-5" />,
  };

  const labels = {
    light: 'Light Mode',
    dark: 'Dark Mode',
    auto: 'System',
  };

  return (
    <button
      onClick={cycleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
      title={labels[theme]}
      aria-label={`Current theme: ${labels[theme]}. Click to change.`}
    >
      <span className="text-gray-700 dark:text-gray-200">
        {icons[theme]}
      </span>
    </button>
  );
}
