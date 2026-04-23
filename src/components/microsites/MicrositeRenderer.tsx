// @ts-nocheck
'use client';

import { useEffect, useMemo } from 'react';
import { MicrositeData, SectionOrderItem, SectionId } from '@/types/microsite';
import dynamic from 'next/dynamic';

// Core Sections (Static)
import ProfileSection from './sections/ProfileSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import GallerySection from './sections/GallerySection';
import ContactSection from './sections/ContactSection';
import PaymentSection from './sections/PaymentSection';
import TrustIndicatorsSection from './sections/TrustIndicatorsSection';
import EnhancedFeedbackSection from './sections/EnhancedFeedbackSection';

// Optional Sections (Dynamic)
const VideosSection = dynamic(() => import('./sections/VideosSection'), { ssr: true });
const ImpactSection = dynamic(() => import('./sections/ImpactSection'), { ssr: true });
const TestimonialsSection = dynamic(() => import('./sections/TestimonialsSection'), { ssr: true });
const CTASection = dynamic(() => import('./sections/CTASection'), { ssr: true });
const PortfolioSection = dynamic(() => import('./sections/PortfolioSection'), { ssr: true });
const OffersSection = dynamic(() => import('./sections/OffersSection'), { ssr: true });
const AboutFounderSection = dynamic(() => import('./sections/AboutFounderSection'), { ssr: true });
const BusinessHoursSection = dynamic(() => import('./sections/BusinessHoursSection'), { ssr: true });
const BookingSection = dynamic(() => import('./sections/BookingSection'), { ssr: true });
const FAQSection = dynamic(() => import('./sections/FAQSection'), { ssr: true });
const TeamSection = dynamic(() => import('./sections/TeamSection'), { ssr: true });
const LocationSection = dynamic(() => import('./sections/LocationSection'), { ssr: true });
const VideoTestimonialsSection = dynamic(() => import('./sections/VideoTestimonialsSection'), { ssr: true });
const WhatsAppCatalogueSection = dynamic(() => import('./sections/WhatsAppCatalogueSection'), { ssr: true });
const SocialProofBadgesDisplay = dynamic(() => import('./sections/SocialProofBadgesDisplay'), { ssr: true });
const VideoTestimonialsDisplay = dynamic(() => import('./sections/VideoTestimonialsDisplay'), { ssr: true });
const VoiceIntroDisplay = dynamic(() => import('./VoiceIntroDisplay'), { ssr: true });
import ThemeToggle from './ThemeToggle';
import MicrositeFooter from './MicrositeFooter';
import FixedBottomBar from './FixedBottomBar';
import { ScrollProgressBar, FloatingActionButton } from '@/components/navigation';
import AriaLiveRegion from '@/components/ui/AriaLiveRegion';
import KeyboardShortcutsHelp from '@/components/ui/KeyboardShortcutsHelp';
import SectionSeparator from '@/components/ui/SectionSeparator';
import { initializeKeyboardNavigation } from '@/lib/keyboard-navigation';
import { initializeHeatmapTracking } from '@/lib/analytics/heatmap-tracker';
import ModernBusinessTemplate from './templates/ModernBusinessTemplate';
import CreativePortfolioTemplate from './templates/CreativePortfolioTemplate';
import MinimalElegantTemplate from './templates/MinimalElegantTemplate';
// Festival theming
import { FestivalBanner, FestivalEffects } from './festival';
import { isBrandFestivalActive, FestivalSettings } from '@/lib/festival-themes';
// Layout system
import { LayoutProvider } from '@/lib/layout-context';
import { getLayoutById } from '@/data/layout-options';

// Default section order
const DEFAULT_SECTION_ORDER: SectionOrderItem[] = [
  { id: 'hero', enabled: true },
  { id: 'about', enabled: true },
  { id: 'services', enabled: true },
  { id: 'gallery', enabled: true },
  { id: 'contact', enabled: true },
  { id: 'location', enabled: false },
  { id: 'trustIndicators', enabled: false },
  { id: 'payment', enabled: true },
  { id: 'feedback', enabled: true },
  { id: 'videos', enabled: false },
  { id: 'testimonials', enabled: false },
  { id: 'impact', enabled: false },
  { id: 'portfolio', enabled: false },
  { id: 'aboutFounder', enabled: false },
  { id: 'offers', enabled: false },
  { id: 'cta', enabled: false },
  { id: 'businessHours', enabled: true },
  { id: 'faq', enabled: false },
  { id: 'team', enabled: false },
  { id: 'booking', enabled: false },
  // Premium Features (DB-backed)
  { id: 'videoTestimonials', enabled: false },
  { id: 'voiceIntro', enabled: false },
  { id: 'whatsappCatalogue', enabled: false },
  { id: 'socialProofBadges', enabled: false },
];

