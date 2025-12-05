'use client';

import { AboutSection } from '@/types/microsite';

interface AboutEditorProps {
  config: AboutSection;
  onChange: (data: AboutSection) => void;
}

export default function AboutEditor({ config, onChange }: AboutEditorProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Tell your story and connect with your audience
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable About Section</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Show or hide this section on your microsite
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      {config.enabled && (
        <>
          {/* Content Editor */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              About Content *
            </label>
            <textarea
              value={config.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Tell your story... Who you are, what you do, why you're different..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm placeholder-gray-400 dark:placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {config.content?.length || 0} characters
            </p>
          </div>

          {/* Formatting Toolbar */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Formatting Guide</h4>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p><strong>**Bold text**</strong> → <strong>Bold text</strong></p>
              <p><em>*Italic text*</em> → <em>Italic text</em></p>
              <p>- Bullet point → • Bullet point</p>
              <p>1. Numbered list → 1. Numbered list</p>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </label>
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="prose dark:prose-invert max-w-none">
                {config.content ? (
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                    {config.content}
                  </p>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">
                    Your about content will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 About Section Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Start with your mission or unique value proposition</li>
              <li>Keep it concise - aim for 150-300 words</li>
              <li>Use storytelling to connect emotionally</li>
              <li>Highlight what makes you different</li>
              <li>Include your experience and credentials</li>
              <li>End with a call-to-action or next step</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
