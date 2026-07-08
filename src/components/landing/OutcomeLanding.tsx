'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Sections loaded eagerly (above the fold)
import HeroSection from './sections/HeroSection';
import ProblemSection from './sections/ProblemSection';

// Sections loaded lazily (below the fold)
const LiveDemoSection = dynamic(() => import('./sections/LiveDemoSection'), { ssr: true });
const HowItWorksSection = dynamic(() => import('./sections/HowItWorksSection'), { ssr: true });
const FeaturesSection = dynamic(() => import('./sections/FeaturesSection'), { ssr: true });
const IndustriesSection = dynamic(() => import('./sections/IndustriesSection'), { ssr: true });
const ComparisonSection = dynamic(() => import('./sections/ComparisonSection'), { ssr: true });
const SocialProofSection = dynamic(() => import('./sections/SocialProofSection'), { ssr: true });
const PricingSection = dynamic(() => import('./sections/PricingSection'), { ssr: true });
const FAQSection = dynamic(() => import('./sections/FAQSection'), { ssr: true });
const FinalCTASection = dynamic(() => import('./sections/FinalCTASection'), { ssr: true });
const FooterSection = dynamic(() => import('./sections/FooterSection'), { ssr: true });

export default function OutcomeLanding() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] antialiased overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <HeroSection />
      <ProblemSection />
      <LiveDemoSection />
      <HowItWorksSection />
      <FeaturesSection />
      <IndustriesSection />
      <ComparisonSection />
      <SocialProofSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <FooterSection />
    </div>
  );
}
