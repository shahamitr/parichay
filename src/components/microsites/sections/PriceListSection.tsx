'use client';

import { useState } from 'react';
import { DollarSign, Check, Star, TrendingUp, Tag } from 'lucide-react';
import { Brand, Branch } from '@/generated/prisma';

interface PriceItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category?: string;
  popular?: boolean;
  features?: string[];
  unit?: string; // e.g., "per hour", "per kg", "per session"
}

interface PriceListConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  items: PriceItem[];
  categories?: string[];
  layout?: 'list' | 'grid' | 'table';
  showDiscount?: boolean;
  currency?: string;
}

interface PriceListSectionProps {
  config: PriceListConfig;
  brand: Brand;
  branch: Branch;
}

export default function PriceListSection({ config, brand, branch }: PriceListSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!config.enabled || !config.items || config.items.length === 0) {
    return null;
  }

  const categories = ['all', ...(config.categories || [])];
  const filteredItems = selectedCategory === 'all'
    ? config.items
    : config.items.filter(item => item.category === selectedCategory);

  const currency = config.currency || '₹';

  const formatPrice = (price: number) => {
    return `${currency}${price.toLocaleString('en-IN')}`;
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
            <Tag className="w-5 h-5" />
            <span className="font-semibold">Pricing</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {config.title || 'Our Price List'}
          </h2>
          {config.subtitle && (
            <p className="text-gray-600 max-w-2xl mx-auto">{config.subtitle}</p>
          )}
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
<button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-primary'
                }`}
              >
                {category === 'all' ? 'All Services' : category}
              </button>
            ))}
          </div>
        )}

        {/* List Layout */}
        {config.layout === 'list' && (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-6 shadow-sm border transition-all hover:shadow-md ${
                  item.popular ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      {item.popular && (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          <Star className="w-3 h-3 fill-current" />
                          Popular
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    )}
                    {item.features && item.features.length > 0 && (
                      <ul className="space-y-1">
                        {item.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    {item.originalPrice && config.showDiscount && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400 line-through text-sm">
                          {formatPrice(item.originalPrice)}
                        </span>
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                          {calculateDiscount(item.originalPrice, item.price)}% OFF
                        </span>
                      </div>
                    )}
                    <div className="text-2xl font-bold text-brand-primary">
                      {formatPrice(item.price)}
                    </div>
                    {item.unit && (
                      <div className="text-xs text-gray-500 mt-1">{item.unit}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid Layout */}
        {config.layout === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-6 shadow-sm border transition-all hover:shadow-lg hover:-translate-y-1 ${
                  item.popular ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-100'
                }`}
              >
                {item.popular && (
                  <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  )}
                </div>
                <div className="text-center mb-4">
                  {item.originalPrice && config.showDiscount && (
                    <div className="text-gray-400 line-through text-sm mb-1">
                      {formatPrice(item.originalPrice)}
                    </div>
                  )}
                  <div className="text-3xl font-bold text-brand-primary">
                    {formatPrice(item.price)}
                  </div>
                  {item.unit && (
                    <div className="text-sm text-gray-500 mt-1">{item.unit}</div>
                  )}
                </div>
                {item.features && item.features.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Table Layout */}
        {config.layout === 'table' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Service
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          {item.popular && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        {item.unit && (
                          <span className="text-xs text-gray-500">{item.unit}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div>
                          {item.originalPrice && config.showDiscount && (
                            <div className="text-gray-400 line-through text-xs mb-1">
                              {formatPrice(item.originalPrice)}
                            </div>
                          )}
                          <div className="text-lg font-bold text-brand-primary">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            Have questions about our pricing? Contact us for a custom quote.
          </p>
          <a
            href={`tel:${(branch.contact as any)?.phone}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <DollarSign className="w-5 h-5" />
            Get Custom Quote
          </a>
        </div>
      </div>
    </section>
  );
}
