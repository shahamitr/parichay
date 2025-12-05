'use client';

import { useState } from 'react';
import {
  Command, Palette, Sparkles, Search, TrendingUp,
  Zap, Layout, BarChart3, CheckCircle, ArrowRight
} from 'lucide-react';

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const features = [
    {
      id: 'command-palette',
      name: 'Command Palette',
      description: 'Quick navigation with keyboard shortcuts',
      icon: Command,
      category: 'productivity',
      howTo: 'Press CMD+K (Mac) or CTRL+K (Windows) anywhere',
      color: 'blue',
    },
    {
      id: 'theme-customizer',
      name: 'Theme Customizer',
      description: 'Personalize your dashboard with custom themes',
      icon: Palette,
      category: 'customization',
      howTo: 'Click the palette icon at bottom right',
      color: 'purple',
    },
    {
      id: 'ai-assistant',
      name: 'AI Assistant',
      description: 'Get instant help and guidance',
      icon: Sparkles,
      category: 'productivity',
      howTo: 'Click the sparkle icon at bottom right',
      color: 'pink',
    },
    {
      id: 'advanced-search',
      name: 'Advanced Search',
      description: 'Filter and search with multiple criteria',
      icon: Search,
      category: 'productivity',
      howTo: 'Available on Analytics page',
      color: 'green',
    },
    {
      id: 'data-visualization',
      name: 'Data Visualization',
      description: 'Beautiful animated charts and graphs',
      icon: BarChart3,
      category: 'analytics',
      howTo: 'View on Analytics and Dashboard pages',
      color: 'orange',
    },
    {
      id: 'onboarding-tours',
      name: 'Guided Tours',
      description: 'Interactive walkthroughs for new features',
      icon: Layout,
      category: 'help',
      howTo: 'Auto-starts on first visit to pages',
      color: 'indigo',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Features' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'customization', name: 'Customization' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'help', name: 'Help & Support' },
  ];

  const filteredFeatures = activeCategory === 'all'
    ? features
    : features.filter(f => f.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Features
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Discover powerful features to enhance your productivity
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Keyboard Shortcuts
            </h3>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Navigate faster with CMD+K
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">
              Real-time Analytics
            </h3>
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Track performance instantly
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              Always Improving
            </h3>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            New features added regularly
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.name}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {feature.description}
              </p>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-500 mb-1">
                  How to use:
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {feature.howTo}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-2">
            Ready to explore?
          </h2>
          <p className="text-blue-100 mb-6">
            Start using these features now to boost your productivity and get more insights from your data.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                const event = new KeyboardEvent('keydown', {
                  key: 'k',
                  metaKey: true,
                  ctrlKey: true,
                });
                window.dispatchEvent(event);
              }}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              Try Command Palette
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
