'use client';

import React, { useState } from 'react';
import CategorySelector from './CategorySelector';

interface OnboardingStep0Props {
  onComplete: (categoryId: string | null) => void;
  initialData?: string | null;
}

export default function OnboardingStep0({ onComplete, initialData }: OnboardingStep0Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialData || null);

  const handleContinue = () => {
    onComplete(selectedCategory);
  };

  const handleSkip = () => {
    onComplete(null);
  };

  return (
    <div>
      <CategorySelector
        selectedCategory={selectedCategory || undefined}
        onSelect={setSelectedCategory}
        onSkip={handleSkip}
      />

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleContinue}
          disabled={!selectedCategory}
          className="px-8 py-3 bg-primary-600 dark:bg-primary-500 text-white dark:text-neutral-900 rounded-lg font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
