'use client';

import { useState } from 'react';
import { MapPin, ExternalLink, Navigation, Copy, Check } from 'lucide-react';
import { LocalSEOSection as LocalSEOConfig } from '@/types/microsite';

interface LocalSEOSectionProps {
  config: LocalSEOConfig;
  branchData: any;
}

export default function LocalSEOSection({ config, branchData }: LocalSEOSectionProps) {
  const [copied, setCopied] = useState(false);

  if (!config.enabled || !config.showMap) {
    return null;
  }

  const fullAddress = `${config.address.street}, ${config.address.city}, ${config.address.state} ${config.address.zipCode}, ${config.address.country}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleDirections = () => {
    if (config.coordinates.lat && config.coordinates.lng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${config.coordinates.lat},${config.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      const encodedAddress = encodeURIComponent(fullAddress);
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(url, '_blank');
    }
  };

  const getMapUrl = () => {
    if (config.mapProvider === 'google') {
      // Note: In production, you'd want to use Google Maps API with proper API key
      const encodedAddress = encodeURIComponent(fullAddress);
      return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`;
    } else {
      // OpenStreetMap embed
      const { lat, lng } = config.coordinates;
      if (lat && lng) {
        return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
      }
    }
    return null;
  };

  const mapUrl = getMapUrl();

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Visit Our Location
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find us easily with our interactive map and location details
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Map */}
            <div className="relative">
              {mapUrl ? (
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-96"
                  />

                  {/* Map overlay with business info */}
                  <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {config.businessName}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {config.businessType}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Map not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Location Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Our Address
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {config.businessName}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {config.address.street}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {config.address.city}, {config.address.state} {config.address.zipCode}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {config.address.country}
                    </p>
                  </div>

                  {config.coordinates.lat && config.coordinates.lng && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Coordinates: {config.coordinates.lat.toFixed(6)}, {rdinates.lng.toFixed(6)}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleDirections}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </button>

                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Business Type & Keywords */}
              {(config.businessType || config.keywords.length > 0) && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    About Our Business
                  </h3>

                  {config.businessType && (
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                        {config.businessType.charAt(0).toUpperCase() + config.businessType.slice(1)}
                      </span>
                    </div>
                  )}

                  {config.keywords.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Services & Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {config.keywords.slice(0, 6).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Google My Business Link */}
              {config.googleMyBusinessUrl && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Find Us Online
                  </h3>
                  <a
                    href={config.googleMyBusinessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Google
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schema.org structured data */}
      {config.schema.enabled && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": config.businessName,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": config.address.street,
                "addressLocality": config.address.city,
                "addressRegion": config.address.state,
                "postalCode": config.address.zipCode,
                "addressCountry": config.address.country
              },
              ...(config.coordinates.lat && config.coordinates.lng && {
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": config.coordinates.lat,
                  "longitude": config.coordinates.lng
                }
              }),
              ...(config.schema.priceRange && {
                "priceRange": config.schema.priceRange
              }),
              ...(config.googleMyBusinessUrl && {
                "url": config.googleMyBusinessUrl
              })
            })
          }}
        />
      )}
    </section>
  );
}