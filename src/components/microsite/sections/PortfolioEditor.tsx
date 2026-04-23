'use client';

import { useState } from 'react';
import { Briefcase, Plus, Trash2, GripVertical, Upload, Loader2, Star, X } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  images: string[];
  videoUrl?: string;
  clientName?: string;
  projectDate?: string;
  tags: string[];
  featured: boolean;
  link?: string;
}

interface PortfolioConfig {
  enabled: boolean;
  layout: 'grid' | 'masonry' | 'carousel';
  items: PortfolioItem[];
  categories: string[];
}

interface PortfolioEditorProps {
  config: PortfolioConfig;
  onChange: (config: PortfolioConfig) => void;
}

export default function PortfolioEditor({ config, onChange }: PortfolioEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const addItem = () => {
    const newItem: PortfolioItem = {
      id: `portfolio-${Date.now()}`,
      title: '',
      description: '',
      category: config.categories?.[0] || '',
      images: [],
      tags: [],
      featured: false,
    };
    handleChange('items', [...(config.items || []), newItem]);
    setExpandedId(newItem.id);
  };

  const removeItem = (index: number) => {
    handleChange('items', config.items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...config.items];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('items', newItems);
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'portfolio');
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      const currentImages = config.items[index].images || [];
      updateItem(index, 'images', [...currentImages, data.url]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const removeImage = (itemIndex: number, imageIndex: number) => {
    const item = config.items[itemIndex];
    const newImages = item.images.filter((_, i) => i !== imageIndex);
    updateItem(itemIndex, 'images', newImages);
  };

  const addCategory = () => {
    if (newCategory.trim() && !(config.categories || []).includes(newCategory.trim())) {
      handleChange('categories', [...(config.categories || []), newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    handleChange('categories', (config.categories || []).filter(c => c !== category));
  };

  const addTag = (itemIndex: number) => {
    const tag = newTag[config.items[itemIndex].id]?.trim();
    if (tag && !config.items[itemIndex].tags.includes(tag)) {
      updateItem(itemIndex, 'tags', [...config.items[itemIndex].tags, tag]);
      setNewTag({ ...newTag, [config.items[itemIndex].id]: '' });
    }
  };

  const removeTag = (itemIndex: number, tagIndex: number) => {
    const item = config.items[itemIndex];
    updateItem(itemIndex, 'tags', item.tags.filter((_, i) => i !== tagIndex));
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newItems = [...config.items];
    const [dragged] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, dragged);
    handleChange('items', newItems);
    setDraggedIndex(index);
  };
  const handleDragEnd = () => setDraggedIndex(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Briefcase className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Portfolio</h3>
            <p className="text-sm text-gray-400">Showcase your work and projects</p>
          </div>
        </div>
        <Toggle
          enabled={config.enabled}
          onChange={(enabled) => handleChange('enabled', enabled)}
        />
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Layout Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Layout</label>
            <div className="flex gap-3">
              {['grid', 'masonry', 'carousel'].map((layout) => (
                <button
                  key={layout}
                  onClick={() => handleChange('layout', layout)}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                    config.layout === layout
                      ? 'bg-amber-500 border-amber-500 text-gray-900'
                      : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {layout}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(config.categories || []).map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                >
                  {category}
                  <button
                    onClick={() => removeCategory(category)}
                    className="text-gray-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add category..."
                className="flex-1 bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              />
              <button
                onClick={addCategory}
                className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Add
              </button>
            </div>
          </div>

          {/* Portfolio Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-400">Projects ({config.items?.length || 0})</h4>
              <button
                onClick={addItem}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>

            {config.items && config.items.length > 0 ? (
              <div className="space-y-4">
                {config.items.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    {/* Header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/30"
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="cursor-move text-gray-600 hover:text-gray-400" onClick={(e) => e.stopPropagation()}>
                          <GripVertical className="w-4 h-4" />
                        </div>
                        {item.images[0] && (
                          <img src={item.images[0]} alt="" className="w-12 h-12 rounded object-cover" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{item.title || 'Untitled Project'}</p>
                            {item.featured && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                          </div>
                          <p className="text-sm text-gray-500">{item.category || 'No category'}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === item.id && (
                      <div className="p-4 pt-0 space-y-4 border-t border-gray-800">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Project Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateItem(index, 'title', e.target.value)}
                              placeholder="Project name"
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Category</label>
                            <select
                              value={item.category}
                              onChange={(e) => updateItem(index, 'category', e.target.value)}
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                            >
                              <option value="">Select category</option>
                              {(config.categories || []).map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Description</label>
                          <textarea
                            value={item.description || ''}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Project description..."
                            rows={3}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Client Name</label>
                            <input
                              type="text"
                              value={item.clientName || ''}
                              onChange={(e) => updateItem(index, 'clientName', e.target.value)}
                              placeholder="Client name"
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Project Date</label>
                            <input
                              type="date"
                              value={item.projectDate || ''}
                              onChange={(e) => updateItem(index, 'projectDate', e.target.value)}
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Project Link</label>
                          <input
                            type="url"
                            value={item.link || ''}
                            onChange={(e) => updateItem(index, 'link', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                          />
                        </div>

                        {/* Images */}
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Images</label>
                          <div className="flex flex-wrap gap-2">
                            {item.images.map((img, imgIndex) => (
                              <div key={imgIndex} className="relative group">
                                <img src={img} alt="" className="w-20 h-20 rounded-lg object-cover" />
                                <button
                                  onClick={() => removeImage(index, imgIndex)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            <label className="w-20 h-20 bg-gray-800 border border-dashed border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                              {uploadingIndex === index ? (
                                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                              ) : (
                                <Plus className="w-5 h-5 text-gray-500" />
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])}
                                className="hidden"
                                disabled={uploadingIndex === index}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Tags</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                                {tag}
                                <button onClick={() => removeTag(index, tagIndex)} className="text-gray-500 hover:text-red-400">×</button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newTag[item.id] || ''}
                              onChange={(e) => setNewTag({ ...newTag, [item.id]: e.target.value })}
                              placeholder="Add tag..."
                              className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                              onKeyDown={(e) => e.key === 'Enter' && addTag(index)}
                            />
                            <button onClick={() => addTag(index)} className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm">Add</button>
                          </div>
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center gap-2">
                          <Toggle
                            enabled={item.featured}
                            onChange={(enabled) => updateItem(index, 'featured', enabled)}
                          />
                          <span className="text-sm text-gray-400">Featured Project</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-900/30 border-2 border-dashed border-gray-800 rounded-xl">
                <Briefcase className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No portfolio items yet</p>
                <button
                  onClick={addItem}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Project
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
