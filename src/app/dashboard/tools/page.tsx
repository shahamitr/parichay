// @ts-nocheck
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToastHelpers } from '@/components/ui/Toast';
import GoogleBusinessImport from '@/components/import/GoogleBusinessImport';
import { AiContentGenerator } from '@/components/microsites/AiContentGenerator';
import { Sparkles, Download, Wand2, FileText } from 'lucide-react';

export default function ToolsPage() {
  const { user } = useAuth();
  const { success, error, info, warning } = useToastHelpers();
  const [activeTab, setActiveTab] = useState<'google-import' | 'ai-content'>('google-import');
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [aiFieldType, setAiFieldType] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);

  // Check if user has access (Admin or Super Admin)
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'BRAND_MANAGER')) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">
          You don't have permission to access this page. Only administrators can use these tools.
        </p>
      </div>
    );
  }

  const handleImportComplete = (data: any) => {
    toast.success('Business imported successfully!');
    console.log('Imported data:', data);
  };

  const handleAiGenerate = (fieldType: string) => {
    setAiFieldType(fieldType);
    setShowAiGenerator(true);
  };

  const handleAiSuggestionSelect = (suggestion: string) => {
    setGeneratedContent([...generatedContent, suggestion]);
    setShowAiGenerator(false);
    toast.success('Content generated successfully!');
  };

  const tabs = [
    {
      id: 'google-import',
      name: 'Google Business Import',
      icon: Download,
      description: 'Import business data from Google Business Profile',
    },
    {
      id: 'ai-content',
      name: 'AI Content Generator',
      icon: Sparkles,
      description: 'Generate content using AI',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Wand2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Tools</h1>
        </div>
        <p className="text-gray-600">
          Powerful tools to help you manage and create content efficiently
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Google Business Import Tab */}
          {activeTab === 'google-import' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Import from Google Business Profile
                </h2>
                <p className="text-gray-600">
                  Quickly create a brand page by importing data from Google Business Profile.
                  This feature automatically extracts business information, photos, hours, and more.
                </p>
              </div>

              <GoogleBusinessImport
                onImportComplete={handleImportComplete}
                executiveId={user.id}
              />

              {/* Feature Highlights */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">⚡ Fast Setup</h3>
                  <p className="text-sm text-blue-800">
                    Create a complete brand page in seconds by importing existing Google Business data
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">📸 Auto Import</h3>
                  <p className="text-sm text-green-800">
                    Automatically imports photos, business hours, contact info, and more
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">👁️ Preview First</h3>
                  <p className="text-sm text-purple-800">
                    Preview the microsite before creating to ensure everything looks perfect
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Content Generator Tab */}
          {activeTab === 'ai-content' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  AI Content Generator
                </h2>
                <p className="text-gray-600">
                  Generate professional content for your microsites using AI. Perfect for headlines,
                  descriptions, about sections, and more.
                </p>
              </div>

              {/* Content Type Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  { type: 'Headline', desc: 'Catchy headlines for your business', icon: '📢' },
                  { type: 'About Section', desc: 'Professional about us content', icon: '📝' },
                  { type: 'Service Description', desc: 'Compelling service descriptions', icon: '⚙️' },
                  { type: 'Product Description', desc: 'Engaging product descriptions', icon: '🛍️' },
                  { type: 'Tagline', desc: 'Memorable business taglines', icon: '✨' },
                  { type: 'Call to Action', desc: 'Persuasive CTAs', icon: '🎯' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleAiGenerate(item.type)}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all text-left"
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.type}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Generated Content History */}
              {generatedContent.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Recently Generated Content
                  </h3>
                  <div className="space-y-3">
                    {generatedContent.map((content, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <p className="text-gray-800">{content}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(content);
                            toast.success('Copied to clipboard!');
                          }}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          Copy to clipboard
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature Info */}
              <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-900 mb-3">✨ AI-Powered Content</h3>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Generate multiple variations instantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Choose from different tones: Professional, Friendly, Witty, Persuasive, Casual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Customize with your own keywords and business details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Perfect for creating consistent, professional content across all microsites</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Generator Modal */}
      {showAiGenerator && (
        <AiContentGenerator
          fieldType={aiFieldType}
          onSelectSuggestion={handleAiSuggestionSelect}
          onClose={() => setShowAiGenerator(false)}
        />
      )}
    </div>
  );
}
