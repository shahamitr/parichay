// @ts-nocheck
'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import AIContentGenerator from './AIContentGenerator';
import { ContentType } from '@/lib/ai-content-generator';

interface ContentField {
  type: ContentType;
  label: string;
  description: string;
  icon: string;
  currentValue?: string;
  onUpdate: (value: string) => void;
  context?: any;
}

interface AIContentGeneratorPanelProps {
  businessName: string;
  industry?: string;
  fields: ContentField[];
  title?: string;
  description?: string;
}

export default function AIContentGeneratorPanel({
  businessName,
  industry,
  fields,
  title = 'AI Content Generator',
  description = 'Generate professional content for your microsite using AI',
}: AIContentGeneratorPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (type: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedSections(newExpanded);
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, JSX.Element> = {
      headline: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      about: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      service: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      product: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      tagline: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
      cta: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
    };
    return icons[iconName] || icons.headline;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>

      {/* Content Fields */}
      <div className="divide-y divide-gray-200">
        {fields.map((field) => {
          const isExpanded = expandedSections.has(field.type);

          return (
            <div key={field.type} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-purple-600">
                      {getIcon(field.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {field.label}
                      </h4>
                      <p className="text-xs text-gray-500">{field.description}</p>
                    </div>
                  </div>

                  {/* Current Value */}
                  {field.currentValue && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleSection(field.type)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        <span>Current content</span>
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                          <p className="text-sm text-gray-900">{field.currentValue}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* AI Generator Button */}
                <div className="flex-shrink-0">
                  <AIContentGenerator
                    type={field.type}
                    businessName={businessName}
                    industry={industry}
                    currentContent={field.currentValue}
                    onContentSelect={field.onUpdate}
                    context={field.context}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">How it works:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Click "AI Generate" to create professional content</li>
              <li>Review multiple variations and select your favorite</li>
              <li>Edit and customize the generated content as needed</li>
              <li>Content is tailored to your business and industry</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
