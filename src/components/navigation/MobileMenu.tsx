// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { prefersReducedMotion } from '@/config/animations';

interface MobileMenuProps {
  /**
   * Navigation sections
   */
  sections: Array<{
    id: string;
    label: string;
  }>;
  /**
   * Active section ID
   */
  activeSection?: string;
  /**
   * Callback when section is clicked
   */
  onSectionClick: (sectionId: string) => void;
  /**
   * Brand logo URL
   */
  logo?: string;
  /**
   * Brand name
   */
  brandName: string;
}

/**
 * MobileMenu Component
 *
 * A mobile-friendly hamburger menu that:
 * - Opens as a full-screen overlay
 * - Has large touch targets (min 44x44px)
 * - Smooth animations
 * - Accessible keyboard navigation
 * - Prevents body scroll when open
 *
 * Requirements: 10.5
 */
export default function MobileMenu({
  sections,
  activeSection,
  onSectionClick,
  logo,
  brandName,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen != null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
    setIsOpen(false);
  };

  const shouldAnimate = !prefersReducedMotion();

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const menuVariants = {
    hidden: {
      x: '100%',
      transition: { type: 'tween', duration: 0.3 },
    },
    visible: {
      x: 0,
      transition: { type: 'tween', duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden relative z-sticky p-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <motion.span
            className="w-full h-0.5 bg-neutral-900 dark:bg-neutral-100 rounded-full"
            animate={
              shouldAnimate
                ? {
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 9 : 0,
                  }
                : undefined
            }
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="w-full h-0.5 bg-neutral-900 dark:bg-neutral-100 rounded-full"
            animate={
              shouldAnimate
                ? {
                    opacity: isOpen ? 0 : 1,
                  }
                : undefined
            }
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-full h-0.5 bg-neutral-900 dark:bg-neutral-100 rounded-full"
            animate={
              shouldAnimate
                ? {
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -9 : 0,
                  }
                : undefined
            }
            transition={{ duration: 0.3 }}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-modal-backdrop md:hidden"
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate="visible"
              exit={shouldAnimate ? 'exit' : 'visible'}
              variants={shouldAnimate ? overlayVariants : undefined}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              id="mobile-menu"
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-neutral-900 z-modal md:hidden shadow-2xl overflow-y-auto"
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate="visible"
              exit={shouldAnimate ? 'hidden' : 'visible'}
              variants={shouldAnimate ? menuVariants : undefined}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center space-x-3">
                  {logo && (
                    <img
                      src={logo}
                      alt={`${brandName} logo`}
                      className="h-10 w-10 object-contain rounded-full"
                    />
                  )}
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {brandName}
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <nav className="p-6" role="navigation" aria-label="Mobile navigation">
                <ul className="space-y-2">
                  {sections.map((section, index) => (
                    <motion.li
                      key={section.id}
                      custom={index}
                      initial={shouldAnimate ? 'hidden' : 'visible'}
                      animate="visible"
                      variants={shouldAnimate ? itemVariants : undefined}
                    >
                      <button
                        onClick={() => handleSectionClick(section.id)}
                        className={`
                          w-full text-left px-4 py-4 min-h-[56px] rounded-xl font-medium text-lg
                          transition-all duration-200 touch-manipulation
                          ${
                            activeSection === section.id
                              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                          }
                        `}
                        aria-current={activeSection === section.id ? 'page' : undefined}
                      >
                        {section.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                  © {new Date().getFullYear()} {brandName}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
