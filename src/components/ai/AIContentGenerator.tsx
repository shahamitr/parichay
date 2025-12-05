// @ts-nocheck
'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, RefreshCw, Wand2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AIContentGeneratorProps {
  type: 'headline' | 'tagline' | 'about' | 'service' | 'seo' | 'social' | 'email' | 'cta';
  context: {
    businessName: string;
    industry?: string;
    keywords?: string[];
    tone?: 'professional' | 'friendly' | 'persuasive' | 'casual' | 'witty';
    length?: 'short' | 'medium' | 'long';
    targetAudience?: string;
    uniqueSellingPoint?: string;
  };
  onSelect: (content: string) => void;
  serviceName?: string;
  platform?: 'facebook' | 'instagram' | 'linkedin' | 'twitter';
  emailPurpose?: string;
  ctaGoal?: string;
}

export default function AIContentGenerator({
  type,
  context,
  onSelect,
  serviceName,
  platform,
  emailPurpose,
  ctaGoal,
}: AIContentGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [usage, setUsage] = useState<any>(null);

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          context,
          variations: type === 'about' ? 1 : 5,
          serviceName,
          platform,
          emailPurpose,
          ctaGoal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast.error(`AI limit reached: ${data.message}`);
        } else {
          toast.error(data.error || 'Failed to generate content');
        }
        return;
      }

      setVariations(data.variations || []);
      setUsage(data.usage);
      setIsOpen(true);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success('Copied to clipboard!');
  };

  const handleSelect = (content: string, index: number) => {
    setSelectedIndex(index);
    onSelect(content);
    toast.success('Content applied!');
    setTimeout(() => setIsOpen(false), 500);
  };

  return (
    <>
      {/* Generate Button */}
      <button
        onClick={generateContent}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </>
        )}
      </button>

      {/* Usage Info */}
      {usage && (
        <div className="text-xs text-gray-500 mt-1">
          {usage.remaining} / {usage.limit} AI generations remaining this month
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wand2 className="w-6 h-6" />
                  <div>
                    <h2 className="text-2xl font-bold">AI Generated Content</h2>
                    <p className="text-purple-100 text-sm mt-1">
                      Select the variation you like best
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                {variations.map((variation, index) => (
                  <div
                    key={index}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedIndex === index
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelect(variation, index)}
                  >
                    {/* Variation Number */}
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="pl-8 pr-12">
                      <p className="text-gray-800 whitespace-pre-wrap">{variation}</p>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(variation, index);
                        }}
                        className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Selected Indicator */}
                    {selectedIndex === index && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 text-purple-600 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
              <button
                onClick={generateContent}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
