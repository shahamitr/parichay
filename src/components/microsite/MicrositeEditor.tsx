// @ts-nocheck
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import SectionSidebar from './SectionSidebar';
import PreviewPanel, { ViewMode } from './PreviewPanel';
import AIGeneratorModal from './AIGeneratorModal';
import { MicrositeConfig, SectionOrderItem, SectionId } from '@/types/microsite';

// Import section editors
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
import VideoTestimonialsEditor from './sections/VideoTestimonialsEditor';
import VoiceIntroEditor from './sections/VoiceIntroEditor';
import WhatsAppCatalogueEditor from './sections/WhatsAppCatalogueEditor';
import SocialProofBadgesEditor from './sections/SocialProofBadgesEditor';
import BookingEditor from './sections/BookingEditor';
import FAQEditor from './sections/FAQEditor';
import TeamEditor from './sections/TeamEditor';
import BusinessHoursEditor from './sections/BusinessHoursEditor';
import OffersEditor from './sections/OffersEditor';
import PortfolioEditor from './sections/PortfolioEditor';
import AboutFounderEditor from './sections/AboutFounderEditor';
import FeedbackEditor from './sections/FeedbackEditor';
import LocalSEOEditor from './sections/LocalSEOEditor';
import MessagingEditor from './sections/MessagingEditor';
import ReviewResponseEditor from './sections/ReviewResponseEditor';

interface MicrositeEditorProps {
  branchId: string;
  brandId: string;
  initialConfig: MicrositeConfig;
  userRole: string;
  branchName?: string;
  brandName?: string;
  embedded?: boolean;
}

const DEFAULT_SECTION_ORDER: SectionOrderItem[] = [
  { id: 'hero', enabled: true },
  { id: 'about', enabled: true },
  { id: 'services', enabled: true },
  { id: 'gallery', enabled: false },
  { id: 'videos', enabled: false },
  { id: 'impact', enabled: false },
  { id: 'testimonials', enabled: false },
  { id: 'trustIndicators', enabled: false },
  { id: 'portfolio', enabled: false },
  { id: 'aboutFounder', enabled: false },
  { id: 'offers', enabled: false },
  { id: 'cta', enabled: false },
  { id: 'contact', enabled: true },
  { id: 'booking', enabled: false },
  { id: 'payment', enabled: false },
  { id: 'faq', enabled: false },
  { id: 'team', enabled: false },
  { id: 'businessHours', enabled: false },
  { id: 'feedback', enabled: false },
  { id: 'videoTestimonials', enabled: false },
  { id: 'voiceIntro', enabled: false },
  { id: 'whatsappCatalogue', enabled: false },
  { id: 'socialProofBadges', enabled: false },
  { id: 'localSEO', enabled: false },
  { id: 'messaging', enabled: false },
  { id: 'reviewResponse', enabled: false },
];

const sectionLabels: Record<SectionId, string> = {
  hero: 'Hero Banner',
  about: 'About Us',
  services: 'Services',
  priceList: 'Price List',
  gallery: 'Gallery',
  contact: 'Contact',
  booking: 'Booking',
  payment: 'Payment',
  feedback: 'Feedback',
  trustIndicators: 'Trust Badges',
  videos: 'Videos',
  testimonials: 'Testimonials',
  impact: 'Impact Stats',
  portfolio: 'Portfolio',
  aboutFounder: 'About Founder',
  offers: 'Offers',
  cta: 'CTA',
  businessHours: 'Hours',
  faq: 'FAQ',
  team: 'Team',
  videoTestimonials: 'Video Testimonials',
  voiceIntro: 'Voice Intro',
  whatsappCatalogue: 'Catalogue',
  socialProofBadges: 'Badges',
  localSEO: 'Local SEO',
  messaging: 'Messaging',
  reviewResponse: 'Review Responses',
};

// Merge existing section order with defaults to ensure all sections are present
function mergeSectionOrder(existing: SectionOrderItem[] | undefined): SectionOrderItem[] {
  if (!existing || existing.length === 0) {
    return DEFAULT_SECTION_ORDER;
  }

  // Get IDs of existing sections
  const existingIds = new Set(existing.map(s => s.id));

  // Add any missing sections from defaults
  const missingSections = DEFAULT_SECTION_ORDER.filter(s => !existingIds.has(s.id));

  return [...existing, ...missingSections];
}

