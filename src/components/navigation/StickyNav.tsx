// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brand, Branch } from '@/generated/prisma';
import { prefersReducedMotion } from '@/config/animations';
import { designTokens } from '@/config/design-tokens';

interface StickyNavProps {
  brand: Brand;
  branch: Branch;
  sections?: Array<{
    id: string;
    label: string;
  }>;
}

/**
 * StickyNav Component
 *
 * A modern sticky navigation bar with:
 * - Backdrop blur effect for glassmorphism
 * - Show/hide on scroll behavior (hide on scroll down, show on scroll up)
 * - Smooth scroll to sections
 * - Responsive design
 *
 * Requirements: 8.1, 8.5
 */
export default function StickyNav({ brand, branch, sections }: StickyNavProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  // Default sections if none provided
  const defaultSections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const navSections = sections || defaultSections;

  // Handle scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show nav when at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of navSections) {
        const element = document.getElementById(section.id);
        if (element != null) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy(); // Initial check
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [navSections]);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element != null) {
      const offset = 80; // Account for sticky nav height
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  // Animation variants
  const navVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  // Disable animations if user prefers reduced motion
  const shouldAnimate = !prefersReducedMotion();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={shouldAnimate ? 'hidden' : 'visible'}
          animate="visible"
          exit={shouldAnimate ? 'hidden' : 'visible'}
          variants={shouldAnimate ? navVariants : undefined}
          className="fixed top-0 left-0 right-0 z-sticky"
          style={{ zIndex: designTokens.zIndex.sticky }}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Backdrop blur container */}
          <div className="backdrop-blur-lg bg-white/70 dark:bg-neutral-900/70 border-b border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Brand info */}
                <div className="flex items-center space-x-3">
                  {brand.logo && (
                    <img
                      src={brand.logo}
                      alt={`${brand.name} Logo`}
                      className="h-8 w-8 object-contain rounded-full"
                    />
                  )}
                  <div className="hidden sm:block">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {branch.name}
                    </h2>
                  </div>
                </div>

                {/* Navigation links - Responsive */}
                <div className="flex items-center space-x-1 overflow-x-auto" role="menubar" aria-label="Page sections">
                  {navSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`
                        px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap
                        ${
                          activeSection === section.id
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }
                      `}
                      role="menuitem"
                      aria-label={`Navigate to ${section.label} section`}
                      aria-current={activeSection === section.id ? 'page' : undefined}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
