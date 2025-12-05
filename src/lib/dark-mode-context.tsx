'use client';

/**
 * Dark Mode Context
 * Provides dark mode state and toggle functionality
 * Requirements: 3.4, 3.5
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

const DARK_MODE_KEY = 'onetouch-dark-mode';

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    setMounted(true);

    // Check localStorage first
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) {
      const enabled = stored === 'true';
      setIsDarkMode(enabled);
      applyDarkMode(enabled);
      return;
    }

    // Fall back to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    applyDarkMode(prefersDark);
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      const stored = localStorage.getItem(DARK_MODE_KEY);
      if (stored === null) {
        setIsDarkMode(e.matches);
        applyDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  const applyDarkMode = (enabled: boolean) => {
    if (enabled != null) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    applyDarkMode(newValue);
    localStorage.setItem(DARK_MODE_KEY, String(newValue));
  };

  const setDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled);
    applyDarkMode(enabled);
    localStorage.setItem(DARK_MODE_KEY, String(enabled));
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}
