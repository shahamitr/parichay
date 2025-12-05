// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, X, Loader2 } from 'lucide-react';

interface ProximityBannerProps {
  branchAddress?: {
    street?: string;
    city?: string;
    state?: string;
e?: number;
    longitude?: number;
  };
  branchName: string;
  brandName: string;
  primaryColor?: string;
}

interface LocationState {
  status: 'idle' | 'requesting' | 'granted' | 'denied' | 'error';
  distance: number | null;
  userCoords: { lat: number; lng: number } | null;
}

export default function ProximityBanner({
  branchAddress,
  branchName,
  brandName,
  primaryColor = '#3B82F6',
}: ProximityBannerProps) {
  const [location, setLocation] = useState<LocationState>({
    status: 'idle',
    distance: null,
    userCoords: null,
  });
  const [dismissed, setDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Check if we have branch coordinates or can geocode the address
  const hasBranchLocation = branchAddress?.latitude && branchAddress?.longitude;

  useEffect(() => {
    // Check if already dismissed in this session
    const isDismissed = sessionStorage.getItem('proximity-banner-dismissed');
    if (isDismissed != null) {
      setDismissed(true);
      return;
    }

    // Request location after a short delay to not be intrusive
    const timer = setTimeout(() => {
      requestLocation();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, status: 'error' }));
      return;
    }

    setLocation(prev => ({ ...prev, status: 'requesting' }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(prev => ({ ...prev, status: 'granted', userCoords }));

        // Calculate distance if we have branch coordinates
        if (hasBranchLocation != null) {
          const distance = calculateDistance(
            userCoords.lat,
            userCoords.lng,
            branchAddress.latitude!,
            branchAddress.longitude!
          );
          setLocation(prev => ({ ...prev, distance }));

          // Show banner if within 5km
          if (distance <= 5) {
            setShowBanner(true);
          }
        } else if (branchAddress?.city) {
          // Try to geocode the address
          const branchCoords = await geocodeAddress(branchAddress);
          if (branchCoords != null) {
            const distance = calculateDistance(
              userCoords.lat,
              userCoords.lng,
              branchCoords.lat,
              branchCoords.lng
            );
            setLocation(prev => ({ ...prev, distance }));

            // Show banner if within 5km
            if (distance <= 5) {
              setShowBanner(true);
            }
          }
        }
      },
      (error) => {
        console.log('Location error:', error.message);
        setLocation(prev => ({ ...prev, status: 'denied' }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (deg: number): number => deg * (Math.PI / 180);

  // Simple geocoding using Nominatim (free, no API key needed)
  const geocodeAddress = async (address: any): Promise<{ lat: number; lng: number } | null> => {
    try {
      const query = encodeURIComponent(
        `${address.street || ''} ${address.city || ''} ${address.state || ''} India`
      );
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
        {
          headers: {
            'User-Agent': 'Parichay-Microsite/1.0',
          },
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
    sessionStorage.setItem('proximity-banner-dismissed', 'true');
  };

  const getDirections = () => {
    if (branchAddress != null) {
      const destination = encodeURIComponent(
        `${branchAddress.street || ''}, ${branchAddress.city || ''}`
      );
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
    }
  };

  const getDistanceText = (): string => {
    if (location.distance === null) return '';
    if (location.distance < 1) {
      return `${Math.round(location.distance * 1000)}m away`;
    }
    return `${location.distance.toFixed(1)} km away`;
  };

  const getProximityMessage = (): string => {
    if (location.distance === null) return '';
    if (location.distance <= 1) {
      return "You're very close! Visit us now.";
    } else if (location.distance <= 3) {
      return "We're nearby! Just a short trip away.";
    } else if (location.distance <= 5) {
      return "We're in your area!";
    }
    return '';
  };

  // Don't render if dismissed or no banner to show
  if (dismissed || !showBanner) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] animate-slide-down"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Location Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-semibold text-sm sm:text-base truncate">
                  {branchName}
                </span>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-white text-xs font-medium">
{getDistanceText()}
                </span>
              </div>
              <p className="text-white/90 text-xs sm:text-sm truncate">
                {getProximityMessage()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={getDirections}
              className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Navigation className="w-4 h-4" />
              <span className="hidden sm:inline">Get Directions</span>
              <span className="sm:hidden">Go</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down { animation: slide-down 0.4s ease-out; }
      `}} />
    </div>
  );
}
