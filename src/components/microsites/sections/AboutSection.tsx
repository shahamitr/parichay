'use client';

import { Brand, Branch } from '@/generated/prisma';
import { AboutSection as AboutConfig } from '@/types/microsite';
import { Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ============================================================================
// UNIFIED ABOUT SECTION - Supports both view and edit modes
// ============================================================================

interface AboutSectionProps {
  mode?: 'view' | 'edit';
  config: AboutConfig;
  // View mode props
  brand?: Brand;
  branch?: Branch;
  // Edit mode props
  onChange?: (data: AboutConfig) => void;
}

export default function AboutSection({
  mode = 'view',
  config,
  brand,
  branch,
  onChange,
}: AboutSectionProps) {
  if (mode === 'edit') {
    return <AboutEditor config={config} onChange={onChange!} />;
  }
  return <AboutView config={config} brand={brand!} branch={branch!} />;
}

// ============================================================================
// VIEW COMPONENT
// ============================================================================
function AboutView({
  config,
  brand,
  branch,
}: {
  config: AboutConfig;
  brand: Brand;
  branch: Branch;
}) {
  const hasContent = config?.content && config.content.trim().length > 0;

  return (
    <section className="relative bg-white dark:bg-neutral-950 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            About {branch.name}
          </h2>
          <div className="w-16 h-1 bg-brand-primary mx-auto rounded-full" />
        </div>

        {hasContent ? (
          <div>
            {/* Content */}
            <div className="prose prose-lg max-w-none prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100 prose-p:text-neutral-700 dark:prose-p:text-neutral-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {config.content}
              </ReactMarkdown>
            </div>

            {/* Brand Tagline */}
            {brand.tagline && (
              <div className="mt-10 pt-10 border-t border-neutral-200 dark:border-neutral-800">
                <blockquote className="text-xl sm:text-2xl font-medium text-neutral-800 dark:text-neutral-200 text-center italic">
                  "{brand.tagline}"
                </blockquote>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              About section content will be available soon
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// EDIT COMPONENT
// ============================================================================
function AboutEditor({
  config,
  onChange,
}: {
  config: AboutConfig;
  onChange: (data: AboutConfig) => void;
}) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Tell your story and connect with your audience
        </p>
      </div>

      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable About Section</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Show or hide this section</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
        </label>
      </div>

      {config.enabled && (
        <>
          {/* Content Editor */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              About Content *
            </label>
            <textarea
              value={config.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Tell your story... Who you are, what you do, why you're different..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {config.content?.length || 0} characters • Supports Markdown formatting
            </p>
          </div>

          {/* Formatting Guide */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Formatting Guide</h4>
            <div className="text-xs text-gray-600 dark:text-gray-400 grid grid-cols-2 gap-2">
              <p><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">**Bold**</code> → <strong>Bold</strong></p>
              <p><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">*Italic*</code> → <em>Italic</em></p>
              <p><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">- Item</code> → • Item</p>
              <p><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">1. Item</code> → 1. Item</p>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preview</label>
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[150px]">
              {config.content ? (
                <div className="prose dark:prose-invert max-w-none prose-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {config.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic">
                  Your about content will appear here...
                </p>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Start with your mission or unique value proposition</li>
              <li>Keep it concise - aim for 150-300 words</li>
              <li>Highlight what makes you different</li>
              <li>Include your experience and credentials</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export type { AboutSectionProps };
