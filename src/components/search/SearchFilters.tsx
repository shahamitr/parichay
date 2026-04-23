'use client';

import React from 'react';
import { Filter, X, MapPin, DollarSign, Building, Tag } from 'lucide-react';

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    category: string;
    businessType: string;
    priceRange: string;
    radius: number;
  };
  onFiltersChange: (filters: any) => void;
  hasLocation: boolean;
}

const serviceCategories = [
  { value: '', label: 'All Categories', icon: '🏢' },
  { value: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { value: 'electrical', label: 'Electrical', icon: '⚡' },
  { value: 'beauty', label: 'Beauty & Salon', icon: '💄' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'automotive', label: 'Automotive', icon: '🚗' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'fitness', label: 'Fitness & Gym', icon: '💪' },
  { value: 'legal', label: 'Legal Services', icon: '⚖️' },
  { value: 'real estate', label: 'Real Estate', icon: '🏠' },
  { value: 'photography', label: 'Photography', icon: '📸' },
  { value: 'catering', label: 'Catering', icon: '🍰' },
  { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { value: 'construction', label: 'Construction', icon: '🏗️' },
  { value: 'consulting', label: 'Consulting', icon: '💡' },
  { value: 'home services', label: 'Home Services', icon: '🏠' },
  { value: 'pet services', label: 'Pet Services', icon: '🐕' },
  { value: 'travel', label: 'Travel & Tourism', icon: '✈️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎭' },
];

const businessTypes = [
  { value: '', label: 'All Types', icon: '🏢' },
  { value: 'service', label: 'Services', icon: '🔧' },
  { value: 'retail', label: 'Retail', icon: '🛍️' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'automotive', label: 'Automotive', icon: '🚗' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'fitness', label: 'Fitness & Gym', icon: '💪' },
  { value: 'legal', label: 'Legal Services', icon: '⚖️' },
  { value: 'real estate', label: 'Real Estate', icon: '🏠' },
  { value: 'photography', label: 'Photography', icon: '📸' },
  { value: 'beauty', label: 'Beauty & Salon', icon: '💄' },
  { value: 'catering', label: 'Catering', icon: '🍰' },
  { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { value: 'construction', label: 'Construction', icon: '🏗️' },
  { value: 'consulting', label: 'Consulting', icon: '💡' },
];

const priceRanges = [
  { value: '', label: 'Any Price', icon: '💰' },
  { value: 'budget', label: 'Budget (₹)', icon: '💵', description: 'Affordable options' },
  { value: 'moderate', label: 'Moderate (₹₹)', icon: '💴', description: 'Mid-range pricing' },
  { value: 'premium', label: 'Premium (₹₹₹)', icon: '💎', description: 'High-end services' },
];

export default function SearchFilters({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  hasLocation
}: SearchFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: '',
      businessType: '',
      priceRange: '',
      radius: 10
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.businessType) count++;
    if (filters.priceRange) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:relative lg:bg-transparent lg:z-auto">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl lg:relative lg:max-w-none lg:shadow-none lg:bg-gray-50 lg:rounded-xl lg:border">
        <div className="flex flex-col h-full lg:h-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b lg:border-b-0">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {getActiveFilterCount() > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Distance Filter */}
            {hasLocation && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <label className="text-sm font-medium text-gray-900">
                    Distance: {filters.radius}km
                  </label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={filters.radius}
                  onChange={(e) => updateFilter('radius', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1km</span>
                  <span>50km</span>
                </div>
              </div>
            )}

            {/* Business Type Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium text-gray-900">Business Type</label>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateFilter('businessType', type.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      filters.businessType === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Service Category Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium text-gray-900">Service Category</label>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {serviceCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => updateFilter('category', category.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      filters.category === category.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {category.icon && <span className="text-lg">{category.icon}</span>}
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium text-gray-900">Price Range</label>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {priceRanges.map((price) => (
                  <button
                    key={price.value}
                    onClick={() => updateFilter('priceRange', price.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      filters.priceRange === price.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{price.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{price.label}</div>
                      {price.description && (
                        <div className="text-xs text-gray-500">{price.description}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer - Mobile Only */}
          <div className="p-6 border-t bg-gray-50 lg:hidden">
            <div className="flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom CSS for the range slider (add to globals.css)
export const sliderStyles = `
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
`;