'use client';

/**
 * Dark Mode Toggle Component
 * Provides a button to toggle between light and dark modes
 * Requirements: 3.4
 */

import React from 'react';
import { useDarkMode } from '@/lib/dark-mode-context';

interface DarkModeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function DarkModeToggle({ className = '', showLabel = false }: DarkModeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex items-center gap-2 p-2 rounded-lg
        transition-all duration-300
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${className}
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun Icon (Light Mode) */}
      <svg
        className={`
          w-5 h-5 transition-all duration-300
          ${isDarkMode ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}
          absolute
        `}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon Icon (Dark Mode) */}
      <svg
        className={`
          w-5 h-5 transition-all duration-300
          ${isDarkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'}
          ${!isDarkMode && 'absolute'}
        `}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>

      {showLabel && (
        <span className="text-sm font-medium">
          {isDarkMode ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
}

/**
 * Compact Dark Mode Toggle (Icon Only)
 */
export function DarkModeToggleCompact({ className = '' }: { className?: string }) {
  return <DarkModeToggle className={className} showLabel={false} />;
}

/**
 * Dark Mode Toggle with Label
 */
export function DarkModeToggleWithLabel({ className = '' }: { className?: string }) {
  return <DarkModeToggle className={className} showLabel={true} />;
}
