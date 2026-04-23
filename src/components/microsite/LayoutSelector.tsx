'use client';

import { useState } from 'react';
import { layoutOptions, LayoutOption, getLayoutsByCategory, getLayoutClasses } from '@/data/layout-options';
import { Check, Eye, X, Grid3X3, Palette, Sparkles, Zap, Crown } from 'lucide-react';

interface LayoutSelectorProps {
  selectedLayout: string;
  onLayoutChange: (layoutId: string) => void;
}

const categoryInfo = {
  business: {
    name: 'Business',
    description: 'Professional layouts for corporate sites',
    icon: Grid3X3,
    color: 'blue'
  },
  creative: {
    name: 'Creative',
    description: 'Bold designs for creative professionals',
    icon: Sparkles,
    color: 'purple'
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean, content-focused designs',
    icon: Palette,
    color: 'gray'
  },
  bold: {
    name: 'Bold',
    description: 'High-impact, attention-grabbing layouts',
    icon: Zap,
    color: 'orange'
  },
  elegant: {
    name: 'Elegant',
    description: 'Sophisticated designs for luxury brands',
    icon: Crown,
    color: 'amber'
  }
};

const categoryColors: Record<string, { bg: string; border: string; text: string; light: string }> = {
  business: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-500', light: 'bg-blue-50 dark:bg-blue-900/20' },
  creative: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-500', light: 'bg-purple-50 dark:bg-purple-900/20' },
  minimal: { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-500', light: 'bg-gray-50 dark:bg-gray-900/20' },
  bold: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', light: 'bg-orange-50 dark:bg-orange-900/20' },
  elegant: { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-500', light: 'bg-amber-50 dark:bg-amber-900/20' }
};

export default function LayoutSelector({ selectedLayout, onLayoutChange }: LayoutSelectorProps) {
  const [previewLayout, setPreviewLayout] = useState<LayoutOption | null>(null);
  const [activeCategory, setActiveCategory] = useState<keyof typeof categoryInfo | 'all'>('all');

  const categories = ['all', 'business', 'creative', 'minimal', 'bold', 'elegant'] as const;

  const filteredLayouts = activeCategory === 'all'
    ? layoutOptions
    : getLayoutsByCategory(activeCategory);

  const selectedLayoutData = layoutOptions.find(l => l.id === selectedLayout);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Choose Layout
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select a layout structure that defines how sections appear
          </p>
        </div>
        {selectedLayoutData && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              {selectedLayoutData.name}
            </span>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const info = cat === 'all' ? null : categoryInfo[cat];
          const Icon = info?.icon;
          const colors = cat === 'all' ? null : categoryColors[cat];

          return (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? cat === 'all'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : `${colors?.bg} text-white`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span className="capitalize">{cat === 'all' ? 'All Layouts' : info?.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                activeCategory === cat
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {cat === 'all' ? layoutOptions.length : getLayoutsByCategory(cat).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Description */}
      {activeCategory !== 'all' && (
        <div className={`p-4 rounded-xl ${categoryColors[activeCategory].light} border ${categoryColors[activeCategory].border}`}>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {categoryInfo[activeCategory].description}
          </p>
        </div>
      )}

      {/* Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLayouts.map((layout) => {
          const isSelected = selectedLayout === layout.id;
          const colors = categoryColors[layout.category];

          return (
            <div
              key={layout.id}
              className={`group relative border-2 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? `${colors.border} ${colors.light}`
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => onLayoutChange(layout.id)}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className={`absolute top-3 right-3 z-10 w-6 h-6 ${colors.bg} rounded-full flex items-center justify-center shadow-lg`}>
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Category Badge */}
              <div className={`absolute top-3 left-3 z-10 px-2 py-0.5 ${colors.bg} rounded-full`}>
                <span className="text-xs font-medium text-white capitalize">{layout.category}</span>
              </div>

              {/* Preview Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
                <LayoutPreviewMini layout={layout} />

                {/* Hover Preview Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewLayout(layout);
                  }}
                  className="absolute bottom-2 right-2 p-2 bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
                >
                  <Eye className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Layout Info */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {layout.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {layout.description}
                </p>

                {/* Layout Features */}
                <div className="flex flex-wrap gap-1">
                  <LayoutFeatureBadge label={layout.sections.hero} type="hero" />
                  <LayoutFeatureBadge label={layout.sections.services} type="services" />
                  <LayoutFeatureBadge label={layout.animations} type="animations" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Preview Modal */}
      {previewLayout && (
        <LayoutPreviewModal layout={previewLayout} onClose={() => setPreviewLayout(null)} />
      )}
    </div>
  );
}

// Mini preview component showing layout structure
function LayoutPreviewMini({ layout }: { layout: LayoutOption }) {
  const classes = getLayoutClasses(layout);

  return (
    <div className="w-full h-full p-3 flex flex-col gap-2">
      {/* Hero Preview */}
      <div className={`flex-shrink-0 ${layout.sections.hero === 'full-width' ? 'h-16' : layout.sections.hero === 'split' ? 'h-12 flex gap-1' : 'h-10 mx-auto w-3/4'} bg-gradient-to-r from-blue-400 to-blue-600 ${classes.card}`}>
        {layout.sections.hero === 'split' && (
          <>
            <div className="flex-1 bg-blue-500 rounded-l-lg" />
            <div className="flex-1 bg-blue-300 rounded-r-lg" />
          </>
        )}
      </div>

      {/* Services Preview */}
      <div className="flex-1 flex gap-1">
        {layout.sections.services === 'grid' ? (
          <div className="flex-1 grid grid-cols-2 gap-1">
            <div className="bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
        ) : layout.sections.services === 'carousel' ? (
          <div className="flex-1 flex gap-1 overflow-hidden">
            <div className="w-1/3 bg-gray-300 dark:bg-gray-600 rounded flex-shrink-0" />
            <div className="w-1/3 bg-gray-300 dark:bg-gray-600 rounded flex-shrink-0" />
            <div className="w-1/3 bg-gray-300 dark:bg-gray-600 rounded flex-shrink-0" />
          </div>
        ) : layout.sections.services === 'list' ? (
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
        ) : layout.sections.services === 'masonry' ? (
          <div className="flex-1 grid grid-cols-2 gap-1">
            <div className="bg-gray-300 dark:bg-gray-600 rounded row-span-2" />
            <div className="bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-3 gap-1">
            <div className="bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
        )}
      </div>

      {/* Contact Preview */}
      <div className={`h-6 ${layout.sections.contact === 'split' ? 'flex gap-1' : ''} bg-gray-400 dark:bg-gray-500 ${classes.card}`}>
        {layout.sections.contact === 'split' && (
          <>
            <div className="flex-1" />
            <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-r" />
          </>
        )}
      </div>
    </div>
  );
}

// Feature badge component
function LayoutFeatureBadge({ label, type }: { label: string; type: string }) {
  const colors: Record<string, string> = {
    hero: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    services: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    animations: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  );
}

// Full preview modal
function LayoutPreviewModal({ layout, onClose }: { layout: LayoutOption; onClose: () => void }) {
  const colors = categoryColors[layout.category];
  const classes = getLayoutClasses(layout);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 ${colors.bg} rounded-full text-xs font-medium text-white capitalize`}>
                {layout.category}
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {layout.name}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {layout.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Layout Preview */}
        <div className="p-6">
          <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 overflow-hidden">
            <LayoutPreviewFull layout={layout} />
          </div>
        </div>

        {/* Layout Details */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-4">
          <DetailItem label="Hero Style" value={layout.sections.hero} />
          <DetailItem label="About Style" value={layout.sections.about} />
          <DetailItem label="Services Style" value={layout.sections.services} />
          <DetailItem label="Gallery Style" value={layout.sections.gallery} />
          <DetailItem label="Contact Style" value={layout.sections.contact} />
          <DetailItem label="Testimonials" value={layout.sections.testimonials} />
          <DetailItem label="Typography" value={layout.typography} />
          <DetailItem label="Corners" value={layout.corners} />
          <DetailItem label="Animations" value={layout.animations} />
          <DetailItem label="Spacing" value={layout.spacing} />
          <DetailItem label="Container" value={layout.containerWidth} />
          <DetailItem label="Color Scheme" value={layout.colorScheme} />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{value.replace(/-/g, ' ')}</p>
    </div>
  );
}

// Full preview with more detail
function LayoutPreviewFull({ layout }: { layout: LayoutOption }) {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Hero Section */}
      <div className={`flex-shrink-0 ${
        layout.sections.hero === 'full-width' ? 'h-32' :
        layout.sections.hero === 'split' ? 'h-24 flex gap-2' :
        layout.sections.hero === 'video-bg' ? 'h-32 relative' :
        layout.sections.hero === 'parallax' ? 'h-28' :
        layout.sections.hero === 'gradient-wave' ? 'h-28' :
        'h-20 mx-auto w-4/5'
      } bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl overflow-hidden`}>
        {layout.sections.hero === 'split' && (
          <>
            <div className="flex-1 flex flex-col justify-center p-4">
              <div className="h-4 w-3/4 bg-white/30 rounded mb-2" />
              <div className="h-3 w-1/2 bg-white/20 rounded" />
            </div>
            <div className="flex-1 bg-gradient-to-br from-purple-400 to-pink-500" />
          </>
        )}
        {layout.sections.hero === 'video-bg' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
            </div>
          </div>
        )}
        {layout.sections.hero === 'centered' && (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="h-4 w-1/2 bg-white/30 rounded mb-2" />
            <div className="h-3 w-1/3 bg-white/20 rounded" />
          </div>
        )}
      </div>

      {/* Services Section */}
      <div className="flex-1 overflow-hidden">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
          Services ({layout.sections.services})
        </div>
        <div className={`h-full ${
          layout.sections.services === 'grid' ? 'grid grid-cols-3 gap-2' :
          layout.sections.services === 'carousel' ? 'flex gap-2 overflow-x-auto' :
          layout.sections.services === 'list' ? 'flex flex-col gap-2' :
          layout.sections.services === 'masonry' ? 'grid grid-cols-3 gap-2' :
          layout.sections.services === 'tabs' ? 'flex flex-col' :
          layout.sections.services === 'flip-cards' ? 'grid grid-cols-3 gap-2' :
          'grid grid-cols-2 gap-2'
        }`}>
          {layout.sections.services === 'tabs' ? (
            <>
              <div className="flex gap-1 mb-2">
                <div className="px-3 py-1 bg-blue-500 text-white text-xs rounded">Tab 1</div>
                <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded">Tab 2</div>
                <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded">Tab 3</div>
              </div>
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-2">
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                <div className="h-2 w-1/2 bg-gray-100 dark:bg-gray-600 rounded" />
              </div>
            </>
          ) : (
            [1, 2, 3].map((i) => (
              <div key={i} className={`bg-white dark:bg-gray-800 rounded-lg p-2 ${
                layout.sections.services === 'carousel' ? 'flex-shrink-0 w-1/3' :
                layout.sections.services === 'list' ? 'flex items-center gap-2' :
                ''
              }`}>
                {layout.sections.services === 'list' ? (
                  <>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                      <div className="h-2 w-1/2 bg-gray-100 dark:bg-gray-600 rounded" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                    <div className="h-2 w-1/2 bg-gray-100 dark:bg-gray-600 rounded" />
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className={`h-16 ${
        layout.sections.contact === 'split' ? 'flex gap-2' :
        layout.sections.contact === 'floating' ? 'relative' :
        layout.sections.contact === 'sidebar' ? 'flex gap-2' :
        ''
      } bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden`}>
        {layout.sections.contact === 'split' && (
          <>
            <div className="flex-1 flex items-center justify-center">
              <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
            <div className="flex-1 bg-gray-300 dark:bg-gray-600" />
          </>
        )}
        {layout.sections.contact === 'floating' && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 w-2/3">
            <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        )}
      </div>
    </div>
  );
}
