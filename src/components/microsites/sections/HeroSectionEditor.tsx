"use client";

import { useState } from 'react';
import { AiContentGenerator } from '../AiContentGenerator';

// Mock props for demonstration. In a real app, these would come from a parent component.
interface HeroSectionEditorProps {
  initialHeadline?: string;
  initialSubheadline?: string;
  onSave: (data: { headline: string; subheadline: string }) => void;
}

export function HeroSectionEditor({
  initialHeadline = 'Welcome to Our Business',
  initialSubheadline = 'Your success is our priority.',
  onSave
}: HeroSectionEditorProps) {
  const [headline, setHeadline] = useState(initialHeadline);
  const [subheadline, setSubheadline] = useState(initialSubheadline);
  const [showAiGenerator, setShowAiGenerator] = useState(false);

  const handleSelectSuggestion = (suggestion: string) => {
    setHeadline(suggestion);
    setShowAiGenerator(false);
  };

  return (
    <>
      <div className="p-6 bg-gray-50 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
              Headline
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
              <button
                type="button"
                onClick={() => setShowAiGenerator(true)}
                className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                ✨ Generate with AI
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="subheadline" className="block text-sm font-medium text-gray-700">
              Subheadline
            </label>
            <input
              type="text"
              id="subheadline"
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>
        </div>
      </div>
      {showAiGenerator && <AiContentGenerator fieldType="Headline" onSelectSuggestion={handleSelectSuggestion} onClose={() => setShowAiGenerator(false)} />}
    </>
  );
}