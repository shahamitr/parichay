// @ts-nocheck
'use client';

import { useEffect, useMemo } from 'react';
import { MicrositeData, SectionOrderItem, SectionId } from '@/types/microsite';
// Core Sections
import ProfileSection from './sections/ProfileSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import GallerySection from './sections/GallerySection';
import ContactSection from './sections/ContactSection';
import PaymentSection from './sections/PaymentSection';
import TrustIndicatorsSection from './sections/TrustIndicatorsSection';
import EnhancedFeedbackSection from './sections/EnhancedFeedbackSection';
// Optional Sections
import VideosSection from './sections/VideosSection';
import ImpactSection from './sections/ImpactSection';
import TestimonialsSection from './sections/TestimonialsSection';
import CTASection from './sections/CTASection';
import PortfolioSection from './sections/PortfolioSection';
import OffersSection from './sections/OffersSection';
import AboutFounderSection from './sections/AboutFounderSection';
import BusinessHoursSection from './sections/BusinessHoursSection';
import VoiceIntro from './VoiceIntro';
import ThemeToggle from './ThemeToggle';
import MicrositeFooter from './MicrositeFooter';
import FixedBottomBar from './FixedBottomBar';
import { ScrollProgressBar, FloatingActionButton } from '@/components/navigation';
import AriaLiveRegion from '@/components/ui/AriaLiveRegion';
import KeyboardShortcutsHelp from '@/components/ui/KeyboardShortcutsHelp';
import SectionSeparator from '@/components/ui/SectionSeparator';
import { initializeKeyboardNavigation } from '@/lib/keyboard-navigation';

// Default section order
const DEFAULT_SECTION_ORDER: SectionOrderItem[] = [
  { id: 'hero', enabled: true },
  { id: 'about', enabled: true },
  { id: 'services', enabled: true },
  { id: 'gallery', enabled: true },
  { id: 'contact', enabled: true },
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

  return (
    <div className="microsite-container bg-white">
      {/* ARIA Live Regions for dynamic content announcements */}
      <AriaLiveRegion />

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
      <style dangerouslySetInnerHTML={{ __html: `
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
                  <section id="about" aria-labelledby="about-heading">
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
                  <section id="services" aria-labelledby="services-heading">
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

            default:
              return null;
          }
        })}

        {/* Footer */}
        <MicrositeFooter brand={brand} branch={branch} />
      </main>

      {/* Voice Intro - Premium Feature */}
      {config.voiceIntro?.enabled && (
        <VoiceIntro
          config={config.voiceIntro}
          branchId={branch.id}
          brandId={brand.id}
        />
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
}