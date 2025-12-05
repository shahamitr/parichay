// @ts-nocheck
'use client';

import { useState } from 'react';
import ColorThemePicker from '@/components/ui/ColorThemePicker';
import FileUpload from '@/components/ui/FileUpload';

interface OnboardingStep1Props {
  onComplete: (data: any) => void;
  initialData?: any;
}

export default function OnboardingStep1({ onComplete, initialData }: OnboardingStep1Props) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    tagline: initialData?.tagline || '',
    logo: initialData?.logo || '',
    colorTheme: initialData?.colorTheme || {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#F59E0B',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onComplete(data.brand);
      } else {
        setError(data.error || 'Failed to create brand');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Create Your Brand
      </h2>
      <p className="text-gray-600 mb-6">
        Let's start by setting up your brand identity
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Neelkanth EV Motors"
          />
        </div>

        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-2">
            Tagline
          </label>
          <input
            type="text"
            id="tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Driving the Future of Electric Mobility"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Logo
          </label>
          <FileUpload
            onUploadComplete={(url) => setFormData({ ...formData, logo: url })}
            currentFile={formData.logo}
            accept="image/*"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Colors
          </label>
          <ColorThemePicker
            value={formData.colorTheme}
            onChange={(colorTheme) => setFormData({ ...formData, colorTheme })}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}
