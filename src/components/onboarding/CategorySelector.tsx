// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { industryCategories } from '@/data/categories';
import {
  Briefcase,
  Building2,
  CalendarCheck,
  UserCheck,
  GraduationCap,
  Palette,
  Check
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'briefcase': Briefcase,
  'building-2': Building2,
  'calendar-check': CalendarCheck,
  'user-check': UserCheck,
  'graduation-cap': GraduationCap,
  'palette': Palette,
};

interface CategorySelectorProps {
  selectedCategory?: string;
  onSelect: (categoryId: string | null) => void;
  onSkip?: () => void;
}

export default function CategorySelector({
  selectedCategory,
  onSelect,
  onSkip
}: CategorySelectorProps) {
  const [selected, setSelected] = useState<string | null>(selectedCategory || null);
  const enabledCategories = industryCategories.filter(cat => cat.enabled);

  const handleSelect = (categoryId: string) => {
    const newSelection = selected === categoryId ? null : categoryId;
    setSelected(newSelection);
    onSelect(newSelection);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Choose Your Industry
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select your industry to get personalized templates and features. You can always change this later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {enabledCategories.map((category) => {
          const IconComponent = iconMap[category.icon] || Briefcase;
          const isSelected = selected === category.id;

          return (
            <button
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`
                relative bg-white rounded-xl p-6 text-left transition-all duration-200
                border-2 hover:shadow-lg
                ${isSelected
                  ? 'border-blue-600 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{
                  backgroundColor: `${category.colorScheme.primary}15`,
                }}
              >
                <IconComponent
                  className="w-6 h-6"
                  style={{ color: category.colorScheme.primary }}
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {category.name}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {category.description}
              </p>

              <div className="space-y-1">
                {category.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-start text-xs text-gray-500">
                    <svg
                      className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5"
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
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {onSkip && (
        <div className="text-center">
          <button
            onClick={onSkip}
            className="text-gray-600 hover:text-gray-900 font-medium underline"
          >
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
}
