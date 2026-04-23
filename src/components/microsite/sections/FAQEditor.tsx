'use client';

import { useState } from 'react';
import { HelpCircle, Plus, Trash2, GripVertical, Search } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  categories?: string[];
  showSearch?: boolean;
}

interface FAQEditorProps {
  config: FAQConfig;
  onChange: (config: FAQConfig) => void;
}

export default function FAQEditor({ config, onChange }: FAQEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState('');

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const addFAQItem = () => {
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
      category: config.categories?.[0] || '',
    };
    handleChange('items', [...(config.items || []), newItem]);
  };

  const removeFAQItem = (index: number) => {
    handleChange('items', config.items.filter((_, i) => i !== index));
  };

  const updateFAQItem = (index: number, field: string, value: string) => {
    const newItems = [...config.items];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('items', newItems);
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
            <HelpCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">FAQ Section</h3>
            <p className="text-sm text-gray-400">Add frequently asked questions</p>
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
                placeholder="Frequently Asked Questions"
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Section Subtitle</label>
              <input
                type="text"
                value={config.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Find answers to common questions"
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Show Search Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
            <div>
              <p className="text-white font-medium">Enable Search</p>
              <p className="text-sm text-gray-400">Allow visitors to search FAQ items</p>
            </div>
            <Toggle
              enabled={config.showSearch || false}
              onChange={(enabled) => handleChange('showSearch', enabled)}
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Categories (Optional)</label>
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
                className="flex-1 bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
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

          {/* FAQ Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-400">Questions ({config.items?.length || 0})</h4>
              <button
                onClick={addFAQItem}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Question
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
                    className={`bg-gray-900/50 border border-gray-800 rounded-xl p-4 ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="cursor-move text-gray-600 hover:text-gray-400 mt-2">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => updateFAQItem(index, 'question', e.target.value)}
                          placeholder="Question..."
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                        <textarea
                          value={item.answer}
                          onChange={(e) => updateFAQItem(index, 'answer', e.target.value)}
                          placeholder="Answer..."
                          rows={3}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                        />
                        {(config.categories || []).length > 0 && (
                          <select
                            value={item.category || ''}
                            onChange={(e) => updateFAQItem(index, 'category', e.target.value)}
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                          >
                            <option value="">No Category</option>
                            {(config.categories || []).map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      <button
                        onClick={() => removeFAQItem(index)}
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
                <HelpCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No FAQ items added yet</p>
                <button
                  onClick={addFAQItem}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Question
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
