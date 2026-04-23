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
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Industry Demo Catalog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore live demos tailored to your industry. See exactly how Parichay works for your business type.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search industries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 font-medium">No industries match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((category) => (
              <CategoryCard key={category.categoryId} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


function CategoryCard({ category }: { category: IndustryCategoryCard }) {
  const IconComponent = iconMap[category.icon] || Briefcase;
  const isAvailable = category.demoUrl !== null;

  const cardContent = (
    <div
      className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 flex flex-col h-full transition-all duration-300 ${
        isAvailable
          ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
          : 'opacity-70'
      }`}
      style={{ borderTop: `4px solid ${category.colorScheme.primary}` }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
        style={{ backgroundColor: `${category.colorScheme.primary}15` }}
      >
        <IconComponent
          className="w-7 h-7"
          style={{ color: category.colorScheme.primary }}
        />
      </div>

      {/* Name & brand */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
      {category.brandName && (
        <p
          className="text-sm font-medium mb-3"
          style={{ color: category.colorScheme.secondary }}
        >
          {category.brandName}
        </p>
      )}

      {/* Description */}
      <p className="text-gray-600 text-sm mb-6 flex-grow">
        {category.description}
      </p>

      {/* Footer */}
      {isAvailable ? (
        <span
          className="inline-flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: category.colorScheme.primary }}
        >
          View Demo →
        </span>
      ) : (
        <span className="inline-flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400">
          Coming Soon
        </span>
      )}
    </div>
  );

  if (isAvailable && category.demoUrl) {
    return (
      <Link href={category.demoUrl} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
