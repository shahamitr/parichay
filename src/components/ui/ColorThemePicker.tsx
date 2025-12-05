// @ts-nocheck
'use client';

import { useState } from 'react';
import { isValidHexColor, getContrastColor } from '@/lib/utils';
import { themes } from '@/data/themes';
import { industryCategories } from '@/data/categories';

interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
}

interface ColorThemePickerProps {
  theme: ColorTheme;
  onChange: (theme: ColorTheme) => void;
  className?: string;
  userCategoryId?: string;
}

// Industry-based preset themes from our theme system
const industryThemes: ColorTheme[] = themes.map(theme => ({
  primary: theme.colors.primary,
  secondary: theme.colors.secondary,
  accent: theme.colors.accent,
}));

const presetThemes: ColorTheme[] = [
  ...industryThemes,
  { primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B' }, // Blue
  { primary: '#EF4444', secondary: '#DC2626', accent: '#F59E0B' }, // Red
  { primary: '#10B981', secondary: '#059669', accent: '#F59E0B' }, // Green
  { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#F59E0B' }, // Purple
  { primary: '#F59E0B', secondary: '#D97706', accent: '#3B82F6' }, // Orange
  { primary: '#06B6D4', secondary: '#0891B2', accent: '#F59E0B' }, // Cyan
  { primary: '#EC4899', secondary: '#DB2777', accent: '#F59E0B' }, // Pink
  { primary: '#84CC16', secondary: '#65A30D', accent: '#F59E0B' }, // Lime
];

export default function ColorThemePicker({ theme, onChange, className = '', userCategoryId }: ColorThemePickerProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [customTheme, setCustomTheme] = useState<ColorTheme>(theme);

  // Get recommended theme for user's category
  const recommendedTheme = userCategoryId
    ? themes.find(t => t.categoryId === userCategoryId)
    : null;

  const handlePresetSelect = (preset: ColorTheme) => {
    onChange(preset);
  };

  const handleCustomColorChange = (colorType: keyof ColorTheme, value: string) => {
    const newTheme = { ...customTheme, [colorType]: value };
    setCustomTheme(newTheme);

    // Only update if it's a valid hex color
    if (isValidHexColor(value)) {
      onChange(newTheme);
    }
  };

  const generateRandomTheme = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ];

    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    const randomTheme = {
      primary: shuffled[0],
      secondary: shuffled[1],
      accent: shuffled[2],
    };

    setCustomTheme(randomTheme);
    onChange(randomTheme);
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'presets'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            Preset Themes
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'custom'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            Custom Colors
          </button>
        </div>

        {/* Current Theme Preview */}
        <div className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Current Theme</h4>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <div
                className="w-8 h-8 rounded border dark:border-gray-600 shadow-sm"
                style={{ backgroundColor: theme.primary }}
                title="Primary Color"
              />
              <div
                className="w-8 h-8 rounded border dark:border-gray-600 shadow-sm"
                style={{ backgroundColor: theme.secondary }}
                title="Secondary Color"
              />
              <div
                className="w-8 h-8 rounded border dark:border-gray-600 shadow-sm"
                style={{ backgroundColor: theme.accent }}
                title="Accent Color"
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <div>Primary: {theme.primary}</div>
              <div>Secondary: {theme.secondary}</div>
              <div>Accent: {theme.accent}</div>
            </div>
          </div>

          {/* Theme Preview Card */}
          <div className="mt-3 p-3 rounded border dark:border-gray-600" style={{ backgroundColor: theme.primary }}>
            <div
              className="text-sm font-medium mb-1"
              style={{ color: getContrastColor(theme.primary) }}
            >
              Sample Business Card
            </div>
            <div
              className="text-xs opacity-90"
              style={{ color: getContrastColor(theme.primary) }}
            >
              This is how your brand colors will look
            </div>
            <div className="flex space-x-2 mt-2">
              <div
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: theme.secondary,
                  color: getContrastColor(theme.secondary)
                }}
              >
                Button
              </div>
              <div
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: theme.accent,
                  color: getContrastColor(theme.accent)
                }}
              >
                Accent
              </div>
            </div>
          </div>
        </div>

        {/* Preset Themes */}
        {activeTab === 'presets' && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Choose a Preset</h4>
            <div className="grid grid-cols-4 gap-3">
              {presetThemes.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetSelect(preset)}
                  className={`p-2 border rounded-lg hover:shadow-md transition-shadow ${JSON.stringify(preset) === JSON.stringify(theme)
                      ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                      : 'border-gray-200 dark:border-gray-700'
                    }`}
                >
                  <div className="flex space-x-1 mb-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Theme {index + 1}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Colors */}
        {activeTab === 'custom' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Colors</h4>
              <button
                onClick={generateRandomTheme}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Generate Random
              </button>
            </div>

            <div className="space-y-4">
              {/* Primary Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={customTheme.primary}
                    onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                    className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer bg-white dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    value={customTheme.primary}
                    onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                    className="flex-1 text-sm rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={customTheme.secondary}
                    onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                    className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer bg-white dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    value={customTheme.secondary}
                    onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                    className="flex-1 text-sm rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    placeholder="#1E40AF"
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={customTheme.accent}
                    onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                    className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer bg-white dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    value={customTheme.accent}
                    onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                    className="flex-1 text-sm rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    placeholder="#F59E0B"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}