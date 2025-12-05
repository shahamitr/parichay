// @ts-nocheck
'use client';

import React from 'react';
import { industryCategories } from '@/data/categories';
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
  Gavel
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'briefcase': Briefcase,
  'building-2': Building2,
  'calendar-check': CalendarCheck,
  'user-check': UserCheck,
  'graduation-cap': GraduationCap,
  'palette': Palette,
  'home': Home,
  'stethoscope': Stethoscope,
  'utensils': Utensils,
  'dumbbell': Dumbbell,
  'scale': Scale,
  'gavel': Gavel,
};

export default function IndustryCategoriesSection() {
  const enabledCategories = industryCategories.filter(cat => cat.enabled);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tailored for Your Industry
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from industry-specific templates and features designed to showcase your unique professional identity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enabledCategories.map((category) => {
            const IconComponent = iconMap[category.icon] || Briefcase;

            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                style={{
                  borderTop: `4px solid ${category.colorScheme.primary}`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: `${category.colorScheme.primary}15`,
                  }}
                >
                  <IconComponent
                    className="w-8 h-8"
                    style={{ color: category.colorScheme.primary }}
                  />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {category.name}
                </h3>

                <p className="text-gray-600 mb-6">
                  {category.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {category.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <svg
                          className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                          style={{ color: category.colorScheme.primary }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    className={`py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg text-sm ${category.demoUrl ? 'flex-1' : 'w-full'}`}
                    style={{
                      backgroundColor: category.colorScheme.primary,
                    }}
                    onClick={() => {
                      window.location.href = `/register?category=${category.slug}`;
                    }}
                  >
                    Get Started
                  </button>
                  {category.demoUrl && (
                    <button
                      className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg text-sm border-2"
                      style={{
                        borderColor: category.colorScheme.primary,
                        color: category.colorScheme.primary,
                      }}
                      onClick={() => {
                        window.open(category.demoUrl, '_blank');
                      }}
                    >
                      View Demo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Not sure which category fits you best? No problem!
          </p>
          <button
            className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            onClick={() => {
              window.location.href = '/register';
            }}
          >
            Explore All Templates
          </button>
        </div>
      </div>
    </section>
  );
}
