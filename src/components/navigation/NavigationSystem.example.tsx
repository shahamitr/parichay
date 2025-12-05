// @ts-nocheck
/**
 * Navigation System Example
 *
 * This file demonstrates how to use the navigation components together.
 * Copy and adapt this code for your microsite implementation.
 */

'use client';

import { StickyNav, ScrollProgressBar, FloatingActionButton } from './index';
import { Brand, Branch } from '@/generated/prisma';

// Example brand and branch data
const exampleBrand: Brand = {
  id: 'brand-1',
  name: 'Acme Corporation',
  logo: '/images/logo.png',
  tagline: 'Innovation at its finest',
  colorTheme: {
    primary: '#7b61ff',
    secondary: '#1F2937',
    accent: '#ff7b00',
  },
  // ... other brand fields
} as Brand;

const exampleBranch: Branch = {
  id: 'branch-1',
  name: 'Acme Downtown',
  // ... other branch fields
} as Branch;

/**
 * Example 1: Basic Navigation Setup
 *
 * The simplest way to add navigation to your microsite.
 */
export function BasicNavigationExample() {
  return (
    <div className="min-h-screen">
      {/* Progress bar at the very top */}
      <ScrollProgressBar />

      {/* Sticky navigation */}
      <StickyNav brand={exampleBrand} branch={exampleBranch} />

      {/* Floating action button */}
      <FloatingActionButton label="Contact Us" />

      {/* Your page content */}
      <main>
        <section id="hero" className="min-h-screen bg-blue-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold">Hero Section</h1>
        </section>
        <section id="about" className="min-h-screen bg-green-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold">About Section</h1>
        </section>
        <section id="services" className="min-h-screen bg-yellow-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold">Services Section</h1>
        </section>
        <section id="contact" className="min-h-screen bg-red-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold">Contact Section</h1>
        </section>
      </main>
    </div>
  );
}

/**
 * Example 2: Custom Navigation Sections
 *
 * Define your own navigation sections with custom labels.
 */
export function CustomSectionsExample() {
  const customSections = [
    { id: 'home', label: 'Home' },
    { id: 'our-story', label: 'Our Story' },
    { id: 'products', label: 'Products' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'get-in-touch', label: 'Get in Touch' },
  ];

  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <StickyNav
        brand={exampleBrand}
        branch={exampleBranch}
        sections={customSections}
      />
      <FloatingActionButton label="Contact Us" />

      {/* Your sections with matching IDs */}
      <main>
        <section id="home">...</section>
        <section id="our-story">...</section>
        <section id="products">...</section>
        <section id="testimonials">...</section>
        <section id="get-in-touch">...</section>
      </main>
    </div>
  );
}

/**
 * Example 3: Custom FAB with Modal
 *
 * Use a custom action for the floating button.
 */
export function CustomFABExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFABClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <StickyNav brand={exampleBrand} branch={exampleBranch} />

      {/* Custom FAB with modal trigger */}
      <FloatingActionButton
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        }
        label="Chat with us"
        onClick={handleFABClick}
        showLabel={true}
        position="bottom-right"
        showAfterScroll={200}
      />

      {/* Your modal component */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Chat with us</h2>
            <p>Modal content here...</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main>
        {/* Your content */}
      </main>
    </div>
  );
}

/**
 * Example 4: Left-Positioned FAB
 *
 * Position the FAB on the left side instead.
 */
export function LeftFABExample() {
  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <StickyNav brand={exampleBrand} branch={exampleBranch} />

      {/* FAB on the left */}
      <FloatingActionButton
        label="Help & Support"
        position="bottom-left"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <main>
        {/* Your content */}
      </main>
    </div>
  );
}

/**
 * Example 5: Multiple FABs
 *
 * Use multiple FABs for different actions (not recommended for most cases).
 */
export function MultipleFABsExample() {
  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <StickyNav brand={exampleBrand} branch={exampleBranch} />

      {/* Primary action - right */}
      <FloatingActionButton
        label="Contact Us"
        position="bottom-right"
      />

      {/* Secondary action - left */}
      <FloatingActionButton
        label="Help"
        position="bottom-left"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        showAfterScroll={500}
      />

      <main>
        {/* Your content */}
      </main>
    </div>
  );
}

/**
 * Example 6: Conditional Navigation
 *
 * Show/hide navigation based on conditions.
 */
export function ConditionalNavigationExample() {
  const [showNav, setShowNav] = useState(true);
  const [showFAB, setShowFAB] = useState(true);

  return (
    <div className="min-h-screen">
      <ScrollProgressBar />

      {showNav && (
        <StickyNav brand={exampleBrand} branch={exampleBranch} />
      )}

      {showFAB && (
        <FloatingActionButton label="Contact Us" />
      )}

      {/* Toggle controls (for demo purposes) */}
      <div className="fixed top-20 right-4 z-[9999] bg-white p-4 rounded-lg shadow-lg">
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={showNav}
            onChange={(e) => setShowNav(e.target.checked)}
          />
          Show Navigation
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showFAB}
            onChange={(e) => setShowFAB(e.target.checked)}
          />
          Show FAB
        </label>
      </div>

      <main>
        {/* Your content */}
      </main>
    </div>
  );
}

// Import useState for examples that need it
import { useState } from 'react';
