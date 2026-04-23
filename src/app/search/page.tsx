'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Navigation, Loader2 } from 'lucide-react';
import Link from 'next/link';
import CommonHeader from '@/components/layout/CommonHeader';
import CommonFooter from '@/components/layout/CommonFooter';
import BusinessCard from '@/components/search/BusinessCard';
import SearchFilters from '@/components/search/SearchFilters';
import { getCurrentLocation } from '@/lib/location';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  serviceCategories: string[];
  priceRange: string;
  avgServicePrice: number;
  address: any;
  contact: any;
  businessHours: any;
  isVerified: boolean;
  distance: number | null;
  rating: number;
  reviewCount: number;
  brand: {
    id: string;
    name: string;
    logo: string;
    slug: string;
    isVerified: boolean;
    verificationBadge: string;
  };
  url: string;
}

interface SearchMetadata {
  total: number;
  hasLocation: boolean;
  radius: number;
  query: string;
  category: string;
  businessType: string;
  priceRange: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [metadata, setMetadata] = useState<SearchMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState('');
  const [locationLoading, setLocationLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    category: '',
    businessType: '',
    priceRange: '',
    radius: 10
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get user location on mount
  useEffect(() => {
    const getLocation = async () => {
      setLocationLoading(true);
      try {
        const location = await getCurrentLocation();
        if (location) {
          setUserLocation(location);
        } else {
          setLocationError('Location access denied. You can still search without location.');
        }
      } catch (error) {
        setLocationError('Unable to get your location. You can still search without location.');
      } finally {
        setLocationLoading(false);
      }
    };

    getLocation();
  }, []);

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        public: 'true',
        limit: '20',
        radius: filters.radius.toString(),
      });

      if (userLocation) {
        params.append('lat', userLocation.lat.toString());
        params.append('lng', userLocation.lng.toString());
      }

      if (filters.category) params.append('category', filters.category);
      if (filters.businessType) params.append('type', filters.businessType);
      if (filters.priceRange) params.append('price', filters.priceRange);

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setMetadata(data.metadata);
      } else {
        console.error('Search failed:', data.error);
        setResults([]);
        setMetadata(null);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2 || filters.category || filters.businessType) {
        performSearch();
      } else if (query.length === 0 && !filters.category && !filters.businessType) {
        setResults([]);
        setMetadata(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filters, userLocation]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.businessType) count++;
    if (filters.priceRange) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <CommonHeader />

      {/* Search Bar Area */}
      <div className="bg-white shadow-sm border-b relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for services, businesses, or categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              {loading && (
                <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors ${
                  showFilters || getActiveFilterCount() > 0
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>

              {locationLoading ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-500 rounded-xl border border-gray-200">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Getting location...</span>
                </div>
              ) : userLocation ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-xl border border-green-200">
                  <Navigation className="w-5 h-5" />
                  <span className="text-sm font-medium">Location enabled</span>
                </div>
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-4 py-3 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-medium">Enable location</span>
                </button>
              )}
            </div>
          </div>

          {/* Location Error */}
          {locationError && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              {locationError}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <SearchFilters
              isOpen={true}
              onClose={() => {}}
              filters={filters}
              onFiltersChange={setFilters}
              hasLocation={!!userLocation}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            {metadata && (
              <div className="mb-6 flex items-center justify-between">
                <div className="text-gray-600">
                  Found <span className="font-semibold">{metadata.total}</span> businesses
                  {metadata.hasLocation && ` within ${metadata.radius}km`}
                  {metadata.query && (
                    <>
                      {' '}for "<span className="font-semibold">{metadata.query}</span>"
                    </>
                  )}
                </div>

                {results.length > 0 && (
                  <div className="text-sm text-gray-500">
                    {userLocation ? 'Sorted by distance' : 'Sorted by rating'}
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && results.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Searching for businesses...</p>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    showDistance={!!userLocation}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && results.length === 0 && (query.length >= 2 || filters.category || filters.businessType) && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No businesses found</p>
                  <p className="text-sm">Try adjusting your search terms or filters</p>
                </div>

                <button
                  onClick={() => {
                    setQuery('');
                    setFilters({
                      category: '',
                      businessType: '',
                      priceRange: '',
                      radius: 10
                    });
                  }}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear search and filters
                </button>
              </div>
            )}

            {/* Welcome State */}
            {!loading && results.length === 0 && query.length < 2 && !filters.category && !filters.businessType && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-6">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <h2 className="text-2xl font-semibold mb-2">Find Local Businesses</h2>
                  <p className="text-lg">Search for services, restaurants, shops, and more near you</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {[
                    { category: 'restaurant', label: 'Restaurants', icon: '🍽️' },
                    { category: 'beauty', label: 'Beauty & Salon', icon: '💄' },
                    { category: 'healthcare', label: 'Healthcare', icon: '🏥' },
                    { category: 'automotive', label: 'Automotive', icon: '🚗' },
                    { category: 'plumbing', label: 'Plumbing', icon: '🔧' },
                    { category: 'electrical', label: 'Electrical', icon: '⚡' },
                    { category: 'fitness', label: 'Fitness', icon: '💪' },
                    { category: 'education', label: 'Education', icon: '📚' },
                  ].map((item) => (
                    <button
                      key={item.category}
                      onClick={() => setFilters(prev => ({ ...prev, category: item.category }))}
                      className="p-4 bg-white rounded-xl border hover:border-blue-300 hover:shadow-md transition-all text-center group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {item.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <SearchFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
        hasLocation={!!userLocation}
      />

      <CommonFooter />
    </div>
  );
}