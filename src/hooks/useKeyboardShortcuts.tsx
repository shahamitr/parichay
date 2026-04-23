'use client';

import { useEffect, useCallback, useRef } from 'react';

// =============================================================================
// TYPES
// =============================================================================
type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta';
type KeyCombo = string; // e.g., 'ctrl+k', 'alt+shift+n'

interface ShortcutConfig {
  key: KeyCombo;
  action: () => void;
  description?: string;
  scope?: string;
  preventDefault?: boolean;
  enableInInputs?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  scope?: string;
}

// =============================================================================
// PARSE KEY COMBO
// =============================================================================
function parseKeyCombo(combo: string): {
  modifiers: Set<ModifierKey>;
  key: string;
} {
  const parts = combo.toLowerCase().split('+').map((p) => p.trim());
  const modifiers = new Set<ModifierKey>();
  let key = '';

  for (const part of parts) {
    if (part === 'ctrl' || part === 'control') {
      modifiers.add('ctrl');
    } else if (part === 'alt' || part === 'option') {
      modifiers.add('alt');
    } else if (part === 'shift') {
      modifiers.add('shift');
    } else if (part === 'meta' || part === 'cmd' || part === 'command') {
      modifiers.add('meta');
    } else {
      key = part;
    }
  }

  return { modifiers, key };
}

// =============================================================================
// CHECK IF EVENT MATCHES SHORTCUT
// =============================================================================
function matchesShortcut(
  event: KeyboardEvent,
  modifiers: Set<ModifierKey>,
  key: string
): boolean {
  // Check modifiers
  const hasCtrl = event.ctrlKey === modifiers.has('ctrl');
  const hasAlt = event.altKey === modifiers.has('alt');
  const hasShift = event.shiftKey === modifiers.has('shift');
  const hasMeta = event.metaKey === modifiers.has('meta');

  // Check key (handle special keys)
  const eventKey = event.key.toLowerCase();
  const matchesKey =
    eventKey === key ||
    event.code.toLowerCase() === key ||
    event.code.toLowerCase() === `key${key}`;

  return hasCtrl && hasAlt && hasShift && hasMeta && matchesKey;
}

// =============================================================================
// CHECK IF IN INPUT ELEMENT
// =============================================================================
function isInputElement(element: Element | null): boolean {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    (element as HTMLElement).isContentEditable
  );
}

// =============================================================================
// USE KEYBOARD SHORTCUTS HOOK
// =============================================================================
export function useKeyboardShortcuts(
  shortcuts: ShortcutConfig[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, scope } = options;
  const shortcutsRef = useRef(shortcuts);

  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const activeElement = document.activeElement;
      const inInput = isInputElement(activeElement);

      for (const shortcut of shortcutsRef.current) {
        // Check scope
        if (scope && shortcut.scope && shortcut.scope !== scope) continue;

        // Check if in input and shortcut allows it
        if (inInput && !shortcut.enableInInputs) continue;

        const { modifiers, key } = parseKeyCombo(shortcut.key);

        if (matchesShortcut(event, modifiers, key)) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
            event.stopPropagation();
          }
          shortcut.action();
          return;
        }
      }
    },
    [enabled, scope]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// =============================================================================
// USE SINGLE SHORTCUT HOOK
// =============================================================================
export function useShortcut(
  keyCombo: string,
  action: () => void,
  options: {
    enabled?: boolean;
    preventDefault?: boolean;
    enableInInputs?: boolean;
  } = {}
) {
  useKeyboardShortcuts(
    [
      {
        key: keyCombo,
        action,
        preventDefault: options.preventDefault,
        enableInInputs: options.enableInInputs,
      },
    ],
    { enabled: options.enabled }
  );
}

