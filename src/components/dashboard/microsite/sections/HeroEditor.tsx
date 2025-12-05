'use client';

import { useState } from 'react';
import { HeroSection } from '@/types/microsite';

interface HeroEditorProps {
  config: HeroSection;
  onChange: (data: HeroSection) => void;
}

export default function HeroEditor({ config, onChange }: HeroEditorProps) {
  const [uploading, setUploading] = useState(false);

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'gallery');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      handleChange('backgroundImage', data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hero Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          The first thing visitors see - make it count!
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Hero Section</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Show or hide this section on your microsite
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      {config.enabled && (
        <>
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hero Title *
            </label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Welcome to Our Business"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hero Subtitle
            </label>
            <textarea
              value={config.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Your trusted partner for..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Background Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Background Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['gradient', 'image', 'video'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleChange('backgroundType', type)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${config.backgroundType === type
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Background Image Upload */}
          {config.backgroundType === 'image' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Background Image
              </label>
              {config.backgroundImage && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 mb-2">
                  <img
                    src={config.backgroundImage}
                    alt="Hero background"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                className="hidden"
                id="hero-bg-upload"
                disabled={uploading}
              />
              <label
                htmlFor="hero-bg-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload Background Image'}
              </label>
            </div>
          )}

          {/* Animation Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Animations</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Animate hero content on page load
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.animationEnabled ?? true}
                onChange={(e) => handleChange('animationEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Hero Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Keep your title short and impactful (5-10 words)</li>
              <li>Use high-quality images (at least 1920px wide)</li>
              <li>Ensure text is readable over background</li>
              <li>Test on mobile devices</li>
              <li>Include a clear call-to-action</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
