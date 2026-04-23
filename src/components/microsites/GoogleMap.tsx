'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check } from 'lucide-react';
import { Address } from '@/types/microsite';

interface GoogleMapProps {
  address:ress;
  businessName: string;
  showDirectionsButton?: boolean;
  showCopyButton?: boolean;
  height?: string;
  className?: string;
  primaryColor?: string;
}

export default function GoogleMap({
  address,
  businessName,
  showDirectionsButton = true,
  showCopyButton = true,
  height = '450px',
  className = '',
  primaryColor = '#3B82F6'
}: GoogleMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [copied, setCopied] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Format address for display and URL encoding
  const formatAddress = () => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  };

  const addressString = formatAddress();
  const encodedAddress = encodeURIComponent(addressString);

  // Google Maps API key from environment
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Initialize interactive Google Map if API key is available
  useEffect(() => {
    if (!googleMapsApiKey || !mapRef.current) return;

    const initMap = async () => {
      try {
        // Load Google Maps JavaScript API
        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        // Geocode the address
        const geocoder = new window.google.maps.Geocoder();
        const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          geocoder.geocode({ address: addressString }, (results, status) => {
            if (status === 'OK' && results) {
              resolve(results);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });

        if (results.length === 0) {
          throw new Error('No results found for address');
        }

        const location = results[0].geometry.location;

        // Create map
        const map = new window.google.maps.Map(mapRef.current!, {
          center: location,
          zoom: 15,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });

        // Add marker
        const marker = new window.google.maps.Marker({
          position: location,
          map: map,
          title: businessName,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: primaryColor,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: ${primaryColor};">${businessName}</h3>
              <p style="margin: 0; font-size: 14px; color: #666;">${addressString}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        setMapLoaded(true);
      } catch (error) {
        console.error('Error initializing Google Map:', error);
        setMapError(true);
      }
    };

    initMap();
  }, [googleMapsApiKey, addressString, businessName, primaryColor]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setMapLoaded(true);
  };

  const handleIframeError = () => {
    setMapError(true);
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(addressString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  // Open directions in Google Maps
  const openDirections = () => {
    const directionsUrl = `https://maps.google.com/maps?daddr=${encodedAddress}`;
    window.open(directionsUrl, '_blank');
  };

  // Open in Google Maps app/website
  const openInGoogleMaps = () => {
    const mapsUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-lg ${className}`}>
      {/* Map Container */}
      <div
        className="relative w-full bg-gray-100"
        style={{ height }}
      >
        {googleMapsApiKey ? (
          // Interactive Google Map (when API key is available)
          <div
            ref={mapRef}
            className="w-full h-full"
            style={{ minHeight: height }}
          />
        ) : (
          // Fallback to iframe embed
          <iframe
            ref={iframeRef}
            src={`https://maps.google.com/maps?width=100%25&height=450&hl=en&q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map showing location of ${businessName}`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}

        {/* Loading State */}
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: primaryColor }}></div>
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-6">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">Unable to load map</p>
              <button
                onClick={openInGoogleMaps}
                className="inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Google Maps</span>
              </button>
            </div>
          </div>
        )}

        {/* Map Controls Overlay */}
        {mapLoaded && (
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            {showDirectionsButton && (
              <button
                onClick={openDirections}
                className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm font-medium"
                style={{ color: primaryColor }}
                title="Get directions"
              >
                <Navigation className="w-4 h-4" />
                <span className="hidden sm:inline">Directions</span>
              </button>
            )}

            {showCopyButton && (
              <button
                onClick={copyAddress}
                className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm font-medium"
                style={{ color: primaryColor }}
                title="Copy address"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Address Display */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} />
          <div className="flex-1">
            <p className="font-medium text-gray-900">{businessName}</p>
            <p className="text-sm text-gray-600 mt-1">{addressString}</p>
          </div>
          <button
            onClick={openInGoogleMaps}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-gray-100"
            style={{ color: primaryColor }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Type declarations for Google Maps API
declare global {
  interface Window {
    google: typeof google;
  }
}