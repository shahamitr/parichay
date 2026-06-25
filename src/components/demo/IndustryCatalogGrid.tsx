'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  CalendarCheck,
  UserCheck,
  GraduationCap,
  Palette,
  Home,
  Stethoscope,
  Utensils,
  Dumbbell,
  Scale,
  Search,
  ArrowRight,
  Sparkles,
  Eye,
  X,
  Trophy,
  Pill,
  Lamp,
  Heart,
  Wrench,
  ShoppingCart,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  briefcase: Briefcase,
  'building-2': Building2,
  'calendar-check': CalendarCheck,
  'user-check': UserCheck,
  'graduation-cap': GraduationCap,
  palette: Palette,
  home: Home,
  stethoscope: Stethoscope,
  utensils: Utensils,
  dumbbell: Dumbbell,
  scale: Scale,
  trophy: Trophy,
  pill: Pill,
  lamp: Lamp,
  heart: Heart,
  wrench: Wrench,
  'shopping-cart': ShoppingCart,
};

interface IndustryCategoryCard {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  colorScheme: { primary: string; secondary: string; accent: string };
  demoUrl: string | null;
  brandName: string | null;
}

interface IndustryCatalogGridProps {
  categories: IndustryCategoryCard[];
}

export default function IndustryCatalogGrid({ categories }: IndustryCatalogGridProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [categories, search],
  );

  const availableCount = categories.filter((c) => c.demoUrl).length;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100/60 flex items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="text-[17px] font-semibold text-gray-900 tracking-tight">Parichay</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/demo" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
            Interactive Demo
          </Link>
          <Link
            href="/register"
            className="h-9 px-4 flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-[13px] font-medium rounded-lg transition-all shadow-md shadow-indigo-500/20"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-100/50 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[12px] font-semibold text-indigo-700">{availableCount} Live Demos Available</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            See How Parichay Works for{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Industry
            </span>
          </h1>

          <p className="mt-5 text-[16px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Each demo is a fully configured microsite with real content — services, gallery, team, testimonials, and booking. Click any industry to explore.
          </p>

          {/* Search */}
          <div className="mt-10 max-w-lg mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by industry name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-[15px] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              )}
            </div>
            {search && (
              <p className="mt-3 text-[13px] text-gray-400">
                {filtered.length === 0
                  ? 'No industries match your search'
                  : `Showing ${filtered.length} of ${categories.length} industries`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium text-[15px]">No industries match &ldquo;{search}&rdquo;</p>
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-[13px] text-indigo-600 font-medium hover:text-indigo-700"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((category) => (
              <CategoryCard key={category.categoryId} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-100 bg-gray-50/50">

        {/* Why Online Presence Matters */}
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-10">
          {/* Quote */}
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-full mb-5">
              <span className="text-xl">&ldquo;</span>
            </div>
            <blockquote className="text-xl sm:text-2xl font-medium text-gray-800 leading-relaxed italic">
              97% of consumers search online for local businesses. If you&apos;re not visible, you don&apos;t exist for them.
            </blockquote>
            <p className="mt-4 text-[13px] text-gray-400 font-medium">— BrightLocal Consumer Survey, 2024</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            {[
              { stat: '88%', label: 'of customers research a business online before visiting' },
              { stat: '76%', label: 'of people who search nearby visit within 24 hours' },
              { stat: '70%', label: 'judge credibility based on digital presence alone' },
              { stat: '5x', label: 'more leads with a professional profile vs word-of-mouth' },
            ].map((item) => (
              <div key={item.stat} className="text-center p-5 bg-white rounded-2xl border border-gray-100">
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{item.stat}</p>
                <p className="mt-2 text-[12px] text-gray-500 leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Why it matters */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Why your online presence matters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Your customers are searching right now',
                  desc: 'When someone needs a doctor, restaurant, or consultant, they search online first. Without a profile, they find your competitor instead.',
                },
                {
                  title: 'First impressions are digital',
                  desc: 'Before walking in or calling, people check your services, photos, reviews, and location online. A professional presence builds instant trust.',
                },
                {
                  title: 'WhatsApp and QR are the new business card',
                  desc: 'Paper cards get lost. A shareable digital profile with one-tap WhatsApp and QR code ensures customers always find you.',
                },
                {
                  title: 'Track what works, grow faster',
                  desc: 'Know exactly who visits your profile, which services they view, and where they come from. Make smarter decisions with real data.',
                },
              ].map((item) => (
                <div key={item.title} className="p-5 bg-white rounded-xl border border-gray-100">
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Ready to create your own?</h2>
          <p className="mt-3 text-gray-500 text-[15px]">
            Set up a professional microsite for your business in under 5 minutes. No credit card required.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 h-11 px-7 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[14px] font-medium rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
            >
              Create My Business Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/roi-calculator"
              className="inline-flex items-center justify-center gap-2 h-11 px-7 border border-gray-200 text-gray-700 text-[14px] font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Calculate Your Savings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


function CategoryCard({ category }: { category: IndustryCategoryCard }) {
  const IconComponent = iconMap[category.icon] || Briefcase;
  const isAvailable = category.demoUrl !== null;

  const cardContent = (
    <div
      className={`group relative bg-white rounded-2xl p-6 border border-gray-100 flex flex-col h-full transition-all duration-300 ${
        isAvailable
          ? 'hover:shadow-xl hover:-translate-y-1 hover:border-gray-200 cursor-pointer'
          : 'opacity-60'
      }`}
    >
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-6 right-6 h-1 rounded-b-full transition-all duration-300 group-hover:left-4 group-hover:right-4"
        style={{ backgroundColor: category.colorScheme.primary }}
      />

      <div className="flex items-start gap-4 mb-4 mt-2">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${category.colorScheme.primary}12` }}
        >
          <IconComponent
            className="w-6 h-6"
            style={{ color: category.colorScheme.primary }}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="text-[16px] font-bold text-gray-900 leading-tight">{category.name}</h3>
          {/* Brand name */}
          {category.brandName && (
            <p className="text-[12px] font-medium mt-0.5 truncate" style={{ color: category.colorScheme.secondary }}>
              {category.brandName}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-500 text-[13px] leading-relaxed mb-5 flex-grow line-clamp-3">
        {category.description}
      </p>

      {/* Footer */}
      {isAvailable ? (
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors" style={{ color: category.colorScheme.primary }}>
            <Eye className="w-4 h-4" />
            View Live Demo
          </span>
          <ArrowRight
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: category.colorScheme.primary }}
          />
        </div>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
          Coming Soon
        </span>
      )}
    </div>
  );

  if (isAvailable && category.demoUrl) {
    return (
      <Link href={category.demoUrl} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
