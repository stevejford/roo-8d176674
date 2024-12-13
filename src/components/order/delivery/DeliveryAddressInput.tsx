import React, { useEffect, useRef } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    const loadGoogleMapsScript = async () => {
      // Remove any existing Google Maps script
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }

      try {
        // Fetch the API key from Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('get-maps-key');
        
        if (error || !data?.apiKey) {
          console.error('Failed to fetch Google Maps API key:', error);
          toast({
            title: "Configuration Error",
            description: "Failed to load Google Maps configuration. Address autocomplete will not work.",
            variant: "destructive"
          });
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;

        // Define the callback function
        window.initGoogleMaps = () => {
          console.log('Google Maps script loaded, initializing autocomplete');
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
      } catch (error) {
        console.error('Error setting up Google Maps:', error);
        toast({
          title: "Error",
          description: "Failed to initialize Google Maps. Address autocomplete will not work.",
          variant: "destructive"
        });
      }
    };

    loadGoogleMapsScript();

    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }
      // Clean up the global callback
      delete window.initGoogleMaps;
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

// Add the global type declaration
declare global {
  interface Window {
    initGoogleMaps: () => void;
    google: any;
  }
}