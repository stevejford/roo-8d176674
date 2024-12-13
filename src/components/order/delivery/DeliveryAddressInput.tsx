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

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    loadGoogleMapsScript();
  }, []);

  const initAutocomplete = () => {
    if (!addressInputRef.current || !window.google) return;

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