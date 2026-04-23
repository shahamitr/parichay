'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Search, Star, Crown, Eye, Palette } from 'lucide-react';
import { industryTemplates, templateCategories } from '@/data/industry-templates';
import { MicrositeTemplate } from '@/types/template';

interface IndustryTemplateSelectorProps {
  onSelectTemplate: (template: MicrositeTemplate) => void;
  selectedCategory?: string;
}

export default function IndustryTemplateSelector({
  onSelectTemplate,
  selectedCategory
}: IndustryTemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // Filter templates based on search, category, and premium status
  const filteredTemplates = industryTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    const matchesPremium = !showPremiumOnly || template.isPremium;

    return matchesSearch && matchesCategory && matchesPremium;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Industry Template</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get started quickly with professionally designed templates tailored for your business type.
          Each template includes sample content, images, and industry-specific features.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showPremiumOnly ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowPremiumOnly(!showPremiumOnly)}
            className="flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Premium Only
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={activeCategory === 'all' ? "primary" : "outline"}
          size="sm"
          onClick={() => setActiveCategory('all')}
          className="flex items-center gap-2"
        >
          <Palette className="w-4 h-4" />
          All Templates ({industryTemplates.length})
        </Button>

        {templateCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="flex items-center gap-2"
          >
            <span>{category.icon}</span>
            {category.name} ({category.count})
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="relative">
              {/* Template Preview Image */}
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl opacity-20">
                  {templateCategories.find(cat => cat.id === template.category)?.icon || '🏢'}
                </div>

                {/* Premium Badge */}
                {template.isPremium && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-white flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </Badge>
                )}

                {/* Preview Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                  <Button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {templateCategories.find(cat => cat.id === template.category)?.name || template.category}
                  </Badge>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-medium text-gray-700">Key Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                        {feature}
                      </Badge>
                    ))}
                    {template.features.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        +{template.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => onSelectTemplate(template)}
                    className="flex-1"
                    size="sm"
                  >
                    Use Template
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3"
                    onClick={() => {
                      // Preview functionality
                      console.log('Preview template:', template.id);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or category filters.
          </p>
        </div>
      )}

      {/* Template Stats */}
      <div className="text-center text-sm text-gray-500 border-t pt-4">
        Showing {filteredTemplates.length} of {industryTemplates.length} templates
        {activeCategory !== 'all' && (
          <span> in {templateCategories.find(cat => cat.id === activeCategory)?.name}</span>
        )}
      </div>
    </div>
  );
}