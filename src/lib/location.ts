// Location utility functions for geospatial operations

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @returns Distance in kilometers
 */
export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get bounding box coordinates for a given center point and radius
 * @param center Center coordinates
 * @param radiusKm Radius in kilometers
 * @returns Bounding box coordinates
 */
export function getBoundingBox(center: Coordinates, radiusKm: number): LocationBounds {
  const latDelta = radiusKm / 111; // Approximate km per degree latitude
  const lngDelta = radiusKm / (111 * Math.cos(toRadians(center.lat))); // Adjust for longitude

  return {
    north: center.lat + latDelta,
    south: center.lat - latDelta,
    east: center.lng + lngDelta,
    west: center.lng - lngDelta
  };
}

/**
 * Check if a point is within a given radius of a center point
 * @param center Center coordinates
 * @param point Point to check
 * @param radiusKm Radius in kilometers
 * @returns True if point is within radius
 */
export function isWithinRadius(center: Coordinates, point: Coordinates, radiusKm: number): boolean {
  return calculateDistance(center, point) <= radiusKm;
}

/**
 * Sort locations by distance from a center point
 * @param locations Array of locations with coordinates
 * @param center Center point to calculate distance from
 * @returns Sorted array with distance property added
 */
export function sortByDistance<T extends { latitude: number; longitude: number }>(
  locations: T[],
  center: Coordinates
): (T & { distance: number })[] {
  return locations
    .map(location => ({
      ...location,
      distance: calculateDistance(center, { lat: location.latitude, lng: location.longitude })
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Get user's current location using browser geolocation API
 * @returns Promise with user coordinates or null if denied/failed
 */
export function getCurrentLocation(): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

/**
 * Format distance for display
 * @param distanceKm Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else if (distanceKm < 10) {
    return `${Math.round(distanceKm * 10) / 10}km`;
  } else {
    return `${Math.round(distanceKm)}km`;
  }
}

/**
 * Geocode an address to coordinates (placeholder - would integrate with Google Maps API)
 * @param address Address string
 * @returns Promise with coordinates or null
 */
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  // This would integrate with Google Maps Geocoding API
  // For now, return null as placeholder
  console.log('Geocoding address:', address);
  return null;
}

/**
 * Reverse geocode coordinates to address (placeholder - would integrate with Google Maps API)
 * @param coordinates Coordinates to reverse geocode
 * @returns Promise with address string or null
 */
export async function reverseGeocode(coordinates: Coordinates): Promise<string | null> {
  // This would integrate with Google Maps Geocoding API
  // For now, return null as placeholder
  console.log('Reverse geocoding:', coordinates);
  return null;
}

/**
 * Get popular search categories based on location (placeholder for future ML implementation)
 * @param coordinates User location
 * @returns Array of popular categories
 */
export function getPopularCategories(coordinates?: Coordinates): string[] {
  // This could be enhanced with ML to show location-specific popular categories
  return [
    'restaurant',
    'beauty',
    'healthcare',
    'automotive',
    'plumbing',
    'electrical',
    'fitness',
    'education'
  ];
}

/**
 * Calculate estimated travel time (placeholder - would integrate with Google Maps API)
 * @param origin Origin coordinates
 * @param destination Destination coordinates
 * @param mode Travel mode ('driving', 'walking', 'transit')
 * @returns Estimated time in minutes
 */
export async function getEstimatedTravelTime(
  origin: Coordinates,
  destination: Coordinates,
  mode: 'driving' | 'walking' | 'transit' = 'driving'
): Promise<number | null> {
  // This would integrate with Google Maps Directions API
  // For now, return rough estimate based on distance
  const distance = calculateDistance(origin, destination);

  switch (mode) {
    case 'walking':
      return Math.round(distance * 12); // ~5 km/h walking speed
    case 'driving':
      return Math.round(distance * 2); // ~30 km/h average city driving
    case 'transit':
      return Math.round(distance * 3); // ~20 km/h average transit
    default:
      return null;
  }
}