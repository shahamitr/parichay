'use client';

import React, { useState, useEffect } from 'react';
import { micrositeTemplates, MicrositeTemplate } from '@/data/templates';
import { industryCategories } from '@/data/categories';
import TemplateCard from './TemplateCard';
import { Search, Filter } from 'lucide-react';

interface TemplateGalleryProps {
  onSelectTemplate?: (template: MicrositeTemplate) => void;
  selectedCategoryId?: string;
}

export default function TemplateGallery({
  onSelectTemplate,
  selectedCategoryId
}: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<MicrositeTemplate[]>(micrositeTemplates);
  const [filteredTemplates, setFilteredTemplates] = useState<MicrositeTemplate[]>(micrositeTemplates);
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategoryId || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let filtered = templates;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery != null) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTemplates(filtered);
  }, [selectedCategory, searchQuery, templates]);

  const categories = [
    { id: 'all', name: 'All Templates' },
    ...industryCategories.filter(cat => cat.enabled),
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Template
        </h2>
        <p className="text-gray-600">
          Select a professionally designed template that matches your industry
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="text-gray-400 w-5 h-5 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
                ${selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={onSelectTemplate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No templates found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