// =============================================================================
// SHORTCUT DISPLAY HELPER
// =============================================================================
export function formatShortcut(keyCombo: string): string {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return keyCombo
    .split('+')
    .map((key) => {
      switch (key.toLowerCase()) {
        case 'ctrl':
        case 'control':
          return isMac ? '⌃' : 'Ctrl';
        case 'alt':
        case 'option':
          return isMac ? '⌥' : 'Alt';
        case 'shift':
          return isMac ? '⇧' : 'Shift';
        case 'meta':
        case 'cmd':
        case 'command':
          return isMac ? '⌘' : 'Win';
        case 'enter':
        case 'return':
          return '↵';
        case 'escape':
        case 'esc':
          return 'Esc';
        case 'backspace':
          return isMac ? '⌫' : 'Backspace';
        case 'delete':
          return isMac ? '⌦' : 'Delete';
        case 'arrowup':
          return '↑';
        case 'arrowdown':
          return '↓';
        case 'arrowleft':
          return '←';
        case 'arrowright':
          return '→';
        case 'space':
          return 'Space';
        default:
          return key.toUpperCase();
      }
    })
    .join(isMac ? '' : ' + ');
}

// =============================================================================
// SHORTCUT DISPLAY COMPONENT
// =============================================================================
interface ShortcutBadgeProps {
  shortcut: string;
  className?: string;
}

export function ShortcutBadge({ shortcut, className }: ShortcutBadgeProps) {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const keys = shortcut.split('+').map((key) => {
    switch (key.toLowerCase()) {
      case 'ctrl':
      case 'control':
        return isMac ? '⌃' : 'Ctrl';
      case 'alt':
      case 'option':
        return isMac ? '⌥' : 'Alt';
      case 'shift':
        return isMac ? '⇧' : 'Shift';
      case 'meta':
      case 'cmd':
      case 'command':
        return isMac ? '⌘' : 'Win';
      default:
        return key.toUpperCase();
    }
  });

  return (
    <span className={`inline-flex items-center gap-0.5 ${className || ''}`}>
      {keys.map((key, index) => (
        <kbd
          key={index}
          className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}

// =============================================================================
// COMMON SHORTCUTS REGISTRY
// =============================================================================
export const commonShortcuts = {
  // Navigation
  goToDashboard: { key: 'alt+d', description: 'Go to Dashboard' },
  goToBranches: { key: 'alt+b', description: 'Go to Branches' },
  goToBrands: { key: 'alt+r', description: 'Go to Brands' },
  goToLeads: { key: 'alt+l', description: 'Go to Leads' },
  goToSettings: { key: 'alt+s', description: 'Go to Settings' },

  // Actions
  search: { key: 'ctrl+k', description: 'Open Search / Command Palette' },
  save: { key: 'ctrl+s', description: 'Save' },
  create: { key: 'ctrl+n', description: 'Create New' },
  delete: { key: 'ctrl+backspace', description: 'Delete Selected' },
  refresh: { key: 'ctrl+r', description: 'Refresh Data' },

  // UI
  toggleSidebar: { key: 'ctrl+b', description: 'Toggle Sidebar' },
  toggleTheme: { key: 'ctrl+shift+t', description: 'Toggle Theme' },
  closeModal: { key: 'escape', description: 'Close Modal' },
  help: { key: 'shift+?', description: 'Show Help' },
};

// =============================================================================
// SHORTCUTS HELP MODAL DATA
// =============================================================================
export interface ShortcutCategory {
  name: string;
  shortcuts: { key: string; description: string }[];
}

export const shortcutCategories: ShortcutCategory[] = [
  {
    name: 'Navigation',
    shortcuts: [
      { key: 'Alt + D', description: 'Go to Dashboard' },
      { key: 'Alt + B', description: 'Go to Branches' },
      { key: 'Alt + R', description: 'Go to Brands' },
      { key: 'Alt + L', description: 'Go to Leads' },
      { key: 'Alt + S', description: 'Go to Settings' },
    ],
  },
  {
    name: 'Actions',
    shortcuts: [
      { key: 'Ctrl + K', description: 'Open Command Palette' },
      { key: 'Ctrl + S', description: 'Save Changes' },
      { key: 'Ctrl + N', description: 'Create New Item' },
      { key: 'Ctrl + Backspace', description: 'Delete Selected' },
      { key: 'Ctrl + R', description: 'Refresh Data' },
    ],
  },
  {
    name: 'Interface',
    shortcuts: [
      { key: 'Ctrl + B', description: 'Toggle Sidebar' },
      { key: 'Ctrl + Shift + T', description: 'Toggle Theme' },
      { key: 'Escape', description: 'Close Modal/Dropdown' },
      { key: 'Shift + ?', description: 'Show Keyboard Shortcuts' },
    ],
  },
];

export default useKeyboardShortcuts;
