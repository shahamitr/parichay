// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { getKeyboardShortcutsHelp } from '@/lib/keyboard-navigation';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

/**
 * KeyboardShortcutsHelp Component
 *
 * Displays a modal with keyboard shortcuts information.
 * Can be triggered by pressing '?' key.
 *
 * Requirements: 10.4 - Keyboard navigation support
 */
export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const shortcuts = getKeyboardShortcutsHelp();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Open help with '?' key
      if (event.key === '?' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        // Don't trigger if user is typing in an input
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }

        event.preventDefault();
        setIsOpen(true);
      }

      // Close help with Escape key
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[1100] p-2 bg-neutral-800 text-white rounded-full shadow-lg hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1300]"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[1400] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-shortcuts-title"
      >
        <Card
          className="w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          elevation="xl"
          padding="lg"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle id="keyboard-shortcuts-title">
                Keyboard Shortcuts
              </CardTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Close keyboard shortcuts"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Use these keyboard shortcuts to navigate the page more efficiently.
            </p>

            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-0"
                >
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {shortcut.description}
                  </span>
                  <kbd className="px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <p className="text-sm text-primary-900 dark:text-primary-100">
                <strong>Tip:</strong> Press <kbd className="px-2 py-1 text-xs font-semibold bg-white dark:bg-neutral-800 border border-primary-300 dark:border-primary-700 rounded">?</kbd> anytime to view this help.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