export default function MicrositeEditor({
  branchId,
  brandId,
  initialConfig,
  userRole,
  branchName = 'Branch',
  brandName = 'Brand',
  embedded = false,
}: MicrositeEditorProps) {
  const [config, setConfig] = useState<MicrositeConfig>(initialConfig);
  const [sectionOrder, setSectionOrder] = useState<SectionOrderItem[]>(
    mergeSectionOrder(initialConfig.sectionOrder)
  );
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Track changes
  useEffect(() => {
    const configChanged = JSON.stringify(config) !== JSON.stringify(initialConfig);
    const orderChanged = JSON.stringify(sectionOrder) !== JSON.stringify(initialConfig.sectionOrder || DEFAULT_SECTION_ORDER);
    setHasChanges(configChanged || orderChanged);
  }, [config, sectionOrder, initialConfig]);

  // Save draft to localStorage
  useEffect(() => {
    if (hasChanges) {
      localStorage.setItem(`microsite-draft-${branchId}`, JSON.stringify({ config, sectionOrder }));
    }
  }, [config, sectionOrder, branchId, hasChanges]);

  // Update config when section order changes
  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      sectionOrder,
    }));
  }, [sectionOrder]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/branches/${branchId}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ micrositeConfig: { ...config, sectionOrder } }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save');
      }

      setSaveSuccess(true);
      setHasChanges(false);
      localStorage.removeItem(`microsite-draft-${branchId}`);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes');
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleAIGenerate = (generatedData: any) => {
    setConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        hero: { ...prev.sections.hero, title: generatedData.hero.title, subtitle: generatedData.hero.subtitle },
        about: { ...prev.sections.about, content: generatedData.about.content },
        services: { ...prev.sections.services, items: generatedData.services },
      },
      seoSettings: {
        ...prev.seoSettings,
        title: generatedData.hero.title,
        description: generatedData.about.content.substring(0, 160),
      },
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSectionClick = useCallback((sectionId: SectionId) => {
    setActiveSection(sectionId);
    setViewMode('edit'); // Auto-switch to edit mode
  }, []);

  const handleSectionsChange = useCallback((newSections: SectionOrderItem[]) => {
    setSectionOrder(newSections);
  }, []);

  const updateSection = useCallback((sectionKey: string, sectionData: any) => {
    setConfig((prev) => ({
      ...prev,
      sections: { ...prev.sections, [sectionKey]: sectionData },
    }));
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // Render editor content based on active section
  const editorContent = useMemo(() => {
    if (!activeSection) return null;

    const sectionLabel = sectionLabels[activeSection] || activeSection;

    const renderEditor = () => {
      switch (activeSection) {
        case 'hero':
          return (
            <HeroEditor
              config={config.sections.hero || { enabled: true, title: '', subtitle: '', backgroundType: 'gradient' }}
              onChange={(data) => updateSection('hero', data)}
            />
          );
        case 'about':
          return (
            <AboutEditor
              config={config.sections.about || { enabled: true, content: '' }}
              onChange={(data) => updateSection('about', data)}
            />
          );
        case 'services':
          return (
            <ServicesEditor
              config={config.sections.services || { enabled: true, items: [] }}
              onChange={(data) => updateSection('services', data)}
            />
          );
        case 'impact':
          return (
            <ImpactEditor
              config={config.sections.impact}
              onChange={(data) => updateSection('impact', data)}
            />
          );
        case 'testimonials':
          return (
            <TestimonialsEditor
              config={config.sections.testimonials}
              onChange={(data) => updateSection('testimonials', data)}
            />
          );
        case 'gallery':
          return (
            <GalleryEditor
              config={config.sections.gallery || { enabled: false, images: [] }}
              onChange={(data) => updateSection('gallery', data)}
              branchId={branchId}
            />
          );
        case 'trustIndicators':
          return (
            <TrustIndicatorsEditor
              config={config.sections.trustIndicators}
              onChange={(data) => updateSection('trustIndicators', data)}
            />
          );
        case 'videos':
          return (
            <VideosEditor
              config={config.sections.videos || { enabled: false, videos: [] }}
              onChange={(data) => updateSection('videos', data)}
            />
          );
        case 'cta':
          return (
            <CTAEditor
              config={config.sections.cta}
              onChange={(data) => updateSection('cta', data)}
            />
          );
        case 'contact':
          return (
            <ContactEditor
              config={config.sections.contact || { enabled: true, showMap: false, leadForm: { enabled: true, fields: [] } }}
              onChange={(data) => updateSection('contact', data)}
            />
          );
        case 'payment':
          return (
            <PaymentEditor
              config={config.sections.payment || { enabled: true }}
              onChange={(data) => updateSection('payment', data)}
            />
          );
        case 'booking':
          return (
            <BookingEditor
              config={config.sections.booking || { enabled: false }}
              onChange={(data) => updateSection('booking', data)}
              branchId={branchId}
            />
          );
        case 'videoTestimonials':
          return <VideoTestimonialsEditor branchId={branchId} brandId={brandId} />;
        case 'voiceIntro':
          return <VoiceIntroEditor branchId={branchId} />;
        case 'whatsappCatalogue':
          return <WhatsAppCatalogueEditor branchId={branchId} />;
        case 'socialProofBadges':
          return <SocialProofBadgesEditor branchId={branchId} brandId={brandId} />;
        case 'faq':
          return (
            <FAQEditor
              config={config.sections.faq || { enabled: false, items: [] }}
              onChange={(data) => updateSection('faq', data)}
            />
          );
        case 'team':
          return (
            <TeamEditor
              config={config.sections.team || { enabled: false, members: [] }}
              onChange={(data) => updateSection('team', data)}
            />
          );
        case 'businessHours':
          return (
            <BusinessHoursEditor
              config={(config as any).businessHours || {}}
              onChange={(data) => {
                // BusinessHours is stored at branch level, not in sections
                // This needs special handling
              }}
            />
          );
        case 'offers':
          return (
            <OffersEditor
              config={config.sections.offers || { enabled: false, offers: [] }}
              onChange={(data) => updateSection('offers', data)}
            />
          );
        case 'portfolio':
          return (
            <PortfolioEditor
              config={config.sections.portfolio || { enabled: false, layout: 'grid', items: [], categories: [] }}
              onChange={(data) => updateSection('portfolio', data)}
            />
          );
        case 'aboutFounder':
          return (
            <AboutFounderEditor
              config={config.sections.aboutFounder || { enabled: false }}
              onChange={(data) => updateSection('aboutFounder', data)}
            />
          );
        case 'feedback':
          return (
            <FeedbackEditor
              config={config.sections.feedback || { enabled: true }}
              onChange={(data) => updateSection('feedback', data)}
            />
          );
        case 'localSEO':
          return (
            <LocalSEOEditor
              config={config.sections.localSEO || {
                enabled: false,
                businessName: '',
                address: { street: '', city: '', state: '', zipCode: '', country: '' },
                coordinates: { lat: 0, lng: 0 },
                businessType: '',
                keywords: [],
                mapProvider: 'openstreetmap',
                showMap: false,
                schema: { enabled: false, businessType: '', priceRange: '', paymentAccepted: [] }
              }}
              onChange={(data) => updateSection('localSEO', data)}
            />
          );
        case 'messaging':
          return (
            <MessagingEditor
              config={config.sections.messaging || {
                enabled: false,
                channels: {
                  whatsapp: { enabled: false, number: '', welcomeMessage: '', businessHours: true },
                  email: { enabled: false, address: '', autoReply: false, autoReplyMessage: '' },
                  phone: { enabled: false, number: '', displayFormat: 'button' },
                  livechat: { enabled: false, welcomeMessage: '', offlineMessage: '', position: 'bottom-right' }
                },
                businessHours: { enabled: false, timezone: 'Asia/Kolkata', schedule: {} },
                autoResponses: { enabled: false, responses: [] }
              }}
              onChange={(data) => updateSection('messaging', data)}
            />
          );
        case 'reviewResponse':
          return (
            <ReviewResponseEditor
              config={config.sections.reviewResponse || {
                enabled: false,
                autoResponse: { enabled: false, positiveTemplate: '', negativeTemplate: '', neutralTemplate: '' },
                reviewSources: {
                  google: { enabled: false },
                  facebook: { enabled: false },
                  yelp: { enabled: false },
                  justdial: { enabled: false },
                  internal: { enabled: true }
                },
                responseTemplates: [],
                notifications: { enabled: false, email: true, whatsapp: false, threshold: 3 },
                publicDisplay: { enabled: true, showResponses: true, moderateBeforePublish: false }
              }}
              onChange={(data) => updateSection('reviewResponse', data)}
              branchId={branchId}
            />
          );
        default:
          return (
            <div className="text-center py-12 text-gray-500">
              <p>Editor for "{sectionLabel}" is not available yet.</p>
            </div>
          );
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Editing: {sectionLabel}</h3>
        </div>
        {renderEditor()}
      </div>
    );
  }, [activeSection, config.sections, branchId, brandId, updateSection]);

  return (
    <div className={`flex flex-col ${embedded ? 'min-h-[calc(100vh-200px)]' : 'h-[calc(100vh-120px)]'} bg-[#0a0a0a]`}>
      {/* Main Content Area - Split Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Section List (compact) */}
        <div className="w-44 flex-shrink-0">
          <SectionSidebar
            sections={sectionOrder}
            onSectionsChange={handleSectionsChange}
            activeSection={activeSection}
            onSectionClick={handleSectionClick}
          />
        </div>

        {/* Center - Preview/Edit Panel with integrated toolbar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PreviewPanel
            config={config}
            brandId={brandId}
            branchId={branchId}
            onSave={handleSave}
            onAIMagic={() => setIsAIModalOpen(true)}
            saving={saving}
            hasChanges={hasChanges}
            saveSuccess={saveSuccess}
            saveError={saveError}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            activeSection={activeSection}
            editorContent={editorContent}
          />
        </div>
      </div>

      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIGenerate}
        currentName={config.seoSettings?.title || 'My Business'}
      />
    </div>
  );
}
