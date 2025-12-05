'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Check, Copy } from 'lucide-react';
import { ContentGenerationRequest } from '@/lib/ai-content-generator';

interface ContentGeneratorProps {
  type: ContentGenerationRequest['type'];
  businessName: string;
  industry?: string;
  currentContent?: string;
  onSelect: (content: string) => void;
  context?: ContentGenerationRequest['context'];
}

const CONTENT_TYPE_LABELS: Record<ContentGenerationRequest['type'], string> = {
  headline: 'Headline',
  about: 'About Section',
  service_description: 'Service Description',
  product_description: 'Product Description',
  tagline: 'Tagline',
  cta: 'Call to Action',
  hero_title: 'Hero Title',
  hero_subtitle: 'Hero Subtitle',
};

const TONE_OPTIONS: Array<{ value: ContentGenerationRequest['tone']; label: string; description: string }> = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-focused' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'witty', label: 'Witty', description: 'Clever and entertaining' },
  { value: 'persuasive', label: 'Persuasive', description: 'Compelling and action-oriented' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
];

const LENGTH_OPTIONS: Array<{ value: ContentGenerationRequest['length']; label: string }> = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
];

export default function ContentGenerator({
  type,
  businessName,
  industry,
  currentContent,
  onSelect,
  context,
}: ContentGeneratorProps) {
  const [tone, setTone] = useState<ContentGenerationRequest['tone']>('professional');
  const [length, setLength] = useState<ContentGenerationRequest['length']>('medium');
  const [keywords, setKeywords] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setSuggestions([]);
    setSelectedIndex(null);

    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          businessName,
          industry,
          keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
          tone,
          length,
          context,
        } as ContentGenerationRequest),
      });

      const data = await response.json();

      if (data.success) {
        const allSuggestions = [data.content, ...data.alternatives].filter(Boolean);
        setSuggestions(allSuggestions);
      } else {
        console.error('Failed to generate content:', data.error);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSelect = (content: string, index: number) => {
    setSelectedIndex(index);
    onSelect(content);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          AI Content Generator - {CONTENT_TYPE_LABELS[type]}
        </h3>
      </div>

      {/* Configuration */}
      <div className="space-y-4 mb-6">
        {/* Tone Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {TONE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setTone(option.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  tone === option.value
                    ? 'border-purple-600 bg-purple-50 text-purple-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                title={option.description}
              >
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Length Selector */}
        {['about', 'service_description', 'product_description'].includes(type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length
            </label>
            <div className="flex space-x-2">
              {LENGTH_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLength(option.value)}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    length === option.value
                      ? 'border-purple-600 bg-purple-50 text-purple-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
            Keywords (optional, comma-separated)
          </label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., quality, affordable, fast service"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Content</span>
            </>
          )}
        </button>
      </div>

      {/* Current Content */}
      {currentContent && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Current Content:</div>
          <div className="text-sm text-gray-600">{currentContent}</div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 mb-3">
            Generated Suggestions (Click to select):
          </div>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedIndex === index
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
              onClick={() => handleSelect(suggestion, index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 text-sm text-gray-700 pr-4">
                  {suggestion}
                </div>
                <div className="flex items-center space-x-2">
                  {selectedIndex === index && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-medium">Selected</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(suggestion, index);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && suggestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Click "Generate Content" to create AI-powered suggestions</p>
        </div>
      )}
    </div>
  );
}
