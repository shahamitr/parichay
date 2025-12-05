// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { themes, ThemeConfig } from '@/data/themes';
import { industryCategories } from '@/data/categories';
import { Check, Palette, Eye } from 'lucide-react';
import ThemePreview from './ThemePreview';

interface ThemeSelectorProps {
  selectedThemeId?: string;
  onSelect: (theme: ThemeConfig) => void;
  categoryId?: string;
}

export default function ThemeSelector({
  selectedThemeId,
  onSelect,
  categoryId
}: ThemeSelectorProps) {
  const [selected, setSelected] = useState<string | null>(selectedThemeId || null);
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);

  // Filter themes by category if provided
  const filteredThemes = categoryId
    ? themes.filter(theme => theme.categoryId === categoryId)
    : themes;

  const handleSelect = (theme: ThemeConfig) => {
    setSelected(theme.id);
    onSelect(theme);
  };

  const handlePreview = (theme: ThemeConfig) => {
    setPreviewTheme(theme);
  };

  const handlePreview = (theme: ThemeConfig) => {
    setPreviewTheme(theme);
  };

  const handleApplyFromPreview = () => {
    if (previewTheme != null) {
      handleSelect(previewTheme);
      setPreviewTheme(null);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Palette className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            Choose Your Theme
          </h2>
        </div>
        <p className="text-gray-600">
          Select a color scheme and style that matches your brand
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => {
          const isSelected = selected === theme.id;
          const category = industryCategories.find(cat => cat.id === theme.categoryId);

          return (
            <button
              key={theme.id}
              onClick={() => handleSelect(theme)}
              className={`
                relative bg-white rounded-xl p-6 text-left transition-all duration-200
                border-2 hover:shadow-lg
                ${isSelected
                  ? 'border-blue-600 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Theme Preview */}
              <div className="mb-4">
                <div className="flex gap-2 mb-3">
                  <div
                    className="w-16 h-16 rounded-lg shadow-sm"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div className="flex-1 space-y-2">
                    <div
                      className="h-7 rounded"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div
                      className="h-7 rounded"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                </div>
              </div>

              {/* Theme Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {theme.name}
                </h3>

                {category && (
                  <span
                    className="inline-block text-xs px-2 py-1 rounded-full font-medium mb-2"
                    style={{
                      backgroundColor: `${category.colorScheme.primary}15`,
                      color: category.colorScheme.primary,
                    }}
                  >
                    {category.name}
                  </span>
                )}

                <p className="text-sm text-gray-600 mb-4">
                  {theme.description}
                </p>

                {/* Style Details */}
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Style:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {theme.layout.style}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Spacing:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {theme.layout.spacing}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Corners:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {theme.layout.borderRadius}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shadows:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {theme.layout.shadows}
                    </span>
                  </div>
                </div>
              </div>

              {/* Color Palette */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-2">Color Palette</div>
                <div className="flex gap-1">
                  {[
                    theme.colors.primary,
                    theme.colors.secondary,
                    theme.colors.accent,
                    theme.colors.success,
                    theme.colors.warning,
                    theme.colors.error,
                  ].map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded border border-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Preview Button */}
              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(theme);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview Theme
                </button>
              </div>
            </button>
          );
        })}
      </div>

      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No themes available</p>
          <p className="text-gray-400 text-sm mt-2">
            Please select a different category
          </p>
        </div>
      )}

      {/* Theme Preview Modal */}
      {previewTheme && (
        <ThemePreview
          theme={previewTheme}
          onClose={() => setPreviewTheme(null)}
          onApply={() => handleSelect(previewTheme)}
        />
      )}
    </div>
  );
}