interface MicrositeRendererProps {
  data: MicrositeData;
}

export default function MicrositeRenderer({ data }: MicrositeRendererProps) {
  // Handle undefined data
  if (!data || !data.brand || !data.branch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Not Available</h2>
          <p className="text-gray-600">Unable to load microsite data</p>
        </div>
      </div>
    );
  }

  const { brand, branch } = data;
  const config = branch.micrositeConfig;

  // Get section order from config or use default
  const sectionOrder = useMemo(() => {
    return config.sectionOrder || DEFAULT_SECTION_ORDER;
  }, [config.sectionOrder]);

  // Festival theming
  const festivalSettings = brand.festivalSettings as FestivalSettings | null;
  const isFestivalActive = isBrandFestivalActive(festivalSettings);

  // Check if a section is enabled
  const isSectionEnabled = (sectionId: SectionId): boolean => {
    const section = sectionOrder.find(s => s.id === sectionId);
    return section?.enabled ?? false;
  };

  useEffect(() => {
    // Track page view analytics
    trackPageView();
  }, []);

  // Initialize keyboard navigation
  useEffect(() => {
    const cleanup = initializeKeyboardNavigation();
    return cleanup;
  }, []);

  // Initialize heatmap tracking
  useEffect(() => {
    if (branch.id && brand.id) {
      initializeHeatmapTracking(branch.id, brand.id);
    }
  }, [branch.id, brand.id]);

  const trackPageView = async () => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'PAGE_VIEW',
          branchId: branch.id,
          brandId: brand.id,
          metadata: {
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
          },
        }),
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  // Apply brand theme as CSS variables
  useEffect(() => {
    if (brand.colorTheme) {
      const theme = brand.colorTheme as any;
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', theme.primary);
      root.style.setProperty('--brand-secondary', theme.secondary);
      root.style.setProperty('--brand-accent', theme.accent);
    }
  }, [brand.colorTheme]);

  const renderWithTemplate = (content: React.ReactNode) => {
    // Sync layout with Admin setting (brand.layoutId) taking precedence
    const templateId = (brand as any).layoutId || config.templateId || 'modern-business';

    switch (templateId) {
      case 'creative-portfolio':
        return <CreativePortfolioTemplate data={data}>{content}</CreativePortfolioTemplate>;
      case 'minimal-elegant':
        return <MinimalElegantTemplate data={data}>{content}</MinimalElegantTemplate>;
      default:
        return <ModernBusinessTemplate data={data}>{content}</ModernBusinessTemplate>;
    }
  };

  const mainContent = (
    // Mobile-app style layout container
    <div className="microsite-container bg-white max-w-[480px] mx-auto min-h-screen shadow-2xl relative">
      {/* ARIA Live Regions for dynamic content announcements */}
      <AriaLiveRegion />

      {/* Festival Theming - Effects (particles, confetti, etc.) */}
      {isFestivalActive && festivalSettings?.showEffects && (
        <FestivalEffects settings={festivalSettings} />
      )}

      {/* Festival Theming - Banner (based on position) */}
      {isFestivalActive && festivalSettings && (
        <FestivalBanner settings={festivalSettings} brandName={brand.name} />
      )}

      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Floating Action Button */}
      <FloatingActionButton
        label="Contact Us"
        showLabel={false}
        position="bottom-right"
      />

      {/* Custom CSS for brand theming */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .microsite-container {
          --brand-primary: ${(brand.colorTheme as any)?.primary || '#3B82F6'};
          --brand-secondary: ${(brand.colorTheme as any)?.secondary || '#1F2937'};
          --brand-accent: ${(brand.colorTheme as any)?.accent || '#F59E0B'};
        }
        .brand-primary { color: var(--brand-primary); }
        .bg-brand-primary { background-color: var(--brand-primary); }
        .border-brand-primary { border-color: var(--brand-primary); }
        .brand-secondary { color: var(--brand-secondary); }
        .bg-brand-secondary { background-color: var(--brand-secondary); }
        .brand-accent { color: var(--brand-accent); }
        .bg-brand-accent { background-color: var(--brand-accent); }
        .hover\\:bg-brand-primary:hover { background-color: var(--brand-primary); }
        .hover\\:border-brand-primary:hover { border-color: var(--brand-primary); }
        .page-break { min-height: 100vh; scroll-snap-align: start; position: relative; display: flex; flex-direction: column; }
        .glass-effect { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
        .gradient-text { background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animated-gradient { background: linear-gradient(270deg, var(--brand-primary), var(--brand-accent), var(--brand-secondary)); background-size: 600% 600%; animation: gradient-shift 15s ease infinite; }
      `}} />

      {/* Main Content - Dynamic Section Rendering Based on Order */}
      <main id="main-content" className="flex-1 flex flex-col" role="main" aria-label="Main content">
        {sectionOrder.map((sectionItem, index) => {
          if (!sectionItem.enabled) return null;

          const showSeparator = index > 0;

          switch (sectionItem.id) {
            case 'hero':
              return (
                <div key="hero">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="hero" aria-labelledby="hero-heading">
                    <ProfileSection brand={brand} branch={branch} />
                  </section>
                </div>
              );

            case 'about':
              return (
                <div key="about">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="about" aria-labelledby="about-heading" className={config.templateId === 'creative-portfolio' ? 'creative-section' : config.templateId === 'minimal-elegant' ? 'zen-section' : 'section-container'}>
                    <AboutSection
                      config={config.sections.about || { enabled: true, content: '' }}
                      brand={brand}
                      branch={branch}
                    />
                  </section>
                </div>
              );

            case 'services':
              return (
                <div key="services">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="services" aria-labelledby="services-heading" className={config.templateId === 'creative-portfolio' ? 'creative-section' : config.templateId === 'minimal-elegant' ? 'zen-section' : 'section-container'}>
                    <ServicesSection
                      config={config.sections.services || { enabled: true, items: [] }}
                      brand={brand}
                      branch={branch}
                    />
                  </section>
                </div>
              );

            case 'gallery':
              return (
                <div key="gallery">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="gallery" aria-labelledby="gallery-heading">
                    <GallerySection
                      config={config.sections.gallery || { enabled: true, images: [] }}
                      brand={brand}
                      branch={branch}
                    />
                  </section>
                </div>
              );

            case 'contact':
              return (
                <div key="contact">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="contact" aria-labelledby="contact-heading">
                    <ContactSection
                      config={config.sections.contact || {
                        enabled: true,
                        showMap: true,
                        leadForm: { enabled: true, fields: ['name', 'email', 'phone', 'message'] },
                        appointmentBooking: { enabled: false },
                        liveChatEnabled: false
                      }}
                      brand={brand}
                      branch={branch}
                    />
                  </section>
                </div>
              );

            case 'location':
              if (!branch.address) return null;
              return (
                <div key="location">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="location" aria-labelledby="location-heading">
                    <LocationSection
                      brand={brand}
                      branch={branch}
                      showBusinessHours={true}
                      showContactInfo={true}
                    />
                  </section>
                </div>
              );

            case 'trustIndicators':
              if (!config.sections.trustIndicators) return null;
              return (
                <div key="trustIndicators">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="trust-indicators" aria-labelledby="trust-indicators-heading">
                    <TrustIndicatorsSection
                      config={config.sections.trustIndicators}
                      brand={brand}
                      branch={branch}
                    />
                  </section>
                </div>
              );

            case 'payment':
              return (
                <div key="payment">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="payment" aria-labelledby="payment-heading">
                    <PaymentSection
                      config={config.sections.payment || { enabled: true, methods: [] }}
                      brand={brand}
                    />
                  </section>
                </div>
              );

            case 'feedback':
              return (
                <div key="feedback">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="feedback" aria-labelledby="feedback-heading">
                    <EnhancedFeedbackSection branchId={branch.id} brandId={brand.id} brand={brand} />
                  </section>
                </div>
              );

            case 'videos':
              if (!config.sections.videos?.videos?.length) return null;
              return (
                <div key="videos">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="videos" aria-labelledby="videos-heading">
                    <VideosSection videos={config.sections.videos.videos} />
                  </section>
                </div>
              );

            case 'testimonials':
              if (!config.sections.testimonials) return null;
              return (
                <div key="testimonials">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="testimonials" aria-labelledby="testimonials-heading">
                    <TestimonialsSection
                      config={config.sections.testimonials}
                      brand={brand}
                      branch={branch}
                    />
                  </section>
                </div>
              );

            case 'impact':
              if (!config.sections.impact) return null;
              return (
                <div key="impact">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="impact" aria-labelledby="impact-heading">
                    <ImpactSection
                      config={config.sections.impact}
                      brand={brand}
                      branch={branch}
                    />
                  </section>
                </div>
              );

            case 'portfolio':
              if (!config.sections.portfolio) return null;
              return (
                <div key="portfolio">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="portfolio" aria-labelledby="portfolio-heading">
                    <PortfolioSection
                      config={config.sections.portfolio}
                      brand={brand}
                      branch={branch}
                    />
                  </section>
                </div>
              );

            case 'aboutFounder':
              if (!config.sections.aboutFounder) return null;
              return (
                <div key="aboutFounder">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="about-founder" aria-labelledby="about-founder-heading">
                    <AboutFounderSection brand={brand} branch={branch} config={config.sections.aboutFounder} />
                  </section>
                </div>
              );

            case 'offers':
              if (!config.sections.offers) return null;
              return (
                <div key="offers">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="offers" aria-labelledby="offers-heading">
                    <OffersSection
                      config={config.sections.offers}
                      brand={brand}
                      branch={branch}
                    />
                  </section>
                </div>
              );

            case 'cta':
              if (!config.sections.cta) return null;
              return (
                <div key="cta">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="cta" aria-labelledby="cta-heading">
                    <CTASection
                      config={config.sections.cta}
                      brand={brand}
                      branch={branch}
                    />
                  </section>
                </div>
              );

            case 'businessHours':
              if (!branch.businessHours) return null;
              return (
                <div key="businessHours">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="business-hours" aria-labelledby="business-hours-heading">
                    <BusinessHoursSection branch={branch} brand={brand} />
                  </section>
                </div>
              );

            case 'booking':
              if (!config.sections.booking?.enabled) return null;
              return (
                <div key="booking">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="booking" aria-labelledby="booking-heading">
                    <BookingSection
                      branch={branch}
                      brand={brand}
                      config={config.sections.booking}
                    />
                  </section>
                </div>
              );

            case 'faq':
              if (!config.sections.faq) return null;
              return (
                <div key="faq">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="faq" aria-labelledby="faq-heading">
                    <FAQSection
                      config={config.sections.faq}
                      brand={brand}
                      branch={branch}
                    />
                  </section>
                </div>
              );

            case 'team':
              if (!config.sections.team) return null;
              return (
                <div key="team">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="team" aria-labelledby="team-heading">
                    <TeamSection
                      config={config.sections.team}
                      brand={brand}
                      branch={branch}
                    />
                  </section>
                </div>
              );

            // Premium Features (DB-backed)
            case 'videoTestimonials':
              return (
                <div key="videoTestimonials">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="video-testimonials" aria-labelledby="video-testimonials-heading">
                    <VideoTestimonialsDisplay branchId={branch.id} />
                  </section>
                </div>
              );

            case 'whatsappCatalogue':
              return (
                <div key="whatsappCatalogue">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="whatsapp-catalogue" aria-labelledby="whatsapp-catalogue-heading">
                    <WhatsAppCatalogueSection branchId={branch.id} />
                  </section>
                </div>
              );

            case 'socialProofBadges':
              return (
                <div key="socialProofBadges">
                  {showSeparator && <SectionSeparator variant="gradient" />}
                  <section id="social-proof-badges" aria-labelledby="social-proof-badges-heading">
                    <SocialProofBadgesDisplay branchId={branch.id} position="inline" />
                  </section>
                </div>
              );

            default:
              return null;
          }
        })}

        {/* Footer */}
        <MicrositeFooter brand={brand} branch={branch} />
      </main>

      {/* Social Proof Badges - Floating position (shown if socialProofBadges section is enabled) */}
      {isSectionEnabled('socialProofBadges') && (
        <SocialProofBadgesDisplay branchId={branch.id} position="floating" />
      )}

      {/* Voice Intro - Premium Feature (DB-backed, shown if voiceIntro section is enabled) */}
      {isSectionEnabled('voiceIntro') && (
        <VoiceIntroDisplay branchId={branch.id} brandId={brand.id} />
      )}

      {/* Theme Toggle - Premium Feature */}
      {config.themeSettings && (
        <ThemeToggle settings={config.themeSettings} />
      )}

      {/* Fixed Bottom Bar */}
      <FixedBottomBar data={data} />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />
    </div>
  );

  // Get layout ID from brand or config
  const layoutId = (brand as any).layoutId || config.templateId || 'modern-business';

  return (
    <LayoutProvider layoutId={layoutId}>
      {renderWithTemplate(mainContent)}
    </LayoutProvider>
  );
}
