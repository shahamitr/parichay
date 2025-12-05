'use client';

import React, { useState } from 'react';
import CategorySelector from '@/components/onboarding/CategorySelector';
import TemplateGallery from '@/components/templates/TemplateGallery';
import ThemeSelector from '@/components/themes/ThemeSelector';
import { MicrositeTemplate } from '@/data/templates';
import { ThemeConfig } from '@/data/themes';

export default function TestCategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MicrositeTemplate | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig | null>(null);
  const [currentView, setCurrentView] = useState<'category' | 'template' | 'theme'>('category');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Industry Categories Feature Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test all components of the industry categories feature
          </p>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setCurrentView('category')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentView === 'category'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              1. Category Selection
            </button>
            <button
              onClick={() => setCurrentView('template')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentView === 'template'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              2. Template Gallery
            </button>
            <button
              onClick={() => setCurrentView('theme')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentView === 'theme'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              3. Theme Selector
            </button>
          </div>

          {/* Selection Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-sm text-gray-500 mb-1">Category</div>
                <div className="font-medium text-gray-900">
                  {selectedCategory || 'Not selected'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Template</div>
                <div className="font-medium text-gray-900">
                  {selectedTemplate?.name || 'Not selected'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Theme</div>
                <div className="font-medium text-gray-900">
                  {selectedTheme?.name || 'Not selected'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentView === 'category' && (
            <CategorySelector
              selectedCategory={selectedCategory || undefined}
              onSelect={(categoryId) => {
                setSelectedCategory(categoryId);
                console.log('Selected category:', categoryId);
              }}
              onSkip={() => {
                setSelectedCategory(null);
                setCurrentView('template');
              }}
            />
          )}

          {currentView === 'template' && (
            <TemplateGallery
              selectedCategoryId={selectedCategory || undefined}
              onSelectTemplate={(template) => {
                setSelectedTemplate(template);
                console.log('Selected template:', template);
              }}
            />
          )}

          {currentView === 'theme' && (
            <ThemeSelector
              selectedThemeId={selectedTheme?.id}
              categoryId={selectedCategory || undefined}
              onSelect={(theme) => {
                setSelectedTheme(theme);
                console.log('Selected theme:', theme);
              }}
            />
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          {currentView === 'category' && selectedCategory && (
            <button
              onClick={() => setCurrentView('template')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Next: Choose Template
            </button>
          )}
          {currentView === 'template' && selectedTemplate && (
            <button
              onClick={() => setCurrentView('theme')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Next: Choose Theme
            </button>
          )}
          {currentView === 'theme' && selectedTheme && (
            <button
              onClick={() => {
                alert('All selections complete!\n\n' +
                  `Category: ${selectedCategory}\n` +
                  `Template: ${selectedTemplate?.name}\n` +
                  `Theme: ${selectedTheme?.name}`
                );
              }}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Complete Setup
            </button>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
