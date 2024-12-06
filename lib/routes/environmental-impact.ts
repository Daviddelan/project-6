import type { Route, EnvironmentalImpact } from '@/lib/types';

const AVERAGE_CAR_EMISSIONS = 0.2; // kg CO2 per km
const AVERAGE_FUEL_CONSUMPTION = 0.08; // liters per km

export function calculateEnvironmentalImpact(
  route: Route,
  distance: number,
  duration: number,
  trafficLevel: number
): EnvironmentalImpact {
  // Calculate base carbon emissions for the route
  const baseEmissions = distance * AVERAGE_CAR_EMISSIONS;
  
  // Calculate potential fuel savings from optimal routing
  const fuelSavings = distance * AVERAGE_FUEL_CONSUMPTION * 0.2; // Assume 20% efficiency improvement
  
  // Calculate carbon offset from carpooling/optimal routing
  const carbonOffset = baseEmissions * 0.3; // Assume 30% reduction
  
  // Calculate traffic reduction impact
  const trafficReduction = calculateTrafficReduction(trafficLevel, duration);
  
  return {
    carbonEmissions: baseEmissions,
    fuelSavings,
    carbonOffset,
    trafficReduction,
  };
}

function calculateTrafficReduction(trafficLevel: number, duration: number): number {
  // Complex calculation based on traffic level and route duration
  // Returns percentage reduction in traffic
  return Math.min(((trafficLevel * duration) / 3600) * 100, 100);
}