'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Zap,
  Shield,
  Smartphone,
  Mic,
  Eye,
  BarChart3,
  Users,
  Crown,
  Leaf,
  Brain,
  Rocket
} from 'lucide-react';
import {
  allNextLevelTemplates,
  nextLevelCategories,
  keyDifferentiators,
  getTemplatesByPhase,
  getTrendingTemplates
} from '@/data/next-level-templates';
import { MicrositeTemplate } from '@/types/template';

interface NextLevelTemplateShowcaseProps {
  onTemplateSelect?: (template: MicrositeTemplate) => void;
  showPhaseFilter?: boolean;
  showCategoryFilter?: boolean;
}

const phaseInfo = {
  1: { name: 'Immediate Impact', color: 'bg-red-500', description: 'High-demand templates for immediate market needs' },
  2: { name: 'Growth Markets', color: 'bg-orange-500', description: 'Emerging industries with strong growth potential' },
  3: { name: 'Future-Ready', color: 'bg-blue-500', description: 'Premium templates for forward-thinking businesses' },
  4: { name: 'Competitive Edge', color: 'bg-purple-500', description: 'Cutting-edge templates for market differentiation' }
};

const differentiatorIcons = {
  aiFeatures: <Brain className="w-5 h-5" />,
  sustainabilityFeatures: <Leaf className="w-5 h-5" />,
  mobileOptimization: <Smartphone className="w-5 h-5" />,
  voiceFeatures: <Mic className="w-5 h-5" />,
  accessibilityFeatures: <Eye className="w-5 h-5" />,
  realTimeFeatures: <Zap className="w-5 h-5" />,
  analyticsFeatures: <BarChart3 className="w-5 h-5" />,
  socialProofFeatures: <Users className="w-5 h-5" />
};

export default function NextLevelTemplateShowcase({
  onTemplateSelect,
  showPhaseFilter = true,
  showCategoryFilter = true
}: NextLevelTemplateShowcaseProps) {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDifferentiators, setShowDifferentiators] = useState(false);
  const [filteredTemplates, setFilteredTemplates] = useState<MicrositeTemplate[]>(allNextLevelTemplates);

  useEffect(() => {
    let templates = allNextLevelTemplates;

    if (selectedPhase) {
      templates = getTemplatesByPhase(selectedPhase as 1 | 2 | 3 | 4);
    }

    if (selectedCategory) {
      templates = templates.filter(t => t.category === selectedCategory);
    }

    setFilteredTemplates(templates);
  }, [selectedPhase, selectedCategory]);

  const trendingTemplates = getTrendingTemplates();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Next-Level Templates
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Revolutionary business templates designed to give you a competitive edge in the digital marketplace
        </p>
      </div>

      {/* Key Differentiators Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">🚀 Key Differentiators</h3>
          <button
            onClick={() => setShowDifferentiators(!showDifferentiators)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {showDifferentiators ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(differentiatorIcons).map(([key, icon]) => (
            <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
              {icon}
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').replace('Features', '')}</span>
            </div>
          ))}
        </div>

        {showDifferentiators && (
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {Object.entries(keyDifferentiators).map(([category, features]) => (
              <div key={category} className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  {differentiatorIcons[category as keyof typeof differentiatorIcons]}
                  {category.replace(/([A-Z])/g, ' $1').replace('Features', '')}
                </h4>
                <div className="space-y-2">
                  {Object.values(features).map((feature: any, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="font-medium text-gray-800">{feature.name}</div>
                      <div className="text-gray-600">{feature.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trending Templates */}
      {trendingTemplates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-900">Trending Templates</h3>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Hot</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {trendingTemplates.slice(0, 3).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={onTemplateSelect}
                trending={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {showPhaseFilter && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Filter by Phase:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPhase(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedPhase === null
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Phases
              </button>
              {Object.entries(phaseInfo).map(([phase, info]) => (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(parseInt(phase))}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedPhase === parseInt(phase)
                      ? `${info.color} text-white`
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Phase {phase}: {info.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {showCategoryFilter && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Categories
              </button>
              {nextLevelCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                  {category.trending && <TrendingUp className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={onTemplateSelect}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Sparkles className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more templates.</p>
        </div>
      )}
    </div>
  );
}

interface TemplateCardProps {
  template: MicrositeTemplate;
  onSelect?: (template: MicrositeTemplate) => void;
  trending?: boolean;
}

function TemplateCard({ template, onSelect, trending = false }: TemplateCardProps) {
  const categoryInfo = nextLevelCategories.find(cat => cat.id === template.category);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Template Preview */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={template.thumbnailImage}
          alt={template.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/templates/placeholder-template.jpg';
          }}
        />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {template.isPremium && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Premium
            </span>
          )}
          {trending && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>

        {/* Category badge */}
        {categoryInfo && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <span>{categoryInfo.icon}</span>
              {categoryInfo.name}
            </span>
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {template.description}
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {template.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
          {template.features.length > 3 && (
            <span className="text-xs text-gray-500">
              +{template.features.length - 3} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelect?.(template)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Use Template
        </button>
      </div>
    </div>
  );
}