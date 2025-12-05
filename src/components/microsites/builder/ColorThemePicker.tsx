'use client';

import { useState, useEffect } from 'react';
import { Palette, Check, RefreshCw, Pipette } from 'lucide-react';

interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
}

interface ColorThemePickerProps {
  theme: ColorTheme;
  onChange: (theme: ColorTheme) => void;
}

// Preset color themes
const presetThemes: { name: string; colors: ColorTheme }[] = [
  { name: 'Ocean Blue', colors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B' } },
  { name: 'Forest Green', colors: { primary: '#10B981', secondary: '#065F46', accent: '#F97316' } },
  { name: 'Royal Purple', colors: { primary: '#8B5CF6', secondary: '#5B21B6', accent: '#EC4899' } },
  { name: 'Sunset Orange', colors: { primary: '#F97316', secondary: '#C2410C', accent: '#3B82F6' } },
  { name: 'Rose Pink', colors: { primary: '#EC4899', secondary: '#BE185D', accent: '#8B5CF6' } },
  { name: 'Slate Gray', colors: { primary: '#64748B', secondary: '#334155', accent: '#F59E0B' } },
  { name: 'Teal', colors: { primary: '#14B8A6', secondary: '#0F766E', accent: '#F43F5E' } },
  { name: 'Indigo', colors: { primary: '#6366F1', secondary: '#4338CA', accent: '#22C55E' } },
  { name: 'Amber', colors: { primary: '#F59E0B', secondary: '#B45309', accent: '#3B82F6' } },
  { name: 'Crimson', colors: { primary: '#DC2626', secondary: '#991B1B', accent: '#FBBF24' } },
  { name: 'Emerald', colors: { primary: '#059669', secondary: '#047857', accent: '#F472B6' } },
  { name: 'Sky', colors: { primary: '#0EA5E9', secondary: '#0369A1', accent: '#F97316' } },
];

// Industry-specific themes
const industryThemes: { industry: string; colors: ColorTheme }[] = [
  { industry: 'Healthcare', colors: { primary: '#0EA5E9', secondary: '#0369A1', accent: '#10B981' } },
  { industry: 'Legal', colors: { primary: '#1E3A5F', secondary: '#0F172A', accent: '#B8860B' } },
  { industry: 'Restaurant', colors: { primary: '#DC2626', secondary: '#7F1D1D', accent: '#FBBF24' } },
  { industry: 'Salon & Spa', colors: { primary: '#EC4899', secondary: '#9D174D', accent: '#A855F7' } },
  { industry: 'Real Estate', colors: { primary: '#059669', secondary: '#065F46', accent: '#F59E0B' } },
  { industry: 'Technology', colors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#22C55E' } },
  { industry: 'Education', colors: { primary: '#6366F1', secondary: '#4338CA', accent: '#F97316' } },
  { industry: 'Fitness', colors: { primary: '#EF4444', secondary: '#B91C1C', accent: '#22C55E' } },
];

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setInputValue(newValue);
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

export default function ColorThemePicker({ theme, onChange }: ColorThemePickerProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'industry' | 'custom'>('presets');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePresetSelect = (colors: ColorTheme) => {
    onChange(colors);
  };

  const handleColorChange = (key: keyof ColorTheme, value: string) => {
    onChange({ ...theme, [key]: value });
  };

  const generateComplementary = () => {
    // Generate complementary colors based on primary
    const primary = theme.primary;
    // Simple complementary calculation
    const hex = primary.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Darken for secondary
    const secondary = `#${Math.max(0, r - 40).toString(16).padStart(2, '0')}${Math.max(0, g - 40).toString(16).padStart(2, '0')}${Math.max(0, b - 40).toString(16).padStart(2, '0')}`;

    // Complementary for accent
    const accent = `#${(255 - r).toString(16).padStart(2, '0')}${(255 - g).toString(16).padStart(2, '0')}${(255 - b).toString(16).padStart(2, '0')}`;

    onChange({ primary, secondary, accent });
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Color Theme</h3>
      </div>

      {/* Preview */}
      <div className="mb-4 p-4 rounded-lg border bg-gray-50">
        <p className="text-xs text-gray-500 mb-2">Preview</p>
        <div className="flex gap-2">
          <div
            className="flex-1 h-12 rounded-lg flex items-center justify-center text-white text-xs font-medium"
            style={{ backgroundColor: theme.primary }}
          >
            Primary
          </div>
          <div
            className="flex-1 h-12 rounded-lg flex items-center justify-center text-white text-xs font-medium"
            style={{ backgroundColor: theme.secondary }}
          >
            Secondary
          </div>
          <div
            className="flex-1 h-12 rounded-lg flex items-center justify-center text-white text-xs font-medium"
            style={{ backgroundColor: theme.accent }}
          >
            Accent
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
        {(['presets', 'industry', 'custom'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Preset Themes */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-3 gap-2">
          {presetThemes.map((preset) => {
            const isSelected =
              preset.colors.primary === theme.primary &&
              preset.colors.secondary === theme.secondary;
            return (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset.colors)}
                className={`relative p-2 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex gap-0.5 mb-1">
                  <div
                    className="flex-1 h-6 rounded-l"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div
                    className="flex-1 h-6"
                    style={{ backgroundColor: preset.colors.secondary }}
                  />
                  <div
                    className="flex-1 h-6 rounded-r"
                    style={{ backgroundColor: preset.colors.accent }}
                  />
                </div>
                <p className="text-xs text-gray-600 truncate">{preset.name}</p>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Industry Themes */}
      {activeTab === 'industry' && (
        <div className="grid grid-cols-2 gap-2">
          {industryThemes.map((item) => {
            const isSelected =
              item.colors.primary === theme.primary &&
              item.colors.secondary === theme.secondary;
            return (
              <button
                key={item.industry}
                onClick={() => handlePresetSelect(item.colors)}
                className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex gap-0.5 mb-2">
                  <div
                    className="flex-1 h-4 rounded-l"
                    style={{ backgroundColor: item.colors.primary }}
                  />
                  <div
                    className="flex-1 h-4"
                    style={{ backgroundColor: item.colors.secondary }}
                  />
                  <div
                    className="flex-1 h-4 rounded-r"
                    style={{ backgroundColor: item.colors.accent }}
                  />
                </div>
                <p className="text-sm font-medium text-gray-900">{item.industry}</p>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Custom Colors */}
      {activeTab === 'custom' && (
        <div className="space-y-4">
          <ColorInput
            label="Primary Color"
            value={theme.primary}
            onChange={(v) => handleColorChange('primary', v)}
          />
          <ColorInput
            label="Secondary Color"
            value={theme.secondary}
            onChange={(v) => handleColorChange('secondary', v)}
          />
          <ColorInput
            label="Accent Color"
            value={theme.accent}
            onChange={(v) => handleColorChange('accent', v)}
          />

          <button
            onClick={generateComplementary}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Auto-generate from Primary
          </button>
        </div>
      )}
    </div>
  );
}
