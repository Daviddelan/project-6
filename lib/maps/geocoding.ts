import type { Location } from '@/lib/types';

export async function geocodeAddress(address: string): Promise<Location> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );
  
  const data = await response.json();
  
  if (data.status !== 'OK') {
    throw new Error('Geocoding failed');
  }
  
  const { lat, lng } = data.results[0].geometry.location;
  
  return {
    lat,
    lng,
    address: data.results[0].formatted_address,
    placeId: data.results[0].place_id,
  };
}

export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        
        // Reverse geocode to get address
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        
        const data = await response.json();
        
        if (data.status !== 'OK') {
          reject(new Error('Reverse geocoding failed'));
          return;
        }

        resolve({
          lat,
          lng,
          address: data.results[0].formatted_address,
          placeId: data.results[0].place_id,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}