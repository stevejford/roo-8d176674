import React, { useEffect, useRef } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DeliveryAddressInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const DeliveryAddressInput = ({ value, onChange }: DeliveryAddressInputProps) => {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      // Remove any existing Google Maps script
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key is not defined');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
      scriptRef.current = script;
    };

    loadGoogleMapsScript();

    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, []);

  const initAutocomplete = () => {
    if (!addressInputRef.current || !window.google) {
      console.error('Google Maps or input reference not available');
      return;
    }

    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'US' },
        fields: ['formatted_address']
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
        }
      });
    } catch (error) {
      console.error('Error initializing Google Maps Autocomplete:', error);
    }
  };

  return (
    <div className="relative">
      <Input
        ref={addressInputRef}
        type="text"
        placeholder="Enter delivery address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 py-6"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    </div>
  );
};