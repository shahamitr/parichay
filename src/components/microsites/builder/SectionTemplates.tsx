// @ts-nocheck
'use client';

import { useState } from 'react';
import { Layout, Check, ChevronRight, Sparkles } from 'lucide-react';
import { SectionId } from '@/types/microsite';

interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  preview: string; // CSS class or image
  config: any;
}

interface SectionTemplatesProps {
  sectionId: SectionId;
  currentConfig: any;
  onSelectTemplate: (config: any) => void;
  onClose: () => void;
}

// Templates for each section type
const sectionTemplates: Record<SectionId, SectionTemplate[]> = {
  hero: [
    {
      id: 'hero-centered',
      name: 'Centered',
      description: 'Logo and text centered with CTA button',
      preview: 'centered',
      config: { layout: 'centered', showLogo: true, showCTA: true, overlay: 'dark' },
    },
    {
      id: 'hero-split',
      name: 'Split Layout',
      description: 'Image on one side, content on other',
      preview: 'split',
      config: { layout: 'split', showLogo: true, showCTA: true, imagePosition: 'right' },
    },
    {
      id: 'hero-fullscreen',
      name: 'Fullscreen',
      description: 'Full viewport height with background',
      preview: 'fullscreen',
      config: { layout: 'fullscreen', showLogo: true, showCTA: true, overlay: 'gradient' },
    },
    {
      id: 'hero-minimal',
      name: 'Minimal',
      description: 'Clean and simple with just text',
      preview: 'minimal',
      config: { layout: 'minimal', showLogo: false, showCTA: true, overlay: 'none' },
    },
    {
      id: 'hero-video',
      name: 'Video Background',
      description: 'Looping video in background',
      preview: 'video',
      config: { layout: 'video', showLogo: true, showCTA: true, videoUrl: '' },
    },
  ],
  services: [
    {
      id: 'services-grid',
      name: 'Grid Layout',
      description: '3-column grid with icons',
      preview: 'grid',
      config: { layout: 'grid', columns: 3, showIcons: true, showPrices: true },
    },
    {
      id: 'services-list',
      name: 'List Layout',
      description: 'Vertical list with descriptions',
      preview: 'list',
      config: { layout: 'list', showIcons: true, showPrices: true },
    },
    {
      id: 'services-cards',
      name: 'Card Layout',
      description: 'Large cards with images',
      preview: 'cards',
      config: { layout: 'cards', columns: 2, showImages: true, showPrices: true },
    },
    {
      id: 'services-tabs',
      name: 'Tabbed Categories',
      description: 'Services grouped by category tabs',
      preview: 'tabs',
      config: { layout: 'tabs', showIcons: true, showPrices: true },
    },
  ],
  gallery: [
    {
      id: 'gallery-grid',
      name: 'Grid',
      description: 'Equal-sized image grid',
      preview: 'grid',
      config: { layout: 'grid', columns: 3, gap: 'medium' },
    },
    {
      id: 'gallery-masonry',
      name: 'Masonry',
      description: 'Pinterest-style layout',
      preview: 'masonry',
      config: { layout: 'masonry', columns: 3 },
    },
    {
      id: 'gallery-carousel',
      name: 'Carousel',
      description: 'Swipeable image slider',
      preview: 'carousel',
      config: { layout: 'carousel', autoplay: true, showDots: true },
    },
    {
      id: 'gallery-featured',
      name: 'Featured + Grid',
      description: 'One large image with smaller grid',
      preview: 'featured',
      config: { layout: 'featured', columns: 2 },
    },
  ],
  testimonials: [
    {
      id: 'testimonials-carousel',
      name: 'Carousel',
      description: 'One testimonial at a time',
      preview: 'carousel',
      config: { layout: 'carousel', showPhoto: true, showRating: true },
    },
    {
      id: 'testimonials-grid',
      name: 'Grid',
      description: 'Multiple testimonials in grid',
      preview: 'grid',
      config: { layout: 'grid', columns: 2, showPhoto: true, showRating: true },
    },
    {
      id: 'testimonials-wall',
      name: 'Wall',
      description: 'Masonry-style testimonial wall',
      preview: 'wall',
      config: { layout: 'wall', showPhoto: true, showRating: true },
    },
  ],
  contact: [
    {
      id: 'contact-split',
      name: 'Split Layout',
      description: 'Form on left, info on right',
      preview: 'split',
      config: { layout: 'split', showMap: true, showForm: true },
    },
    {
      id: 'contact-centered',
      name: 'Centered',
      description: 'Everything centered',
      preview: 'centered',
      config: { layout: 'centered', showMap: false, showForm: true },
    },
    {
      id: 'contact-cards',
      name: 'Contact Cards',
      description: 'Individual cards for each contact method',
      preview: 'cards',
      config: { layout: 'cards', showMap: true, showForm: true },
    },
  ],
  about: [
    {
      id: 'about-simple',
      name: 'Simple',
      description: 'Just text content',
      preview: 'simple',
      config: { layout: 'simple', showImage: false },
    },
    {
      id: 'about-with-image',
      name: 'With Image',
      description: 'Text with side image',
      preview: 'with-image',
      config: { layout: 'with-image', imagePosition: 'right' },
    },
    {
      id: 'about-timeline',
      name: 'Timeline',
      description: 'Company history timeline',
      preview: 'timeline',
      config: { layout: 'timeline', showMilestones: true },
    },
  ],
  // Default empty templates for other sections
  payment: [],
  feedback: [],
  trustIndicators: [],
  videos: [],
  impact: [],
  portfolio: [],
  aboutFounder: [],
  offers: [],
  cta: [],
  businessHours: [],
};

