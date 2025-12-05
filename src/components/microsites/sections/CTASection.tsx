'use client';

import { Brand, Branch } from '@/generated/prisma';
import { CTASection as CTAConfig } from '@/types/microsite';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getImageWithFallback } from '@/lib/placeholder-utils';

interface CTASectionProps {
  config: CTAConfig;
  brand: Brand;
  branch: Branch;
}

export default function CTASection({ config, brand, branch }: CTASectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  if (!config.enabled) {
    return null;
  }

  const handleCTAClick = async () => {
    // Track CTA click analytics
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'CLICK',
          branchId: branch.id,
          brandId: brand.id,
          metadata: {
            action: 'cta_click',
            section: 'cta',
            buttonText: config.buttonText,
          },
        }),
      });
    } catch (error) {
      console.error('Error tracking CTA click:', error);
    }

    // Navigate to the link
    if (config.buttonLink) {
      if (config.buttonLink.startsWith('http')) {
        window.open(config.buttonLink, '_blank');
      } else if (config.buttonLink.startsWith('#')) {
        // Smooth scroll to section
        const element = document.querySelector(config.buttonLink);
        if (element != null) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = config.buttonLink;
      }
    }
  };

  const backgroundImageUrl =
    config.backgroundType === 'image' && config.backgroundImage
      ? getImageWithFallback(config.backgroundImage, 'banner', brand.name)
      : undefined;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[400px] overflow-hidden border-b border-gray-200"
    >
      {/* Background */}
      {config.backgroundType === 'gradient' ? (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-purple-600 to-accent-600">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse"></div>
        </div>
      ) : (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
            }}
          />
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-purple-900/80 to-accent-900/80"></div>
        </>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          {/* Title */}
          <h2 className="text-hero font-bold text-white leading-tight drop-shadow-lg">
            {config.title}
          </h2>

          {/* Subtitle */}
          <p className="text-h3 font-medium text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            {config.subtitle}
          </p>

          {/* CTA Button */}
          <motion.div
            className="pt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.button
              onClick={handleCTAClick}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{config.buttonText}</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            className="pt-6 flex items-center justify-center gap-2 text-white/80 text-sm"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Trusted by thousands of customers</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z"
            fill="currentColor"
            opacity="0.1"
          />
        </svg>
      </div>
    </section>
  );
}
