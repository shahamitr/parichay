'use client';

import { MessageSquare } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';

interface FeedbackConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  showRating?: boolean;
  showMessage?: boolean;
  requireEmail?: boolean;
  requirePhone?: boolean;
  thankYouMessage?: string;
}

interface FeedbackEditorProps {
  config: FeedbackConfig;
  onChange: (config: FeedbackConfig) => void;
}

export default function FeedbackEditor({ config, onChange }: FeedbackEditorProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <MessageSquare className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Feedback Section</h3>
            <p className="text-sm text-gray-400">Collect feedback from visitors</p>
          </div>
        </div>
        <Toggle
          enabled={config.enabled}
          onChange={(enabled) => handleChange('enabled', enabled)}
        />
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Title & Subtitle */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Section Title</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Share Your Feedback"
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Section Subtitle</label>
              <input
                type="text"
                value={config.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="We value your opinion"
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          {/* Form Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400">Form Options</h4>

            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
              <div>
                <p className="text-white font-medium">Show Rating</p>
                <p className="text-sm text-gray-500">Allow visitors to rate with stars</p>
              </div>
              <Toggle
                enabled={config.showRating !== false}
                onChange={(enabled) => handleChange('showRating', enabled)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
              <div>
                <p className="text-white font-medium">Show Message Field</p>
                <p className="text-sm text-gray-500">Allow visitors to write feedback</p>
              </div>
              <Toggle
                enabled={config.showMessage !== false}
                onChange={(enabled) => handleChange('showMessage', enabled)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
              <div>
                <p className="text-white font-medium">Require Email</p>
                <p className="text-sm text-gray-500">Make email field mandatory</p>
              </div>
              <Toggle
                enabled={config.requireEmail || false}
                onChange={(enabled) => handleChange('requireEmail', enabled)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
              <div>
                <p className="text-white font-medium">Require Phone</p>
                <p className="text-sm text-gray-500">Make phone field mandatory</p>
              </div>
              <Toggle
                enabled={config.requirePhone || false}
                onChange={(enabled) => handleChange('requirePhone', enabled)}
              />
            </div>
          </div>

          {/* Thank You Message */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Thank You Message</label>
            <textarea
              value={config.thankYouMessage || ''}
              onChange={(e) => handleChange('thankYouMessage', e.target.value)}
              placeholder="Thank you for your feedback! We appreciate your input."
              rows={3}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Message shown after feedback is submitted</p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-400 mb-2">About Feedback</h4>
            <ul className="text-sm text-blue-300/80 space-y-1 list-disc list-inside">
              <li>Feedback is stored and can be viewed in your dashboard</li>
              <li>You'll receive notifications for new feedback</li>
              <li>Positive feedback can be featured as testimonials</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
