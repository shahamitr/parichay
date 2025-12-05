'use client';

import { useState, useEffect } from 'react';
import { MicrositeConfig } from '@/types/microsite';
import { micrositeTemplates, MicrositeTemplate } from '@/data/templates';
import { industryCategories } from '@/data/categories';
import { applyTemplate, getRecommendedTemplates } from '@/lib/template-utils';

interface TemplateSelectorProps {
  currentConfig: MicrositeConfig;
  onTemplateSelect: (config: MicrositeConfig) => void;
  onClose: () => void;
  userCategoryId?: string;
}

export default function TemplateSelector({
  currentConfig,
  onTemplateSelect,
  onClose,
  userCategoryId,
}: TemplateSelectorProps) {
  const [filteredTemplates, setFilteredTemplates] = useState<MicrositeTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<MicrositeTemplate | null>(null);

  const categories = [
    { value: 'all', label: 'All Templates' },
    ...industryCategories.filter(cat => cat.enabled).map(cat => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  useEffect(() => {
    filterTemplates();
  }, [selectedCategory, userCategoryId]);

  const filterTemplates = () => {
    let filtered = micrositeTemplates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.categoryId === selectedCategory);
    } else if (userCategoryId != null) {
      // Show recommended templates first if no specific category selected
      filtered = getRecommendedTemplates(userCategoryId);
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplateSelect = (template: MicrositeTemplate) => {
    const newConfig = applyTemplate(template, currentConfig);
    onTemplateSelect(newConfig);
    onClose();
  };

  const handlePreview = (template: MicrositeTemplate) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose Template</h2>
              <p className="text-gray-600 mt-1">
                Select a template that matches your business style
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              {userCategoryId && (
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
                  ✨ Showing recommended templates for your industry
                </div>
              )}
              <div className="text-sm text-gray-500 ml-auto">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more templates.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => {
                  const category = industryCategories.find(cat => cat.id === template.categoryId);
                  const isRecommended = template.categoryId === userCategoryId;

                  return (
                    <div
                      key={template.id}
                      className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                        currentConfig.templateId === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Template Preview */}
                      <div
                        className="aspect-video relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${template.theme.colors.primary}, ${template.theme.colors.secondary})`,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                          <div className="text-center p-4">
                            <div className="text-2xl font-bold mb-1">{template.name}</div>
                            <div className="text-sm opacity-90">{template.sections.length} Sections</div>
                          </div>
                        </div>

                        {isRecommended && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                            ✨ Recommended
                          </div>
                        )}
                        {currentConfig.templateId === template.id && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                            ✓ Current
                          </div>
                        )}
                      </div>

                      {/* Template Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          {category && (
                            <span
                              className="text-xs px-2 py-1 rounded font-medium"
                              style={{
                                backgroundColor: `${category.colorScheme.primary}15`,
                                color: category.colorScheme.primary,
                              }}
                            >
                              {category.name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                        {/* Sections */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {template.sections.slice(0, 3).map((section, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                              >
                                {section.title}
                              </span>
                            ))}
                            {template.sections.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{template.sections.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePreview(template)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleTemplateSelect(template)}
                            className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {currentConfig.templateId === template.id ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {previewTemplate.name} Preview
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Template Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Sections Included</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {previewTemplate.sections.map((section, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {section.title}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Color Scheme</h4>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: previewTemplate.theme.colors.primary }}
                      />
                      <span className="text-sm text-gray-600">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: previewTemplate.theme.colors.secondary }}
                      />
                      <span className="text-sm text-gray-600">Secondary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: previewTemplate.theme.colors.accent }}
                      />
                      <span className="text-sm text-gray-600">Accent</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Typography & Style</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Headings: <span className="font-semibold">{previewTemplate.theme.fonts.heading}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Body: <span className="font-semibold">{previewTemplate.theme.fonts.body}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Style: <span className="font-semibold capitalize">{previewTemplate.theme.layout.style}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Spacing: <span className="font-semibold capitalize">{previewTemplate.theme.layout.spacing}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={closePreview}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleTemplateSelect(previewTemplate);
                    closePreview();
                  }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Select Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}