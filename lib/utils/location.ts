import { getDistance } from 'geolib';
import type { Location } from '@/lib/types';

export function calculateDistance(start: Location, end: Location): number {
  return getDistance(
    { latitude: start.lat, longitude: start.lng },
    { latitude: end.lat, longitude: end.lng }
  );
}

export function isWithinRadius(point: Location, center: Location, radiusInMeters: number): boolean {
  const distance = calculateDistance(point, center);
  return distance <= radiusInMeters;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}