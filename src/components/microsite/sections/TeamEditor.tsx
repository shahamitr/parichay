'use client';

import { useState } from 'react';
import { Users, Plus, Trash2, GripVertical, Upload, Loader2 } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  email?: string;
  phone?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

interface TeamConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  members: TeamMember[];
  layout?: 'grid' | 'list';
}

interface TeamEditorProps {
  config: TeamConfig;
  onChange: (config: TeamConfig) => void;
}

export default function TeamEditor({ config, onChange }: TeamEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const addMember = () => {
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: '',
      role: '',
      bio: '',
      social: {},
    };
    handleChange('members', [...(config.members || []), newMember]);
  };

  const removeMember = (index: number) => {
    handleChange('members', config.members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: string, value: any) => {
    const newMembers = [...config.members];
    if (field.startsWith('social.')) {
      const socialField = field.replace('social.', '');
      newMembers[index] = {
        ...newMembers[index],
        social: { ...newMembers[index].social, [socialField]: value },
      };
    } else {
      newMembers[index] = { ...newMembers[index], [field]: value };
    }
    handleChange('members', newMembers);
  };

  const handlePhotoUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'team');
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      updateMember(index, 'photo', data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newMembers = [...config.members];
    const [dragged] = newMembers.splice(draggedIndex, 1);
    newMembers.splice(index, 0, dragged);
    handleChange('members', newMembers);
    setDraggedIndex(index);
  };
  const handleDragEnd = () => setDraggedIndex(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Users className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Team Section</h3>
            <p className="text-sm text-gray-400">Showcase your team members</p>
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
                placeholder="Meet Our Team"
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Section Subtitle</label>
              <input
                type="text"
                value={config.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="The people behind our success"
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Layout Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Layout</label>
            <div className="flex gap-3">
              <button
                onClick={() => handleChange('layout', 'grid')}
                className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${
                  (config.layout || 'grid') === 'grid'
                    ? 'bg-amber-500 border-amber-500 text-gray-900'
                    : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                Grid Layout
              </button>
              <button
                onClick={() => handleChange('layout', 'list')}
                className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${
                  config.layout === 'list'
                    ? 'bg-amber-500 border-amber-500 text-gray-900'
                    : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                List Layout
              </button>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-400">Team Members ({config.members?.length || 0})</h4>
              <button
                onClick={addMember}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>

            {config.members && config.members.length > 0 ? (
              <div className="space-y-4">
                {config.members.map((member, index) => (
                  <div
                    key={member.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-gray-900/50 border border-gray-800 rounded-xl p-4 ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="cursor-move text-gray-600 hover:text-gray-400 mt-2">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      {/* Photo */}
                      <div className="flex-shrink-0">
                        {member.photo ? (
                          <div className="relative group">
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg cursor-pointer transition-opacity">
                              <Upload className="w-5 h-5 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handlePhotoUpload(index, e.target.files[0])}
                                className="hidden"
                                disabled={uploadingIndex === index}
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                            {uploadingIndex === index ? (
                              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                            ) : (
                              <Upload className="w-5 h-5 text-gray-500" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files?.[0] && handlePhotoUpload(index, e.target.files[0])}
                              className="hidden"
                              disabled={uploadingIndex === index}
                            />
                          </label>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => updateMember(index, 'name', e.target.value)}
                            placeholder="Name"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                          />
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => updateMember(index, 'role', e.target.value)}
                            placeholder="Role/Title"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                          />
                        </div>
                        <textarea
                          value={member.bio || ''}
                          onChange={(e) => updateMember(index, 'bio', e.target.value)}
                          placeholder="Short bio..."
                          rows={2}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="email"
                            value={member.email || ''}
                            onChange={(e) => updateMember(index, 'email', e.target.value)}
                            placeholder="Email (optional)"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                          />
                          <input
                            type="tel"
                            value={member.phone || ''}
                            onChange={(e) => updateMember(index, 'phone', e.target.value)}
                            placeholder="Phone (optional)"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="url"
                            value={member.social?.linkedin || ''}
                            onChange={(e) => updateMember(index, 'social.linkedin', e.target.value)}
                            placeholder="LinkedIn URL"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                          />
                          <input
                            type="url"
                            value={member.social?.twitter || ''}
                            onChange={(e) => updateMember(index, 'social.twitter', e.target.value)}
                            placeholder="Twitter URL"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                          />
                          <input
                            type="url"
                            value={member.social?.facebook || ''}
                            onChange={(e) => updateMember(index, 'social.facebook', e.target.value)}
                            placeholder="Facebook URL"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => removeMember(index)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-900/30 border-2 border-dashed border-gray-800 rounded-xl">
                <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No team members added yet</p>
                <button
                  onClick={addMember}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Team Member
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
