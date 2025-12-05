'use client';

import { useState } from 'react';
import { Type, Check } from 'lucide-react';

interface FontConfig {
  heading: string;
  body: string;
}

interface FontSelectorProps {
  fonts: FontConfig;
  onChange: (fonts: FontConfig) => void;
}

// Available font families
const fontFamilies = [
  { name: 'Inter', value: 'Inter, sans-serif', category: 'Sans-serif', preview: 'Modern & Clean' },
  { name: 'Poppins', value: 'Poppins, sans-serif', category: 'Sans-serif', preview: 'Friendly & Round' },
  { name: 'Roboto', value: 'Roboto, sans-serif', category: 'Sans-serif', preview: 'Professional' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif', category: 'Sans-serif', preview: 'Readable' },
  { name: 'Lato', value: 'Lato, sans-serif', category: 'Sans-serif', preview: 'Elegant' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif', category: 'Sans-serif', preview: 'Bold & Modern' },
  { name: 'Nunito', value: 'Nunito, sans-serif', category: 'Sans-serif', preview: 'Soft & Friendly' },
  { name: 'Raleway', value: 'Raleway, sans-serif', category: 'Sans-serif', preview: 'Stylish' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif', category: 'Sans-serif', preview: 'Clear' },
  { name: 'Work Sans', value: 'Work Sans, sans-serif', category: 'Sans-serif', preview: 'Geometric' },
  { name: 'Playfair Display', value: 'Playfair Display, serif', category: 'Serif', preview: 'Elegant & Classic' },
  { name: 'Merriweather', value: 'Merriweather, serif', category: 'Serif', preview: 'Traditional' },
  { name: 'Lora', value: 'Lora, serif', category: 'Serif', preview: 'Sophisticated' },
  { name: 'PT Serif', value: 'PT Serif, serif', category: 'Serif', preview: 'Formal' },
  { name: 'Libre Baskerville', value: 'Libre Baskerville, serif', category: 'Serif', preview: 'Classic' },
];

// Font pairings (heading + body combinations)
const fontPairings = [
  { name: 'Modern Professional', heading: 'Montserrat, sans-serif', body: 'Open Sans, sans-serif' },
  { name: 'Clean & Minimal', heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
  { name: 'Friendly & Warm', heading: 'Poppins, sans-serif', body: 'Nunito, sans-serif' },
  { name: 'Elegant Classic', heading: 'Playfair Display, serif', body: 'Lato, sans-serif' },
  { name: 'Bold & Dynamic', heading: 'Montserrat, sans-serif', body: 'Roboto, sans-serif' },
  { name: 'Sophisticated', heading: 'Lora, serif', body: 'Source Sans Pro, sans-serif' },
  { name: 'Tech Forward', heading: 'Raleway, sans-serif', body: 'Open Sans, sans-serif' },
  { name: 'Traditional', heading: 'Merriweather, serif', body: 'Merriweather, serif' },
];

export default function FontSelector({ fonts, onChange }: FontSelectorProps) {
  const [activeTab, setActiveTab] = useState<'pairings' | 'custom'>('pairings');

  const handlePairingSelect = (pairing: typeof fontPairings[0]) => {
    onChange({ heading: pairing.heading, body: pairing.body });
  };

  const handleFontChange = (type: 'heading' | 'body', value: string) => {
    onChange({ ...fonts, [type]: value });
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Type className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Typography</h3>
      </div>

      {/* Preview */}
      <div className="mb-4 p-4 rounded-lg border bg-white">
        <p className="text-xs text-gray-500 mb-2">Preview</p>
        <h4
          className="text-2xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: fonts.heading }}
        >
          Heading Text
        </h4>
        <p
          className="text-gray-600"
          style={{ fontFamily: fonts.body }}
        >
          This is how your body text will look. It should be easy to read and complement your headings nicely.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('pairings')}
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'pairings'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Font Pairings
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'custom'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Custom
        </button>
      </div>

      {/* Font Pairings */}
      {activeTab === 'pairings' && (
        <div className="space-y-2">
          {fontPairings.map((pairing) => {
            const isSelected =
              pairing.heading === fonts.heading && pairing.body === fonts.body;
            return (
              <button
                key={pairing.name}
                onClick={() => handlePairingSelect(pairing)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{pairing.name}</span>
                  {isSelected && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p
                  className="text-lg font-bold text-gray-800 mb-1"
                  style={{ fontFamily: pairing.heading }}
                >
                  Heading Style
                </p>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: pairing.body }}
                >
                  Body text preview
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Custom Font Selection */}
      {activeTab === 'custom' && (
        <div className="space-y-4">
          {/* Heading Font */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heading Font
            </label>
            <select
              value={fonts.heading}
              onChange={(e) => handleFontChange('heading', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: fonts.heading }}
            >
              <optgroup label="Sans-serif">
                {fontFamilies
                  .filter((f) => f.category === 'Sans-serif')
                  .map((font) => (
                    <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name} - {font.preview}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Serif">
                {fontFamilies
                  .filter((f) => f.category === 'Serif')
                  .map((font) => (
                    <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name} - {font.preview}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Body Font */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Font
            </label>
            <select
              value={fonts.body}
              onChange={(e) => handleFontChange('body', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: fonts.body }}
            >
              <optgroup label="Sans-serif">
                {fontFamilies
                  .filter((f) => f.category === 'Sans-serif')
                  .map((font) => (
                    <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name} - {font.preview}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Serif">
                {fontFamilies
                  .filter((f) => f.category === 'Serif')
                  .map((font) => (
                    <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name} - {font.preview}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Font Size Scale */}
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Tip: Sans-serif fonts work best for body text on screens, while serif fonts add elegance to headings.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Export font CSS generator
export function generateFontCSS(fonts: FontConfig): string {
  return `
    .microsite-container h1,
    .microsite-container h2,
    .microsite-container h3,
    .microsite-container h4,
    .microsite-container h5,
    .microsite-container h6 {
      font-family: ${fonts.heading};
    }
    .microsite-container p,
    .microsite-container span,
    .microsite-container div,
    .microsite-container li,
    .microsite-container a {
      font-family: ${fonts.body};
    }
  `;
}
