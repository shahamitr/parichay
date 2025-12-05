'use client';

import DynamicFieldArray from '../DynamicFieldArray';
import { VideosSection } from '@/types/microsite';
import { Video, Youtube, Upload } from 'lucide-react';

interface VideosEditorProps {
  config: VideosSection;
  onChange: (data: VideosSection) => void;
}

export default function VideosEditor({ config, onChange }: VideosEditorProps) {
  const handleVideosChange = (videos: string[]) => {
    onChange({
      ...config,
      videos,
    });
  };

  const handleToggle = (enabled: boolean) => {
    onChange({
      ...config,
      enabled,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Videos Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Add YouTube, Vimeo, or uploaded video links to engage your visitors
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Videos Section</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Show or hide this section on your microsite
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      {config.enabled && (
        <>
          {/* Video URLs */}
          <DynamicFieldArray
            label="Video URLs"
            values={config.videos || []}
            onChange={handleVideosChange}
            type="url"
            placeholder="Enter video URL"
            maxItems={20}
            helpText="Add YouTube, Vimeo, or direct video file URLs"
          />

          {/* Supported Formats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Youtube className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h4 className="text-sm font-medium text-red-900 dark:text-red-300">YouTube</h4>
              </div>
              <p className="text-xs text-red-700 dark:text-red-400">
                https://youtube.com/watch?v=...
                <br />
                https://youtu.be/...
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">Vimeo</h4>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                https://vimeo.com/...
                <br />
                https://player.vimeo.com/...
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h4 className="text-sm font-medium text-purple-900 dark:text-purple-300">Direct Upload</h4>
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-400">
                .mp4, .webm, .ogg files
                <br />
                (Upload via file manager)
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Video Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Keep videos under 5 minutes for better engagement</li>
              <li>Add captions or subtitles for accessibility</li>
              <li>Use YouTube for better performance and SEO</li>
              <li>Create a compelling thumbnail for each video</li>
              <li>Include a mix of: product demos, testimonials, behind-the-scenes</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
