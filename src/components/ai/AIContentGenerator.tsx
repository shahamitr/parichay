'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, RefreshCw, Wand2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Drawer from '@/components/ui/Drawer';

// Types for content generation
type ContentType = 'headline' | 'tagline' | 'about' | 'service' | 'seo' | 'social' | 'email' | 'cta' | 'hero_title' | 'hero_subtitle' | 'service_description' | 'product_description';
type ToneType = 'professional' | 'friendly' | 'persuasive' | 'casual' | 'witty' | 'luxury' | 'minimalist';
type LengthType = 'short' | 'medium' | 'long';
type ModeType = 'button' | 'panel' | 'modal' | 'drawer';

interface AIContentGeneratorProps {
  // Display mode
  mode?: ModeType;

  // Content configuration
  type: ContentType;
  context?: {
    businessName?: string;
    industry?: string;
    keywords?: string[];
    tone?: ToneType;
    length?: LengthType;
    targetAudience?: string;
    uniqueSellingPoint?: string;
  };

  // Callbacks
  onSelect: (content: string) => void;
  onClose?: () => void;

  // Modal/Drawer control (for controlled mode)
  isOpen?: boolean;

  // Optional additional context
  serviceName?: string;
  platform?: 'facebook' | 'instagram' | 'linkedin' | 'twitter';
  emailPurpose?: string;
  ctaGoal?: string;
  currentContent?: string;

  // UI customization
  buttonText?: string;
  title?: string;
  description?: string;
  showUsage?: boolean;
}

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  headline: 'Headline',
  about: 'About Section',
  service_description: 'Service Description',
  product_description: 'Product Description',
  tagline: 'Tagline',
  cta: 'Call to Action',
  hero_title: 'Hero Title',
  hero_subtitle: 'Hero Subtitle',
  service: 'Service',
  seo: 'SEO Content',
  social: 'Social Media',
  email: 'Email',
};

const TONE_OPTIONS: Array<{ value: ToneType; label: string; description: string }> = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-focused' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'witty', label: 'Witty', description: 'Clever and entertaining' },
  { value: 'persuasive', label: 'Persuasive', description: 'Compelling and action-oriented' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
  { value: 'luxury', label: 'Luxury', description: 'Premium and elegant' },
  { value: 'minimalist', label: 'Minimalist', description: 'Clean and simple' },
];

const LENGTH_OPTIONS: Array<{ value: LengthType; label: string }> = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
];

