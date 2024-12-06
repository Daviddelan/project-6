'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { getCurrentLocation } from '@/lib/maps/geocoding';
import type { Location } from '@/lib/types';

interface LocationInputProps {
  value: string;
  onChangeLocationAction: (location: Location) => void;
  placeholder: string;
  onError?: (error: string) => void;
}

export function LocationInput({ value, onChangeLocationAction, placeholder, onError }: LocationInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && inputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'geometry', 'place_id'],
        types: ['geocode', 'establishment'],
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
          onChangeLocationAction({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address || '',
            placeId: place.place_id || undefined,
          });
          setInputValue(place.formatted_address || '');
        }
      });
    }
  }, [onChangeLocationAction]);

  const handleUseCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      onChangeLocationAction(location);
      setInputValue(location.address);
    } catch (error) {
      onError?.('Failed to get current location');
    }
  };

  return (
    <div className="relative flex gap-2">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleUseCurrentLocation}
        title="Use current location"
      >
        <MapPin className="h-4 w-4" />
      </Button>
    </div>
  );
}