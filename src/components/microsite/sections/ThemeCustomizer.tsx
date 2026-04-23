'use client';

import { useState } from 'react';
import { Palette, Type, Layout, Sparkles } from 'lucide-react';

interface ThemeCustomizerProps {
  config: any;
  onChange: (data: any) => void;
}

export default function ThemeCustomizer({ config, onChange }: ThemeCustomizerProps) {
  const [theme, setTheme] = useState({
    colors: {
      primary: config.theme?.colors?.primary || '#7b61ff',
      secondary: config.theme?.colors?.secondary || '#1F2937',
      accent: config.theme?.colors?.accent || '#ff7b00',
    },
    typography: {
      headingFont: config.theme?.typography?.headingFont || 'Cal Sans',
      bodyFont: config.theme?.typography?.bodyFont || 'Inter',
    },
    spacing: config.theme?.spacing || 'normal',
    borderRadius: config.theme?.borderRadius || 'rounded',
    animations: config.theme?.animations || 'normal',
  });

  const handleColorChange = (key: string, value: string) => {
    const newTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        [key]: value,
      },
    };
    setTheme(newTheme);
    onChange({ ...config, theme: newTheme });
  };

  const handleTypographyChange = (key: string, value: string) => {
    const newTheme = {
      ...theme,
      typography: {
        ...theme.typography,
        [key]: value,
      },
    };
    setTheme(newTheme);
    onChange({ ...config, theme: newTheme });
  };

  const handleOptionChange = (key: string, value: string) => {
    const newTheme = {
      ...theme,
      [key]: value,
    };
    setTheme(newTheme);
    onChange({ ...config, theme: newTheme });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Theme Customization</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Customize the look and feel of your microsite with colors, fonts, and styling options
        </p>
      </div>

      {/* Color Palette */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Color Palette</h3>
        </div>

        <div className="space-y-4">
          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={theme.colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="#7b61ff"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Main brand color for buttons, links, and accents
            </p>
          </div>

          {/* Secondary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={theme.colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="#1F2937"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supporting color for headers and text
            </p>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={theme.colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="#ff7b00"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Highlight color for call-to-actions and emphasis
            </p>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Typography</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Heading Font
            </label>
            <select
              value={theme.typography.headingFont}
              onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Cal Sans">Cal Sans (Modern)</option>
              <option value="Inter">Inter (Clean)</option>
              <option value="Poppins">Poppins (Friendly)</option>
              <option value="Playfair Display">Playfair Display (Elegant)</option>
              <option value="Montserrat">Montserrat (Professional)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Body Font
            </label>
            <select
              value={theme.typography.bodyFont}
              onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Inter">Inter (Recommended)</option>
              <option value="Open Sans">Open Sans (Classic)</option>
              <option value="Roboto">Roboto (Modern)</option>
              <option value="Lato">Lato (Friendly)</option>
              <option value="Source Sans Pro">Source Sans Pro (Professional)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layout & Spacing */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layout className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Layout & Spacing</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Spacing
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['compact', 'normal', 'spacious'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionChange('spacing', option)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${theme.spacing === option
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Border Radius
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['sharp', 'rounded', 'pill'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionChange('borderRadius', option)}
                  className={`px-4 py-2 border-2 transition-colors ${theme.borderRadius === option
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    } ${option === 'sharp'
                      ? 'rounded-none'
                      : option === 'rounded'
                        ? 'rounded-lg'
                        : 'rounded-full'
                    }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Animations</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Animation Speed
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['none', 'slow', 'normal', 'fast'].map((option) => (
              <button
                key={option}
                onClick={() => handleOptionChange('animations', option)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${theme.animations === option
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                  }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
        <div className="space-y-4">
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4
              style={{
                color: theme.colors.secondary,
                fontFamily: theme.typography.headingFont,
              }}
              className="text-2xl font-bold mb-2"
            >
              Heading Example
            </h4>
            <p
              style={{
                fontFamily: theme.typography.bodyFont,
              }}
              className="text-gray-600 dark:text-gray-300 mb-4"
            >
              This is how your body text will look with the selected font.
            </p>
            <div className="flex gap-3">
              <button
                style={{ backgroundColor: theme.colors.primary }}
                className={`px-6 py-3 text-white font-medium ${theme.borderRadius === 'sharp'
                    ? 'rounded-none'
                    : theme.borderRadius === 'rounded'
                      ? 'rounded-lg'
                      : 'rounded-full'
                  }`}
              >
                Primary Button
              </button>
              <button
                style={{ backgroundColor: theme.colors.accent }}
                className={`px-6 py-3 text-white font-medium ${theme.borderRadius === 'sharp'
                    ? 'rounded-none'
                    : theme.borderRadius === 'rounded'
                      ? 'rounded-lg'
                      : 'rounded-full'
                  }`}
              >
                Accent Button
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Theme Tips</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
          <li>Choose colors that reflect your brand identity</li>
          <li>Ensure good contrast between text and background</li>
          <li>Use consistent fonts throughout your microsite</li>
          <li>Test your theme on different devices</li>
          <li>Consider accessibility when choosing colors</li>
        </ul>
      </div>
    </div>
  );
}
