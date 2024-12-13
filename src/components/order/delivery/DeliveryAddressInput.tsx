import React, { useEffect, useRef } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface DeliveryAddressInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const DeliveryAddressInput = ({ value, onChange }: DeliveryAddressInputProps) => {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      // Remove any existing Google Maps script
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      console.log('API Key available:', !!apiKey); // Debug log

      if (!apiKey) {
        console.error('Google Maps API key is not defined');
        toast({
          title: "Configuration Error",
          description: "Google Maps API key is missing. Address autocomplete will not work.",
          variant: "destructive"
        });
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        initAutocomplete();
      };
      script.onerror = (error) => {
        console.error('Error loading Google Maps script:', error);
        toast({
          title: "Error",
          description: "Failed to load Google Maps. Address autocomplete will not work.",
          variant: "destructive"
        });
      };
      document.head.appendChild(script);
      scriptRef.current = script;
    };

    loadGoogleMapsScript();

    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, [toast]);

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
      
      console.log('Google Maps Autocomplete initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Maps Autocomplete:', error);
      toast({
        title: "Error",
        description: "Failed to initialize address autocomplete.",
        variant: "destructive"
      });
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