export default function AIContentGenerator({
  mode = 'button',
  type,
  context = {},
  onSelect,
  onClose,
  isOpen: controlledIsOpen,
  serviceName,
  platform,
  emailPurpose,
  ctaGoal,
  currentContent,
  buttonText = 'Generate with AI',
  title,
  description,
  showUsage = true,
}: AIContentGeneratorProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [usage, setUsage] = useState<{ remaining: number; limit: number } | null>(null);

  // Configuration state for panel mode
  const [tone, setTone] = useState<ToneType>(context.tone || 'professional');
  const [length, setLength] = useState<LengthType>(context.length || 'medium');
  const [keywords, setKeywords] = useState<string>(context.keywords?.join(', ') || '');
  const [businessType, setBusinessType] = useState<string>(context.industry || '');
  const [highlights, setHighlights] = useState<string>('');

  // Handle open state (controlled vs uncontrolled)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (value: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(value);
    }
    if (!value && onClose) {
      onClose();
    }
  };

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          context: {
            ...context,
            tone,
            length,
            keywords: keywords ? keywords.split(',').map(k => k.trim()) : context.keywords,
            industry: businessType || context.industry,
          },
          variations: type === 'about' ? 1 : 5,
          serviceName,
          platform,
          emailPurpose,
          ctaGoal,
          highlights: highlights ? highlights.split(',').map(s => s.trim()) : [],
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

      // Handle different API response formats
      const generatedVariations = data.variations || data.suggestions || [data.content, ...(data.alternatives || [])].filter(Boolean);
      setVariations(generatedVariations);
      setUsage(data.usage);

      if (mode === 'button') {
        setIsOpen(true);
      }

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

  // Configuration panel (shared between panel and modal modes)
  const ConfigPanel = () => (
    <div className="space-y-4">
      {/* Tone Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tone
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {TONE_OPTIONS.slice(0, 5).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTone(option.value)}
              className={`p-2 rounded-lg border-2 transition-all text-left ${
                tone === option.value
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="text-sm font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Length Selector (for longer content types) */}
      {['about', 'service_description', 'product_description', 'service'].includes(type) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Length
          </label>
          <div className="flex space-x-2">
            {LENGTH_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLength(option.value)}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                  length === option.value
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Business Type / Industry */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Business Type / Industry
        </label>
        <input
          type="text"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          placeholder="e.g., Coffee Shop, IT Consulting, Gym"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Keywords (comma-separated)
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., quality, affordable, fast service"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Highlights */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Key Highlights (optional)
        </label>
        <textarea
          rows={2}
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          placeholder="e.g., 24/7 service, organic ingredients, award-winning"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  // Variations display
  const VariationsDisplay = () => (
    <div className="space-y-3">
      {currentContent && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Current Content:</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">{currentContent}</div>
        </div>
      )}

      {variations.length > 0 ? (
        <>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Generated Suggestions (Click to select):
          </div>
          {variations.map((variation, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selectedIndex === index
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => handleSelect(variation, index)}
            >
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="pl-8 pr-12">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{variation}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(variation, index);
                  }}
                  className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
              {selectedIndex === index && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1 text-purple-600 text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Selected
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p>Click "Generate Content" to create AI-powered suggestions</p>
        </div>
      )}
    </div>
  );

  // Generate button
  const GenerateButton = ({ fullWidth = false }: { fullWidth?: boolean }) => (
    <button
      onClick={generateContent}
      disabled={isGenerating}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${fullWidth ? 'w-full py-3' : ''}`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          {buttonText}
        </>
      )}
    </button>
  );

  // MODE: Button with modal
  if (mode === 'button') {
    return (
      <>
        <div>
          <GenerateButton />
          {showUsage && usage && (
            <div className="text-xs text-gray-500 mt-1">
              {usage.remaining} / {usage.limit} AI generations remaining this month
            </div>
          )}
        </div>

        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wand2 className="w-6 h-6" />
                    <div>
                      <h2 className="text-2xl font-bold">{title || 'AI Generated Content'}</h2>
                      <p className="text-purple-100 text-sm mt-1">
                        {description || 'Select the variation you like best'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <VariationsDisplay />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <button
                  onClick={generateContent}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // MODE: Inline panel
  if (mode === 'panel') {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title || `AI Content Generator - ${CONTENT_TYPE_LABELS[type]}`}
          </h3>
        </div>

        <ConfigPanel />

        <div className="mt-6">
          <GenerateButton fullWidth />
        </div>

        <div className="mt-6">
          <VariationsDisplay />
        </div>
      </div>
    );
  }

  // MODE: Modal (controlled externally)
  if (mode === 'modal') {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              {title || `Generate ${CONTENT_TYPE_LABELS[type]}`}
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <ConfigPanel />

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <GenerateButton />
          </div>

          {variations.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <VariationsDisplay />
            </div>
          )}
        </div>
      </div>
    );
  }

  // MODE: Drawer
  if (mode === 'drawer') {
    return (
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title || 'AI Magic Fill'}
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              {description || 'Let our AI assistant generate professional content for your microsite.'}
            </p>
          </div>

          <ConfigPanel />

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <GenerateButton />
          </div>

          {variations.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <VariationsDisplay />
            </div>
          )}
        </div>
      </Drawer>
    );
  }

  return null;
}

// Re-export types for external use
export type { ContentType, ToneType, LengthType, ModeType, AIContentGeneratorProps };
