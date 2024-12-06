import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { calculateDistance } from '@/lib/utils/location';
import type { Route, RouteMatch, UserProfile } from '@/lib/types';

export async function createRoute(route: Partial<Route>) {
  return addDoc(collection(db, 'routes'), route);
}

export async function updateRoute(routeId: string, updates: Partial<Route>) {
  const routeRef = doc(db, 'routes', routeId);
  return updateDoc(routeRef, updates);
}

export async function findMatchingRoutes(userRoute: Route): Promise<RouteMatch[]> {
  const routesQuery = query(
    collection(db, 'routes'),
    where('status', '==', 'active'),
    where('userId', '!=', userRoute.userId)
  );

  const [routesSnapshot, usersSnapshot] = await Promise.all([
    getDocs(routesQuery),
    getDocs(collection(db, 'users'))
  ]);

  const users = new Map<string, UserProfile>();
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    users.set(doc.id, { 
      id: doc.id, 
      uid: data.uid, 
      email: data.email, 
      displayName: data.displayName 
    } as UserProfile);
  });

  const matches: RouteMatch[] = [];
  routesSnapshot.forEach(doc => {
    const route = { id: doc.id, ...doc.data() } as Route;
    const matchScore = calculateMatchScore(userRoute, route);
    
    if (matchScore >= 50) {
      const user = users.get(route.userId);
      if (user) {
        matches.push({
          matchedRoute: route,
          matchedUser: user,
          matchScore,
          environmentalBenefits: calculateEnvironmentalBenefits(userRoute, route)
        });
      }
    }
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

function calculateMatchScore(route1: Route, route2: Route): number {
  const originDistance = calculateDistance(route1.origin, route2.origin);
  const destinationDistance = calculateDistance(route1.destination, route2.destination);
  
  const originScore = Math.max(0, 100 - (originDistance / 100));
  const destinationScore = Math.max(0, 100 - (destinationDistance / 100));
  
  return (originScore + destinationScore) / 2;
}

function calculateEnvironmentalBenefits(route1: Route, route2: Route) {
  const distance = calculateDistance(route1.origin, route2.origin);
  const carbonSaved = distance * 0.2; // 200g CO2 per km
  
  return {
    carbonEmissions: carbonSaved,
    fuelSavings: distance * 0.08, // 0.08L per km
    carbonOffset: carbonSaved * 0.5,
    trafficReduction: 15 // Assumed 15% reduction
  };
}