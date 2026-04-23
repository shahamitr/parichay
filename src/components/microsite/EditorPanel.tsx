'use client';

import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { SectionId } from '@/types/microsite';

// Import all section editors
import ProfileEditor from './sections/ProfileEditor';
import HeroEditor from './sections/HeroEditor';
import AboutEditor from './sections/AboutEditor';
import ServicesEditor from './sections/ServicesEditor';
import ImpactEditor from './sections/ImpactEditor';
import TestimonialsEditor from './sections/TestimonialsEditor';
import GalleryEditor from './sections/GalleryEditor';
import TrustIndicatorsEditor from './sections/TrustIndicatorsEditor';
import VideosEditor from './sections/VideosEditor';
import CTAEditor from './sections/CTAEditor';
import ContactEditor from './sections/ContactEditor';
import PaymentEditor from './sections/PaymentEditor';
import SEOEditor from './sections/SEOEditor';
import ThemeCustomizer from './sections/ThemeCustomizer';
// Premium Feature Editors
import VideoTestimonialsEditor from './sections/VideoTestimonialsEditor';
import VoiceIntroEditor from './sections/VoiceIntroEditor';
import WhatsAppCatalogueEditor from './sections/WhatsAppCatalogueEditor';
import SocialProofBadgesEditor from './sections/SocialProofBadgesEditor';

interface EditorPanelProps {
  activeSection: SectionId | null;
  config: any;
  onConfigChange: (sectionKey: string, sectionData: any) => void;
  onClose: () => void;
  userRole?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  branchId?: string;
  brandId?: string;
}

const sectionLabels: Record<SectionId, string> = {
  hero: 'Hero Banner',
  about: 'About Us',
  services: 'Services',
  priceList: 'Price List',
  gallery: 'Gallery',
  contact: 'Contact',
  payment: 'Payment Methods',
  feedback: 'Feedback',
  trustIndicators: 'Trust Badges',
  videos: 'Videos',
  testimonials: 'Testimonials',
  impact: 'Impact Stats',
  portfolio: 'Portfolio',
  aboutFounder: 'About Founder',
  offers: 'Special Offers',
  cta: 'Call to Action',
  businessHours: 'Business Hours',
  faq: 'FAQ',
  team: 'Team Members',
  // Premium Features
  videoTestimonials: 'Video Testimonials',
  voiceIntro: 'Voice Introduction',
  whatsappCatalogue: 'WhatsApp Catalogue',
  socialProofBadges: 'Social Proof Badges',
};

export default function EditorPanel({
  activeSection,
  config,
  onConfigChange,
  onClose,
  userRole = 'ADMIN',
  isCollapsed = false,
  onToggleCollapse,
  branchId = '',
  brandId = '',
}: EditorPanelProps) {
  if (!activeSection) return null;

  const canEditBranding = userRole === 'ADMIN';
  const canEditAdvanced = userRole === 'ADMIN' || userRole === 'EXECUTIVE';

  // Check if this is a premium feature (DB-backed)
  const isPremiumFeature = ['videoTestimonials', 'voiceIntro', 'whatsappCatalogue', 'socialProofBadges'].includes(activeSection);

  const renderEditor = () => {
    switch (activeSection) {
      case 'hero':
        return (
          <HeroEditor
            config={config.sections.hero || { enabled: true, title: '', subtitle: '', backgroundType: 'gradient' }}
            onChange={(data) => onConfigChange('hero', data)}
          />
        );
      case 'about':
        return (
          <AboutEditor
            config={config.sections.about || { enabled: true, content: '' }}
            onChange={(data) => onConfigChange('about', data)}
          />
        );
      case 'services':
        return (
          <ServicesEditor
            config={config.sections.services || { enabled: true, items: [] }}
            onChange={(data) => onConfigChange('services', data)}
          />
        );
      case 'impact':
        return (
          <ImpactEditor
            config={config.sections.impact}
            onChange={(data) => onConfigChange('impact', data)}
          />
        );
      case 'testimonials':
        return (
          <TestimonialsEditor
            config={config.sections.testimonials}
            onChange={(data) => onConfigChange('testimonials', data)}
          />
        );
      case 'gallery':
        return (
          <GalleryEditor
            config={config.sections.gallery || { enabled: false, images: [] }}
            onChange={(data) => onConfigChange('gallery', data)}
          />
        );
      case 'trustIndicators':
        return (
          <TrustIndicatorsEditor
            config={config.sections.trustIndicators}
            onChange={(data) => onConfigChange('trustIndicators', data)}
          />
        );
      case 'videos':
        return (
          <VideosEditor
            config={config.sections.videos || { enabled: false, videos: [] }}
            onChange={(data) => onConfigChange('videos', data)}
          />
        );
      case 'cta':
        return (
          <CTAEditor
            config={config.sections.cta}
            onChange={(data) => onConfigChange('cta', data)}
          />
        );
      case 'contact':
        return (
          <ContactEditor
            config={config.sections.contact || { enabled: true, showMap: false, leadForm: { enabled: true, fields: [] } }}
            onChange={(data) => onConfigChange('contact', data)}
          />
        );
      case 'payment':
        return (
          <PaymentEditor
            config={config.sections.payment || { enabled: true }}
            onChange={(data) => onConfigChange('payment', data)}
          />
        );
      // Premium Features (DB-backed)
      case 'videoTestimonials':
        return (
          <VideoTestimonialsEditor
            branchId={branchId}
            brandId={brandId}
          />
        );
      case 'voiceIntro':
        return (
          <VoiceIntroEditor
            branchId={branchId}
          />
        );
      case 'whatsappCatalogue':
        return (
          <WhatsAppCatalogueEditor
            branchId={branchId}
          />
        );
      case 'socialProofBadges':
        return (
          <SocialProofBadgesEditor
            branchId={branchId}
            brandId={brandId}
          />
        );
      default:
        return (
          <div className="text-center py-12 text-gray-500">
            <p>Editor for "{sectionLabels[activeSection] || activeSection}" is not available yet.</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm transition-all duration-300 ${
        isCollapsed ? 'h-12' : 'h-[400px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">
            Edit: {sectionLabels[activeSection] || activeSection}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Close editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      {!isCollapsed && (
        <div className="overflow-y-auto h-[calc(100%-48px)] p-4">
          <div className="max-w-4xl mx-auto">
            {renderEditor()}
          </div>
        </div>
      )}
    </div>
  );
}
