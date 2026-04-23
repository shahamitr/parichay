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
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        Create Your Brand
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        Let's start by setting up your brand identity
      </p>

      {error && (
        <div className="mb-4 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-md">
          <p className="text-sm text-error-800 dark:text-error-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Brand Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            placeholder="e.g., Neelkanth EV Motors"
          />
        </div>

        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Tagline
          </label>
          <input
            type="text"
            id="tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            placeholder="e.g., Driving the Future of Electric Mobility"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Brand Logo
          </label>
          <FileUpload
            onUploadComplete={(url) => setFormData({ ...formData, logo: url })}
            currentFile={formData.logo}
            accept="image/*"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
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
            className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white dark:text-neutral-900 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}
