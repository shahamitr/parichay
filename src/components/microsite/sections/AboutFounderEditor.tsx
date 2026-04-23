'use client';

import { useState } from 'react';
import { User, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';

interface AboutFounderConfig {
  enabled: boolean;
  name?: string;
  title?: string;
  photo?: string;
  bio?: string;
  achievements?: string[];
  education?: string;
  experience?: string;
  quote?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    email?: string;
  };
}

interface AboutFounderEditorProps {
  config: AboutFounderConfig;
  onChange: (config: AboutFounderConfig) => void;
}

export default function AboutFounderEditor({ config, onChange }: AboutFounderEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [newAchievement, setNewAchievement] = useState('');

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('socialLinks.')) {
      const socialField = field.replace('socialLinks.', '');
      onChange({
        ...config,
        socialLinks: { ...config.socialLinks, [socialField]: value },
      });
    } else {
      onChange({ ...config, [field]: value });
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'team');
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      handleChange('photo', data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      handleChange('achievements', [...(config.achievements || []), newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    handleChange('achievements', (config.achievements || []).filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <User className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">About Founder</h3>
            <p className="text-sm text-gray-400">Tell your personal story</p>
          </div>
        </div>
        <Toggle
          enabled={config.enabled}
          onChange={(enabled) => handleChange('enabled', enabled)}
        />
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Photo Upload */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {config.photo ? (
                <div className="relative group">
                  <img
                    src={config.photo}
                    alt="Founder"
                    className="w-32 h-32 rounded-xl object-cover"
                  />
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl cursor-pointer transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              ) : (
                <label className="w-32 h-32 bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs text-gray-500">Upload Photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={config.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title / Role</label>
                <input
                  type="text"
                  value={config.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Founder & CEO"
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
            <textarea
              value={config.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell your story..."
              rows={4}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
          </div>

          {/* Quote */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Personal Quote (Optional)</label>
            <input
              type="text"
              value={config.quote || ''}
              onChange={(e) => handleChange('quote', e.target.value)}
              placeholder="&quot;Your inspiring quote here...&quot;"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Experience & Education */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Experience</label>
              <input
                type="text"
                value={config.experience || ''}
                onChange={(e) => handleChange('experience', e.target.value)}
                placeholder="e.g. 15+ years in industry"
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Education</label>
              <input
                type="text"
                value={config.education || ''}
                onChange={(e) => handleChange('education', e.target.value)}
                placeholder="e.g. MBA from Harvard"
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Key Achievements</label>
            <div className="space-y-2 mb-2">
              {(config.achievements || []).map((achievement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm">
                    {achievement}
                  </span>
                  <button
                    onClick={() => removeAchievement(index)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Add an achievement..."
                className="flex-1 bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                onKeyDown={(e) => e.key === 'Enter' && addAchievement()}
              />
              <button
                onClick={addAchievement}
                className="inline-flex items-center gap-1 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Social Links</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={config.socialLinks?.linkedin || ''}
                  onChange={(e) => handleChange('socialLinks.linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Twitter</label>
                <input
                  type="url"
                  value={config.socialLinks?.twitter || ''}
                  onChange={(e) => handleChange('socialLinks.twitter', e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Instagram</label>
                <input
                  type="url"
                  value={config.socialLinks?.instagram || ''}
                  onChange={(e) => handleChange('socialLinks.instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={config.socialLinks?.email || ''}
                  onChange={(e) => handleChange('socialLinks.email', e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