function TemplatePreview({ template, isSelected }: { template: SectionTemplate; isSelected: boolean }) {
  return (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      {/* Preview Visualization */}
      <div className="h-24 mb-3 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <LayoutPreviewIcon layout={template.preview} />
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{template.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
        </div>
        {isSelected && (
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

function LayoutPreviewIcon({ layout }: { layout: string }) {
  // Simple visual representations of layouts
  switch (layout) {
    case 'centered':
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 bg-gray-300 rounded" />
          <div className="w-16 h-2 bg-gray-300 rounded" />
          <div className="w-12 h-2 bg-gray-300 rounded" />
        </div>
      );
    case 'split':
      return (
        <div className="flex gap-2 w-full px-4">
          <div className="flex-1 h-16 bg-gray-300 rounded" />
          <div className="flex-1 flex flex-col gap-1 justify-center">
            <div className="w-full h-2 bg-gray-300 rounded" />
            <div className="w-3/4 h-2 bg-gray-300 rounded" />
          </div>
        </div>
      );
    case 'grid':
      return (
        <div className="grid grid-cols-3 gap-1 w-full px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-300 rounded" />
          ))}
        </div>
      );
    case 'list':
      return (
        <div className="flex flex-col gap-1 w-full px-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded" />
          ))}
        </div>
      );
    case 'carousel':
      return (
        <div className="flex items-center gap-2 px-4">
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
          <div className="flex-1 h-12 bg-gray-300 rounded" />
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
        </div>
      );
    case 'masonry':
      return (
        <div className="grid grid-cols-3 gap-1 w-full px-4">
          <div className="h-10 bg-gray-300 rounded" />
          <div className="h-6 bg-gray-300 rounded" />
          <div className="h-8 bg-gray-300 rounded" />
          <div className="h-6 bg-gray-300 rounded" />
          <div className="h-10 bg-gray-300 rounded" />
          <div className="h-6 bg-gray-300 rounded" />
        </div>
      );
    default:
      return (
        <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
          <Layout className="w-6 h-6 text-gray-400" />
        </div>
      );
  }
}

export default function SectionTemplates({
  sectionId,
  currentConfig,
  onSelectTemplate,
  onClose,
}: SectionTemplatesProps) {
  const templates = sectionTemplates[sectionId] || [];
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    currentConfig?.layout ? `${sectionId}-${currentConfig.layout}` : null
  );

  if (templates.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
          <Layout className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Available</h3>
          <p className="text-gray-500 mb-4">
            This section doesn't have pre-designed templates yet.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    const template = templates.find((t) => t.id === selectedTemplate);
    if (template != null) {
      onSelectTemplate(template.config);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Choose a Layout Template
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <TemplatePreview
                  template={template}
                  isSelected={selectedTemplate === template.id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedTemplate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            Apply Template
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export { sectionTemplates };
