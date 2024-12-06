import type { Route, RouteMatch, UserProfile } from '@/lib/types';
import { calculateEnvironmentalImpact } from './environmental-impact';

interface GeoLocation {
  lat: number;
  lng: number;
}

export function findRouteMatches(
  userRoute: Route,
  potentialMatches: Route[],
  users: Record<string, UserProfile>
): RouteMatch[] {
  return potentialMatches
    .map(route => {
      const matchScore = calculateRouteMatchScore(userRoute, route);
      
      if (matchScore < 50) return null; // Filter out low-quality matches
      
      const matchedUser = users[route.userId];
      if (!matchedUser) return null;
      
      // Calculate environmental benefits of matching
      const environmentalBenefits = calculateEnvironmentalImpact(
        route,
        getRouteDistance(route),
        getRouteDuration(route),
        getCurrentTrafficLevel()
      );
      
      return {
        matchedRoute: route,
        matchedUser,
        matchScore,
        environmentalBenefits,
      };
    })
    .filter((match): match is RouteMatch => match !== null)
    .sort((a, b) => b.matchScore - a.matchScore);
}

function calculateRouteMatchScore(route1: Route, route2: Route): number {
  const originScore = calculateLocationMatchScore(route1.origin, route2.origin);
  const destinationScore = calculateLocationMatchScore(route1.destination, route2.destination);
  const timeScore = calculateTimeMatchScore(route1.departureTime, route2.departureTime);
  
  return (originScore + destinationScore + timeScore) / 3;
}

function calculateLocationMatchScore(loc1: GeoLocation, loc2: GeoLocation): number {
  const distance = calculateHaversineDistance(
    loc1.lat,
    loc1.lng,
    loc2.lat,
    loc2.lng
  );
  
  // Convert distance to a 0-100 score
  return Math.max(0, 100 - (distance / 0.5) * 100); // 0.5km radius for perfect score
}

function calculateTimeMatchScore(time1: number, time2: number): number {
  const timeDiff = Math.abs(time1 - time2) / (1000 * 60); // Convert to minutes
  return Math.max(0, 100 - (timeDiff / 30) * 100); // 30 minutes difference for 0 score
}

function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Placeholder functions - would need real implementations
function getRouteDistance(route: Route): number {
  return 10; // Example: 10km
}

function getRouteDuration(route: Route): number {
  return 1200; // Example: 1200 seconds (20 minutes)
}

function getCurrentTrafficLevel(): number {
  return 0.5; // Example: 50% congestion
}