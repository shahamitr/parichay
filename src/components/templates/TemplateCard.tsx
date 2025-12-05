'use client';

import React, { useState } from 'react';
import { MicrositeTemplate } from '@/data/templates';
import { industryCategories } from '@/data/categories';
import { Eye, Check } from 'lucide-react';

interface TemplateCardProps {
  template: MicrositeTemplate;
  onSelect?: (template: MicrositeTemplate) => void;
  isSelected?: boolean;
}

export default function TemplateCard({
  template,
  onSelect,
  isSelected = false
}: TemplateCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const category = industryCategories.find(cat => cat.id === template.categoryId);

  const handleSelect = () => {
    if (onSelect != null) {
      onSelect(template);
    }
  };

  return (
    <>
      <div
        className={`
          bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300
          border-2 cursor-pointer
          ${isSelected ? 'border-blue-600' : 'border-transparent hover:border-gray-200'}
        `}
        onClick={handleSelect}
      >
        {/* Preview Image */}
        <div
          className="relative h-48 bg-gradient-to-br overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${template.theme.colors.primary}, ${template.theme.colors.secondary})`,
          }}
        >
          {isSelected && (
            <div className="absolute top-3 right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center p-6">
              <div className="text-4xl font-bold mb-2">{template.name}</div>
              <div className="text-sm opacity-90">{template.sections.length} Sections</div>
            </div>
          </div>

          {/* Preview Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPreview(true);
            }}
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-900 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>

        {/* Template Info */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">
              {template.name}
            </h3>
            {category && (
              <span
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: `${category.colorScheme.primary}15`,
                  color: category.colorScheme.primary,
                }}
              >
                {category.name}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {template.description}
          </p>

          {/* Theme Info */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500">Style:</span>
            <span className="text-xs font-medium text-gray-700 capitalize">
              {template.theme.layout.style}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-gray-700 capitalize">
              {template.theme.layout.spacing} spacing
            </span>
          </div>

          {/* Sections Preview */}
          <div className="border-t pt-4">
            <div className="text-xs text-gray-500 mb-2">Includes:</div>
            <div className="flex flex-wrap gap-1">
              {template.sections.slice(0, 4).map((section, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {section.title}
                </span>
              ))}
              {template.sections.length > 4 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{template.sections.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Select Button */}
          <button
            onClick={handleSelect}
            className={`
              w-full mt-4 py-2 px-4 rounded-lg font-semibold transition-colors
              ${isSelected
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }
            `}
          >
            {isSelected ? 'Selected' : 'Use This Template'}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{template.name}</h3>
                  <p className="text-gray-600">{template.description}</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Template Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Sections Included</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {template.sections.map((section, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-600" />
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
                        style={{ backgroundColor: template.theme.colors.primary }}
                      />
                      <span className="text-sm text-gray-600">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: template.theme.colors.secondary }}
                      />
                      <span className="text-sm text-gray-600">Secondary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: template.theme.colors.accent }}
                      />
                      <span className="text-sm text-gray-600">Accent</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Typography</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Headings: <span className="font-semibold">{template.theme.fonts.heading}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Body: <span className="font-semibold">{template.theme.fonts.body}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowPreview(false);
                    handleSelect();
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
