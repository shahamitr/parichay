'use client';

import { useState } from 'react';
import { Info, Image } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';

interface AboutEditorProps {
  config: any;
  onChange: (config: any) => void;
}

export default function AboutEditor({ config, onChange }: AboutEditorProps) {
  const [localConfig, setLocalConfig] = useState(config || {
    enabled: true,
    title: 'About Us',
    content: '',
    image: '',
    features: [],
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
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Info className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">About Section</h3>
            <p className="text-sm text-gray-400">Tell visitors about your business</p>
          </div>
        </div>
        <Toggle
          enabled={localConfig.enabled}
          onChange={(enabled) => handleChange('enabled', enabled)}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Section Title</label>
          <input
            type="text"
            value={localConfig.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="About Us"
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
          <textarea
            value={localConfig.content || ''}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="Tell your story here..."
            rows={6}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Image URL</label>
          <input
            type="url"
            value={localConfig.image || ''}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://example.com/about-image.jpg"
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
          />
        </div>

        {localConfig.image && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Preview:</p>
            <img
              src={localConfig.image}
              alt="About preview"
              className="max-w-xs rounded-lg border border-gray-800"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
