// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { industryCategories, IndustryCategory } from '@/data/categories';
import {
  Briefcase,
  Building2,
  CalendarCheck,
  UserCheck,
  GraduationCap,
  Palette,
  Save,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'briefcase': Briefcase,
  'building-2': Building2,
  'calendar-check': CalendarCheck,
  'user-check': UserCheck,
  'graduation-cap': GraduationCap,
  'palette': Palette,
};

export default function IndustryCategoriesSettings() {
  const [categories, setCategories] = useState<IndustryCategory[]>(industryCategories);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleToggleEnabled = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // In a real implementation, this would save to database
      // For now, we'll just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));

tMessage({
        type: 'success',
        text: 'Settings saved successfully! Note: Changes are currently stored in memory only.',
      });
      setHasChanges(false);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setCategories(industryCategories);
    setHasChanges(false);
    setMessage(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Industry Categories Management
        </h2>
        <p className="text-gray-600">
          Manage industry categories, enable/disable them, and view their configurations
        </p>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{message.text}</p>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {hasChanges && (
        <div className="mb-6 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon] || Briefcase;
          const isEditing = editingCategory === category.id;

          return (
            <div
              key={category.id}
              className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden"
            >
              {/* Category Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${category.colorScheme.primary}15`,
                      }}
                    >
                      <IconComponent
                        className="w-6 h-6"
                        style={{ color: category.colorScheme.primary }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Enable/Disable Toggle */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {category.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => handleToggleEnabled(category.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        category.enabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          category.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Category Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Features ({category.features.length})
                    </h4>
                    <ul className="space-y-1">
                      {category.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                      {category.features.length > 4 && (
                        <li className="text-sm text-gray-500">
                          +{category.features.length - 4} more
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Benefits ({category.benefits.length})
                    </h4>
                    <ul className="space-y-1">
                      {category.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Color Scheme */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Color Scheme
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: category.colorScheme.primary }}
                        />
                        <span className="text-xs text-gray-600">Primary</span>
                        <span className="text-xs text-gray-500 font-mono">
                          {category.colorScheme.primary}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: category.colorScheme.secondary }}
                        />
                        <span className="text-xs text-gray-600">Secondary</span>
                        <span className="text-xs text-gray-500 font-mono">
                          {category.colorScheme.secondary}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: category.colorScheme.accent }}
                        />
                        <span className="text-xs text-gray-600">Accent</span>
                        <span className="text-xs text-gray-500 font-mono">
                          {category.colorScheme.accent}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Use Cases */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Use Cases
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.useCases.map((useCase, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Development Note</p>
            <p>
              Category data is currently stored in static files (<code className="bg-blue-100 px-1 rounded">src/data/categories.ts</code>).
              To enable full editing capabilities, categories should be migrated to database storage.
              For now, you can enable/disable categories, and changes will be saved to the session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
