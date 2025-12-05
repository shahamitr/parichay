'use client';

import { useState } from 'react';
import { MapPin, Search, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { ExtractedMicrositeData } from '@/lib/google-business-extractor';

interface GoogleBusinessImportProps {
  onImportComplete: (data: ExtractedMicrositeData) => void;
  onCancel?: () => void;
}

export default function GoogleBusinessImport({
  onImportComplete,
  onCancel,
}: GoogleBusinessImportProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedMicrositeData | null>(null);

  const handleImport = async () => {
    if (!url.trim()) {
      setError('Please enter a Google Maps URL');
      return;
    }

    setLoading(true);
    setError(null);
    setExtractedData(null);

    try {
      const response = await fetch('/api/import/google-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (result.success) {
        setExtractedData(result.data);

        // Show warning if using mock data
        if (result.source === 'mock' && result.warning) {
          setError(`Note: ${result.warning}. Showing sample data.`);
        }
      } else {
        setError(result.error || 'Failed to import business data');
      }
    } catch (err) {
      console.error('Import error:', err);
      setError('An error occurred while importing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (extractedData != null) {
      onImportComplete(extractedData);
    }
  };

  const handleUseMockData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/import/google-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          useMockData: true,
          businessName: 'Demo Business'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setExtractedData(result.data);
      }
    } catch (err) {
      console.error('Mock data error:', err);
      setError('Failed to load demo data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Import from Google Business
            </h2>
            <p className="text-sm text-gray-600">
              Enter your Google Maps URL to automatically import business information
            </p>
          </div>
        </div>

        {/* URL Input */}
        {!extractedData && (
          <div className="space-y-4">
            <div>
              <label htmlFor="google-url" className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  id="google-url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError(null);
                  }}
                  placeholder="https://maps.google.com/maps?cid=..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  onClick={handleImport}
                  disabled={loading || !url.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Import</span>
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Example: https://maps.google.com/maps?cid=1234567890
              </p>
            </div>

            {/* How to find URL */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                How to find your Google Maps URL:
              </h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Search for your business on Google Maps</li>
                <li>Click on your business listing</li>
                <li>Click "Share" button</li>
                <li>Copy the link and paste it above</li>
              </ol>
            </div>

            {/* Demo Data Option */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Want to try it out first?
              </p>
              <button
                onClick={handleUseMockData}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
              >
                Use Demo Data
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-stax-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Extracted Data Preview */}
        {extractedData && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">
                  Business data imported successfully!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Review the information below and click "Continue" to proceed.
                </p>
              </div>
            </div>

            {/* Data Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Basic Information</h3>

                <div>
                  <label className="text-sm text-gray-600">Business Name</label>
                  <p className="font-medium text-gray-900">{extractedData.brandName}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Category</label>
                  <p className="font-medium text-gray-900">{extractedData.industry}</p>
                </div>

                {extractedData.rating && (
                  <div>
                    <label className="text-sm text-gray-600">Rating</label>
                    <p className="font-medium text-gray-900">
                      ⭐ {extractedData.rating} ({extractedData.reviewCount} reviews)
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Contact Information</h3>

                {extractedData.contact.phone && (
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-medium text-gray-900">{extractedData.contact.phone}</p>
                  </div>
                )}

                {extractedData.contact.website && (
                  <div>
                    <label className="text-sm text-gray-600">Website</label>
                    <p className="font-medium text-gray-900 truncate">
                      {extractedData.contact.website}
                    </p>
                  </div>
                )}

                {extractedData.contact.email && (
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium text-gray-900">{extractedData.contact.email}</p>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Address</h3>
                <div>
                  <p className="text-sm text-gray-700">
                    {extractedData.address.street}<br />
                    {extractedData.address.city}, {extractedData.address.state} {extractedData.address.zipCode}<br />
                    {extractedData.address.country}
                  </p>
                </div>
              </div>

              {/* Photos */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Photos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {extractedData.photos.slice(0, 6).map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={photo}
                        alt={`Business photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {extractedData.photos.length > 6 && (
                  <p className="text-xs text-gray-500">
                    +{extractedData.photos.length - 6} more photos
                  </p>
                )}
              </div>
            </div>

            {/* Business Hours */}
            {extractedData.businessHours && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Business Hours</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(extractedData.businessHours).map(([day, hours]) => (
                    <div key={day} className="text-sm">
                      <span className="font-medium capitalize">{day}:</span>
                      <span className="ml-2 text-gray-600">
                        {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  setExtractedData(null);
                  setUrl('');
                  setError(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Import Different Business
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Continue with This Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
