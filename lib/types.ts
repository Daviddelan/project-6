export interface UserProfile {
  uid: string;
  email: string;
  phoneNumber?: string;
  displayName: string;
  photoURL?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  shareEmail: boolean;
  sharePhone: boolean;
  notificationsEnabled: boolean;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  placeId?: string;
}

export interface Route {
  id: string;
  userId: string;
  origin: Location;
  destination: Location;
  departureTime: number;
  status: 'active' | 'completed' | 'cancelled';
  preferences: RoutePreferences;
  environmentalImpact: EnvironmentalImpact;
}

export interface RoutePreferences {
  maxDetour: number; // Maximum acceptable detour in minutes
  transportMode: 'driving' | 'transit' | 'walking' | 'bicycling';
  carpoolPreference: boolean;
}

export interface EnvironmentalImpact {
  carbonEmissions: number; // in kg CO2
  fuelSavings: number; // in liters
  carbonOffset: number; // in kg CO2
  trafficReduction: number; // percentage
}

export interface RouteMatch {
  matchedRoute: Route;
  matchedUser: UserProfile;
  matchScore: number;
  environmentalBenefits: EnvironmentalImpact;
}