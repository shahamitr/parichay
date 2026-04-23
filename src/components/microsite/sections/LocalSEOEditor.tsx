'use client';

import { useState, useEffect } from 'react';
import { MapPin, Search, Globe, Star, ExternalLink } from 'lucide-react';

interface LocalSEOConfig {
  enabled: boolean;
  businessName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  businessType: string;
  keywords: string[];
  googleMyBusinessUrl?: string;
  mapProvider: 'google' | 'openstreetmap';
  showMap: boolean;
  schema: {
    enabled: boolean;
    businessType: string;
    priceRange: string;
    paymentAccepted: string[];
  };
}

interface LocalSEOEditorProps {
  config: LocalSEOConfig;
  onChange: (config: LocalSEOConfig) => void;
}

export default function LocalSEOEditor({ config, onChange }: LocalSEOEditorProps) {
  const [localConfig, setLocalConfig] = useState<LocalSEOConfig>(config);

  useEffect(() => {
    onChange(localConfig);
  }, [localConfig, onChange]);

  const handleAddressChange = (field: string, value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const handleKeywordAdd = (keyword: string) => {
    if (keyword.trim() && !localConfig.keywords.includes(keyword.trim())) {
      setLocalConfig(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword.trim()]
      }));
    }
  };

  const handleKeywordRemove = (index: number) => {
    setLocalConfig(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const geocodeAddress = async () => {
    const address = `${localConfig.address.street}, ${localConfig.address.city}, ${localConfig.address.state} ${localConfig.address.zipCode}`;
    try {
      // Using OpenStreetMap Nominatim API (free)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        setLocalConfig(prev => ({
          ...prev,
          coordinates: {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          }
        }));
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">Local SEO & Maps</h3>
          <p className="text-xs text-gray-400">Improve local search visibility</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={localConfig.enabled}
            onChange={(e) => setLocalConfig(prev => ({ ...prev, enabled: e.target.checked }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {localConfig.enabled && (
        <>
          {/* Business Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Business Information
            </h4>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Business Name</label>
              <input
                type="text"
                value={localConfig.businessName}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                placeholder="Your Business Name"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Business Type</label>
              <select
                value={localConfig.businessType}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, businessType: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
              >
                <option value="">Select Business Type</option>
                <option value="restaurant">Restaurant</option>
                <option value="retail">Retail Store</option>
                <option value="service">Service Business</option>
                <option value="healthcare">Healthcare</option>
                <option value="automotive">Automotive</option>
                <option value="beauty">Beauty & Spa</option>
                <option value="fitness">Fitness & Gym</option>
                <option value="education">Education</option>
                <option value="real-estate">Real Estate</option>
                <option value="professional">Professional Services</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Business Address
            </h4>

            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Street Address"
                value={localConfig.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={localConfig.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={localConfig.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={localConfig.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={localConfig.address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                />
              </div>
            </div>

            <button
              onClick={geocodeAddress}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Get Coordinates
            </button>

            {localConfig.coordinates.lat && localConfig.coordinates.lng && (
              <div className="text-xs text-gray-400">
                Coordinates: {localConfig.coordinates.lat.toFixed(6)}, {localConfig.coordinates.lng.toFixed(6)}
              </div>
            )}
          </div>

          {/* SEO Keywords */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Search className="w-4 h-4" />
              Local SEO Keywords
            </h4>

            <div className="flex flex-wrap gap-2 mb-2">
              {localConfig.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full flex items-center gap-1"
                >
                  {keyword}
                  <button
                    onClick={() => handleKeywordRemove(index)}
                    className="text-blue-200 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add keyword (e.g., 'best restaurant in Mumbai')"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleKeywordAdd(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>

          {/* Map Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">Map Display</h4>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Show Map on Website</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.showMap}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, showMap: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Map Provider</label>
              <select
                value={localConfig.mapProvider}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, mapProvider: e.target.value as 'google' | 'openstreetmap' }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
              >
                <option value="openstreetmap">OpenStreetMap (Free)</option>
                <option value="google">Google Maps</option>
              </select>
            </div>
          </div>

          {/* Schema Markup */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">Schema Markup</h4>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Enable Schema.org Markup</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.schema.enabled}
                  onChange={(e) => setLocalConfig(prev => ({
                    ...prev,
                    schema: { ...prev.schema, enabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {localConfig.schema.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Price Range</label>
                  <select
                    value={localConfig.schema.priceRange}
                    onChange={(e) => setLocalConfig(prev => ({
                      ...prev,
                      schema: { ...prev.schema, priceRange: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                  >
                    <option value="">Select Price Range</option>
                    <option value="$">$ (Inexpensive)</option>
                    <option value="$$">$$ (Moderate)</option>
                    <option value="$$$">$$$ (Expensive)</option>
                    <option value="$$$$">$$$$ (Very Expensive)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Google My Business Integration */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Google My Business
            </h4>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Google My Business URL</label>
              <input
                type="url"
                value={localConfig.googleMyBusinessUrl || ''}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, googleMyBusinessUrl: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                placeholder="https://goo.gl/maps/..."
              />
              <p className="text-xs text-gray-400 mt-1">
                Link to your Google My Business listing for better local SEO
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}