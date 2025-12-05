// @ts-nocheck
'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import AIContentGenerator from './AIContentGenerator';

interface AIContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessInfo: {
    name: string;
    industry?: string;
    businessType?: string;
    location?: string;
  };
  contentType: 'headline' | 'about' | 'tagline' | 'service' | 'product' | 'cta';
  currentContent?: string;
  onSave: (content: string) => void;
  serviceNames?: string[];
  productNames?: string[];
}

export default function AIContentModal({
  isOpen,
  onClose,
  businessInfo,
  contentType,
  currentContent,
  onSave,
  serviceNames,
  productNames,
}: AIContentModalProps) {
  const [selectedContent, setSelectedContent] = useState<string>(currentContent || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const contentLabels = {
    headline: 'Headline',
    about: 'About Section',
    tagline: 'Tagline',
    service: 'Service Description',
    product: 'Product Description',
    cta: 'Call to Action',
  };

  const handleSelect = (content: string) => {
    setSelectedContent(content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedContent.trim()) {
      onSave(selectedContent);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedContent(currentContent || '');
    setIsEditing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  AI Content Generator
                </h2>
                <p className="text-sm text-gray-600">
                  Generate {contentLabels[contentType].toLowerCase()} for {businessInfo.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Generator */}
              <div>
                <AIContentGenerator
                  businessInfo={businessInfo}
                  contentType={contentType}
                  onSelect={handleSelect}
                  currentContent={currentContent}
                  serviceNames={serviceNames}
                  productNames={productNames}
                />
              </div>

              {/* Editor */}
              <div>
                <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Edit & Preview
                  </h3>

                  {selectedContent ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {contentLabels[contentType]}
                        </label>
                        {contentType === 'about' ? (
                          <textarea
                            value={selectedContent}
                            onChange={(e) => setSelectedContent(e.target.value)}
                            rows={12}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder={`Enter your ${contentLabels[contentType].toLowerCase()}...`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={selectedContent}
                            onChange={(e) => setSelectedContent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder={`Enter your ${contentLabels[contentType].toLowerCase()}...`}
                          />
                        )}
                      </div>

                      {/* Character Count */}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Characters: {selectedContent.length}</span>
                        {contentType === 'headline' && selectedContent.length > 60 && (
                          <span className="text-orange-600">
                            Consider shortening for better impact
                          </span>
                        )}
                        {contentType === 'tagline' && selectedContent.length > 50 && (
                          <span className="text-orange-600">
                            Taglines work best when concise
                          </span>
                        )}
                      </div>

                      {/* Preview */}
                      <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                        <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                        {contentType === 'headline' && (
                          <h1 className="text-2xl font-bold text-gray-900">
                            {selectedContent}
                          </h1>
                        )}
                        {contentType === 'tagline' && (
                          <p className="text-lg italic text-gray-700">
                            {selectedContent}
                          </p>
                        )}
                        {contentType === 'about' && (
                          <p className="text-gray-700 leading-relaxed">
                            {selectedContent}
                          </p>
                        )}
                        {(contentType === 'service' || contentType === 'product') && (
                          <p className="text-gray-700">
                            {selectedContent}
                          </p>
                        )}
                        {contentType === 'cta' && (
                          <button className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium">
                            {selectedContent}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-center">
                      <div>
                        <p className="text-gray-500 mb-2">
                          Select a suggestion from the left
                        </p>
                        <p className="text-sm text-gray-400">
                          or type your own content below
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Tip:</span> You can edit the generated content before saving
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedContent.trim()}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Content
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
