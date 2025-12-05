// @ts-nocheck
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { Brand, Branch } from '@/generated/prisma';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  categories?: string[];
  showSearch?: boolean;
}

interface FAQSectionProps {
  config: FAQConfig;
  brand: Brand;
  branch: Branch;
}

export default function FAQSection({ config, brand, branch }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!config.enabled || !config.items || config.items.length === 0) {
    return null;
  }

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const categories = ['all', ...(config.categories || [])];

  const filteredItems = config.items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCaseincludes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Generate FAQ Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
              <HelpCircle className="w-5 h-5" />
              <span className="font-semibold">FAQ</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {config.title || 'Frequently Asked Questions'}
            </h2>
            {config.subtitle && (
              <p className="text-gray-600 max-w-2xl mx-auto">{config.subtitle}</p>
            )}
          </div>

          {/* Search */}
          {config.showSearch && (
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Questions' : category}
                </button>
              ))}
            </div>
          )}

          {/* FAQ Items */}
          <div className="space-y-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isOpen = openItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900 pr-4">
                        {item.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No questions found matching your search.</p>
              </div>
            )}
          </div>

          {/* Still Have Questions CTA */}
          <div className="mt-10 text-center p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <a
              href={`tel:${(branch.contact as any)?.phone}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
