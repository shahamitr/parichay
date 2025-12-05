// @ts-nocheck
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ServiceItem } from '@/types/microsite';
import { Branch } from '@/generated/prisma';
import { getImageWithFallback } from '@/lib/placeholder-utils';

interface InteractiveProductCatalogProps {
  items: ServiceItem[];
  branch: Branch;
}

export default function InteractiveProductCatalog({ items, branch }: InteractiveProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<ServiceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(items.map(item => item.category).filter(Boolean)))];

  // Filter and sort items based on category, search, and sort preference
  const filteredItems = items
    .filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleInquire = (product: ServiceItem) => {
    const contact = branch.contact as any;
    const message = `Hi! I'm interested in ${product.name}. Can you provide more details?`;

    if (contact.whatsapp) {
      window.open(`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (contact.phone) {
      window.open(`tel:${contact.phone}`, '_self');
    }
  };

  return (
    <div className="w-full">
      {/* Search and Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search products or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category Filter and View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'
                }`}
                title="Grid View"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'
                }`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
      </div>

      {/* Product Grid/List */}
      <div className={viewMode === 'grid'
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
      }>
        {filteredItems.map((item, index) => (
          <div
            key={item.id || index}
            className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 hover:scale-105 ${
              viewMode === 'list' ? 'flex' : ''
            }`}
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
            }}
            onClick={() => setSelectedProduct(item)}
          >
            {/* Product Image */}
            <div className={`relative ${
              viewMode === 'grid' ? 'h-48 w-full' : 'h-40 w-40 flex-shrink-0'
            }`}>
              {item.image && item.image.trim() !== '' ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <img
                  src={getImageWithFallback(item.image, 'product', item.name)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              )}
              {item.availability === 'limited' && (
                <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  Limited Stock
                </span>
              )}
              {item.availability === 'out_of_stock' && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Product Content */}
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold brand-secondary mb-1">
                    {item.name}
                  </h3>
                  {item.category && (
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {item.category}
                    </span>
                  )}
                </div>
                {item.price && (
                  <span className="text-lg font-bold brand-accent whitespace-nowrap ml-4">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                {item.description}
              </p>

              {/* Features */}
              {item.features && item.features.length > 0 && (
                <ul className="mb-4 space-y-1">
                  {item.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleInquire(item);
                }}
                disabled={item.availability === 'out_of_stock'}
                className={`w-full px-4 py-2 rounded-md transition-all duration-300 ${
                  item.availability === 'out_of_stock'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-brand-primary text-white hover:opacity-90 hover:scale-105'
                }`}
              >
                {item.availability === 'out_of_stock' ? 'Out of Stock' : 'Inquire Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg">No products found matching your criteria</p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 w-full overflow-hidden">
              {selectedProduct.image && selectedProduct.image.trim() !== '' ? (
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <img
                  src={getImageWithFallback(selectedProduct.image, 'product', selectedProduct.name)}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold brand-secondary mb-2">
                    {selectedProduct.name}
                  </h2>
                  {selectedProduct.category && (
                    <span className="text-sm text-gray-500 uppercase tracking-wide">
                      {selectedProduct.category}
                    </span>
                  )}
                </div>
                {selectedProduct.price && (
                  <span className="text-2xl font-bold brand-accent">
                    ₹{selectedProduct.price.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Features:</h3>
                  <ul className="space-y-2">
                    {selectedProduct.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-600 flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => handleInquire(selectedProduct)}
                  disabled={selectedProduct.availability === 'out_of_stock'}
                  className={`flex-1 px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                    selectedProduct.availability === 'out_of_stock'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-brand-primary text-white hover:opacity-90'
                  }`}
                >
                  {selectedProduct.availability === 'out_of_stock' ? 'Out of Stock' : 'Inquire Now'}
                </button>
     <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}} />
    </div>
  );
}
