'use client';

import { useState, useEffect } from 'react';
import { Palette, Download, Upload, RotateCcw, Save, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  border: string;
}

interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

const defaultThemes: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    colors: {
      primary: '#7b61ff',
      secondary: '#6d4aff',
      accent: '#ff7b00',
      background: '#ffffff',
      foreground: '#000000',
      border: '#e5e5e5',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#06b6d4',
      background: '#ffffff',
      foreground: '#0c4a6e',
      border: '#e0f2fe',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#fb923c',
      background: '#ffffff',
      foreground: '#7c2d12',
      border: '#ffedd5',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      primary: '#22c55e',
      secondary: '#16a34a',
      accent: '#84cc16',
      background: '#ffffff',
      foreground: '#14532d',
      border: '#dcfce7',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      background: '#0f172a',
      foreground: '#f1f5f9',
      border: '#334155',
    },
  },
];

interface ThemeCustomizerProps {
  onThemeChange?: (theme: Theme) => void;
}

export default function ThemeCustomizer({ onThemeChange }: ThemeCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0]);
  const [customColors, setCustomColors] = useState<ThemeColors>(defaultThemes[0].colors);
  const [savedThemes, setSavedThemes] = useState<Theme[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplied, setShowApplied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('custom-themes');
    if (saved != null) {
      try {
        setSavedThemes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load themes:', e);
      }
    }

    const activeTheme = localStorage.getItem('active-theme');
    if (activeTheme != null) {
      try {
        const theme = JSON.parse(activeTheme);
        applyTheme(theme);
      } catch (e) {
        console.error('Failed to load active theme:', e);
      }
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    setCustomColors(theme.colors);

    // Apply CSS variables to root
    const root = document.documentElement;

    // Apply as CSS custom properties
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-foreground', theme.colors.foreground);
    root.style.setProperty('--color-border', theme.colors.border);

    // Also apply to body for immediate visual feedback
    if (theme.colors.background === '#0f172a') {
      // Dark theme
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('active-theme', JSON.stringify(theme));
    onThemeChange?.(theme);

    // Show applied notification
    setShowApplied(true);
    setTimeout(() => setShowApplied(false), 2000);
  };

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    const newColors = { ...customColors, [key]: value };
    setCustomColors(newColors);

    const customTheme: Theme = {
      id: 'custom',
      name: 'Custom',
      colors: newColors,
    };
    applyTheme(customTheme);
  };

  const saveCustomTheme = () => {
    // Auto-generate name based on timestamp
    const themeName = `My Theme ${savedThemes.length + 1}`;

    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      name: themeName,
      colors: customColors,
    };

    const updated = [...savedThemes, newTheme];
    setSavedThemes(updated);
    localStorage.setItem('custom-themes', JSON.stringify(updated));

    // Apply the saved theme
    applyTheme(newTheme);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const deleteTheme = (id: string) => {
    const updated = savedThemes.filter((t) => t.id !== id);
    setSavedThemes(updated);
    localStorage.setItem('custom-themes', JSON.stringify(updated));
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(currentTheme, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${currentTheme.name.toLowerCase()}-theme.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTheme = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const theme = JSON.parse(event.target?.result as string);
          applyTheme(theme);
        } catch (error) {
          alert('Invalid theme file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const resetToDefault = () => {
    applyTheme(defaultThemes[0]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-6 z-40 p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        title="Customize Theme"
      >
        <Palette className="w-6 h-6" />
      </button>

      {/* Theme Customizer Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 overflow-y-auto animate-slide-in-from-right">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Theme Customizer
                </h2>
                {showApplied && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    ✓ Theme applied!
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            {/* Preset Themes */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Preset Themes
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {defaultThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => applyTheme(theme)}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all',
                      currentTheme.id === theme.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <div className="flex gap-1 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {theme.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Custom Colors
              </h3>
              <div className="space-y-3">
                {Object.entries(customColors).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-700"
                    />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize mb-1">
                        {key}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Themes */}
            {savedThemes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Saved Themes
                </h3>
                <div className="space-y-2">
                  {savedThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <button
                        onClick={() => applyTheme(theme)}
                        className="flex items-center gap-2 flex-1 text-left"
                      >
                        <div className="flex gap-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: theme.colors.secondary }}
                          />
                        </div>
                        <span className="text-sm font-medium">{theme.name}</span>
                      </button>
                      <button
                        onClick={() => deleteTheme(theme.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={saveCustomTheme}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                title="Save your current custom colors as a new theme"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Custom Colors
                  </>
                )}
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={exportTheme}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={importTheme}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Import
                </button>
                <button
                  onClick={resetToDefault}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Preview</p>
              <div className="space-y-2">
                <div
                  className="h-8 rounded"
                  style={{ backgroundColor: customColors.primary }}
                />
                <div
                  className="h-8 rounded"
                  style={{ backgroundColor: customColors.secondary }}
                />
                <div
                  className="h-8 rounded"
                  style={{ backgroundColor: customColors.accent }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
