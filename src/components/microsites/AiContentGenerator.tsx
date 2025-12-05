"use client";

import { useState } from 'react';

interface AiContentGeneratorProps {
  fieldType: string; // e.g., 'Headline', 'About Section'
  onSelectSuggestion: (suggestion: string) => void;
  onClose: () => void;
}

const tones = ['Professional', 'Friendly', 'Witty', 'Persuasive', 'Casual'];

export function AiContentGenerator({
  fieldType,
  onSelectSuggestion,
  onClose,
}: AiContentGeneratorProps) {
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Professional');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      setError('Please enter some keywords about your business.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords, tone, fieldType }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions. Please try again.');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">✨ Generate {fieldType} with AI</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
              Keywords (e.g., "luxury car detailing in Miami")
            </label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="Describe your business or what you want to write..."
            />
          </div>
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
              Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            >
              {tones.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
          <button onClick={handleGenerate} disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        {suggestions.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold">Suggestions:</h3>
            <ul className="mt-2 space-y-2">
              {suggestions.map((s, i) => (
                <li key={i} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                  <p className="text-gray-800">{s.replace(/^Generated suggestion \d+: /, '')}</p>
                  <button onClick={() => onSelectSuggestion(s.replace(/^Generated suggestion \d+: /, ''))} className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200">
                    Use
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}