'use client';

import { useState } from 'react';
import { Image, Type, Sparkles } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';

interface HeroEditorProps {
  config: any;
  onChange: (config: any) => void;
}

export default function HeroEditor({ config, onChange }: HeroEditorProps) {
  const [localConfig, setLocalConfig] = useState(config || {
    enabled: true,
    title: '',
    subtitle: '',
    backgroundType: 'gradient',
    backgroundImage: '',
    ctaText: '',
    ctaLink: '',
  });

  const handleChange = (field: string, value: any) => {
    const updated = { ...localConfig, [field]: value };
    setLocalConfig(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Hero Section</h3>
            <p className="text-sm text-gray-400">Configure your hero banner</p>
          </div>
        </div>
        <Toggle
          enabled={localConfig.enabled}
          onChange={(enabled) => handleChange('enabled', enabled)}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
          <input
            type="text"
            value={localConfig.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Welcome to our business"
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle</label>
          <textarea
            value={localConfig.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            placeholder="A brief description of what you do"
            rows={3}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Background Type</label>
          <select
            value={localConfig.backgroundType || 'gradient'}
            onChange={(e) => handleChange('backgroundType', e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
          >
            <option value="gradient">Gradient</option>
            <option value="image">Image</option>
            <option value="solid">Solid Color</option>
          </select>
        </div>

        {localConfig.backgroundType === 'image' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Background Image URL</label>
            <input
              type="url"
              value={localConfig.backgroundImage || ''}
              onChange={(e) => handleChange('backgroundImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">CTA Button Text</label>
            <input
              type="text"
              value={localConfig.ctaText || ''}
              onChange={(e) => handleChange('ctaText', e.target.value)}
              placeholder="Get Started"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">CTA Link</label>
            <input
              type="text"
              value={localConfig.ctaLink || ''}
              onChange={(e) => handleChange('ctaLink', e.target.value)}
              placeholder="#contact"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
