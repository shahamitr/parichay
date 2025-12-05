'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { CTASection } from '@/types/microsite';

interface CTAEditorProps {
  config?: CTASection;
  onChange: (data: CTASection) => void;
}

export default function CTAEditor({
  config = {
    enabled: false,
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    backgroundType: 'gradient'
  },
  onChange
}: CTAEditorProps) {
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Call-to-Action Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Encourage visitors to take action with a compelling CTA
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable CTA Section</h3>
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
              CTA Title *
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ready to Get Started?"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CTA Subtitle
            </label>
            <textarea
              value={config.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Contact us today for a free consultation"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Button Text & Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Button Text *
              </label>
              <input
                type="text"
                value={config.buttonText}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="Get Started"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Button Link *
              </label>
              <input
                type="text"
                value={config.buttonLink}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                placeholder="/contact or #contact"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>

          {/* Background Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Background Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['gradient', 'image'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleChange('backgroundType', type)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${config.backgroundType === type
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
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
                    alt="CTA background"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                className="hidden"
                id="cta-bg-upload"
                disabled={uploading}
              />
              <label
                htmlFor="cta-bg-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Background Image'}
              </label>
            </div>
          )}

          {/* Preview */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </label>
            <div className={`p-8 rounded-lg text-center ${config.backgroundType === 'gradient'
                ? 'bg-gradient-to-r from-primary-500 to-accent-500'
                : 'bg-gray-200 dark:bg-gray-700'
              }`}
              style={config.backgroundType === 'image' && config.backgroundImage ? {
                backgroundImage: `url(${config.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : {}}>
              <div className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-6 rounded-lg inline-block">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {config.title || 'Your CTA Title'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {config.subtitle || 'Your CTA subtitle'}
                </p>
                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium">
                  {config.buttonText || 'Button Text'}
                </button>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 CTA Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Use action-oriented language (Get, Start, Join, Try)</li>
              <li>Create urgency without being pushy</li>
              <li>Make the button text specific and clear</li>
              <li>Ensure high contrast for readability</li>
              <li>Link to contact form or key action page</li>
              <li>Test different variations to see what works</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
