'use client';

import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '@/types/theme';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { fontOptions } from '@/data/fonts';
import {
  validateThemeConfig,
  applyThemeToDocument,
  getDefaultThemeConfig,
} from '@/lib/theme-storage';

export interface ThemeEditorProps {
  initialTheme?: ThemeConfig;
  onSave: (theme: ThemeConfig) => void;
  onCancel?: () => void;
  showPreview?: boolean;
}

/**
 * ThemeEditor Component
 *
 * Provides UI for customizing theme colors and typography with live preview
 */
export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  initialTheme,
  onSave,
  onCancel,
  showPreview = true,
}) => {
  const [theme, setTheme] = useState<ThemeConfig>(
    initialTheme || getDefaultThemeConfig()
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Apply theme to preview
  useEffect(() => {
    if (showPreview != null) {
      applyThemeToDocument(theme);
    }
  }, [theme, showPreview]);

  const handleColorChange = (colorKey: keyof ThemeConfig['colors'], value: string) => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    }));
  };

  const handleFontChange = (fontKey: 'fontFamily' | 'headingFont', value: string) => {
    setTheme(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [fontKey]: value,
      },
    }));
  };

  const handleDarkModeToggle = () => {
    setTheme(prev => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  };

  const handleSave = async () => {
    // Validate theme
    const validated = validateThemeConfig(theme);

    if (!validated.isValid) {
      setErrors(validated.errors || []);
      return;
    }

    setErrors([]);
    setIsSaving(true);

    try {
      await onSave(theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
      setErrors(['Failed to save theme. Please try again.']);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setTheme(initialTheme || getDefaultThemeConfig());
    setErrors([]);
  };

  // Font options for select
  const fontSelectOptions = fontOptions.map(font => ({
    value: font.family,
    label: font.name,
  }));

  return (
    <div className="space-y-6">
      {/* Color Customization */}
      <Card elevation="md" className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
          Color Palette
        </h3>

        <div className="space-y-4">
          <ColorPicker
            label="Primary Color"
            value={theme.colors.primary}
            onChange={(value) => handleColorChange('primary', value)}
            helperText="Main brand color used for buttons and accents"
          />

          <ColorPicker
            label="Secondary Color"
            value={theme.colors.secondary}
            onChange={(value) => handleColorChange('secondary', value)}
            helperText="Supporting color for secondary elements"
          />

          <ColorPicker
            label="Accent Color"
            value={theme.colors.accent}
            onChange={(value) => handleColorChange('accent', value)}
            helperText="Highlight color for call-to-actions and emphasis"
          />
        </div>
      </Card>

      {/* Typography Customization */}
      <Card elevation="md" className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
          Typography
        </h3>

        <div className="space-y-4">
          <Select
            label="Body Font"
            value={theme.typography.fontFamily}
            onChange={(e) => handleFontChange('fontFamily', e.target.value)}
            options={fontSelectOptions}
            helperText="Font used for body text and paragraphs"
            fullWidth
          />

          <Select
            label="Heading Font"
            value={theme.typography.headingFont || theme.typography.fontFamily}
            onChange={(e) => handleFontChange('headingFont', e.target.value)}
            options={fontSelectOptions}
            helperText="Font used for headings and titles"
            fullWidth
          />
        </div>
      </Card>

      {/* Dark Mode Toggle */}
      <Card elevation="md" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              Dark Mode
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Enable dark color scheme
            </p>
          </div>

          <button
            type="button"
            onClick={handleDarkModeToggle}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${theme.darkMode ? 'bg-primary-500' : 'bg-neutral-300'}
            `}
            aria-label="Toggle dark mode"
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${theme.darkMode ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </Card>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-error-800 mb-2">
            Please fix the following errors:
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-error-700">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={handleReset}
          disabled={isSaving}
        >
          Reset
        </Button>

        <Button
          variant="primary"
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving}
        >
          Save Theme
        </Button>
      </div>
    </div>
  );
};
