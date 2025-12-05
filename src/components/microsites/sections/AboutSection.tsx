'use client';

import { Brand, Branch } from '@/generated/prisma';
import { AboutSection as AboutConfig } from '@/types/microsite';
import { Sparkles, Target, Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AboutSectionProps {
  config: AboutConfig;
  brand: Brand;
  branch: Branch;
}

export default function AboutSection({ config, brand, branch }: AboutSectionProps) {
  const hasContent = config?.content && config.content.trim().length > 0;

  return (
    <section className="relative bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header - Clean Design 2 style */}
        <div className="text-center mb-12">
          <h2 id="about-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            About {branch.name}
          </h2>
          <div className="w-16 h-1 bg-brand-primary mx-auto rounded-full"></div>
        </div>

        {hasContent ? (
          <div>
            {/* Content - Clean typography */}
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {config.content}
              </ReactMarkdown>
            </div>

            {/* Brand Tagline - Minimal */}
            {brand.tagline && (
              <div className="mt-10 pt-10 border-t border-gray-200">
                <blockquote className="text-xl sm:text-2xl font-medium text-gray-800 text-center italic">
                  "{brand.tagline}"
                </blockquote>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">
              About section content will be available soon
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
