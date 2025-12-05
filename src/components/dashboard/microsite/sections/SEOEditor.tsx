'use client';

import { useState } from 'react';
import DynamicFieldArray from '../DynamicFieldArray';
import { Upload } from 'lucide-react';
import { SEOSettings } from '@/types/microsite';

interface SEOEditorProps {
  config: SEOSettings;
  onChange: (data: SEOSettings) => void;
  canEditAdvanced: boolean;
}

export default function SEOEditor({ config, onChange, canEditAdvanced }: SEOEditorProps) {
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
      handleChange('ogImage', data.url);
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">SEO Settings</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Optimize your microsite for search engines and social media sharing
        </p>
      </div>

      {/* Meta Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Meta Title *
        </label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Your Business Name - What You Do"
          maxLength={60}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
        />
        <div className="flex justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">
            Recommended: 50-60 characters
          </span>
          <span className={`${(config.title?.length || 0) > 60 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
            {config.title?.length || 0}/60
          </span>
        </div>
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Meta Description *
        </label>
        <textarea
          value={config.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe your business in 150-160 characters. This appears in search results."
          maxLength={160}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
        />
        <div className="flex justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">
            Recommended: 150-160 characters
          </span>
          <span className={`${(config.description?.length || 0) > 160 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
            {config.description?.length || 0}/160
          </span>
        </div>
      </div>

      {/* Keywords */}
      <DynamicFieldArray
        label="Keywords"
        values={config.keywords || []}
        onChange={(values) => handleChange('keywords', values)}
        type="text"
        placeholder="Enter keyword"
        maxItems={10}
        helpText="Add relevant keywords for your business (max 10)"
      />

      {/* OG Image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Social Media Image (OG Image)
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          This image appears when your microsite is shared on social media
        </p>
        {config.ogImage && (
          <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 mb-2">
            <img
              src={config.ogImage}
              alt="OG Image"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
          className="hidden"
          id="og-image-upload"
          disabled={uploading}
        />
        <label
          htmlFor="og-image-upload"
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer disabled:opacity-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload OG Image'}
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Recommended size: 1200x630px (PNG or JPG)
        </p>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search Result Preview</h3>
        <div className="space-y-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            https://yourdomain.com/your-business
          </div>
          <div className="text-lg text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            {config.title || 'Your Business Name - What You Do'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {config.description || 'Your business description will appear here. Make it compelling to encourage clicks from search results.'}
          </div>
        </div>
      </div>

      {/* Social Media Preview */}
      {config.ogImage && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media Preview</h3>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-w-md">
            <img
              src={config.ogImage}
              alt="Social preview"
              className="w-full h-48 object-cover"
            />
            <div className="p-3 bg-gray-50 dark:bg-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">yourdomain.com</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {config.title || 'Your Business Name'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                {config.description || 'Your description'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 SEO Tips</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
          <li>Include your main keyword in the title and description</li>
          <li>Write unique, compelling descriptions for each page</li>
          <li>Use high-quality images for social sharing</li>
          <li>Keep titles under 60 characters to avoid truncation</li>
          <li>Make descriptions actionable to improve click-through rates</li>
          <li>Update SEO settings when you change your business focus</li>
        </ul>
      </div>

      {canEditAdvanced && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-300 mb-2">⚡ Advanced SEO</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Advanced SEO features like structured data, custom meta tags, and robots.txt configuration will be available in a future update.
          </p>
        </div>
      )}
    </div>
  );
}
