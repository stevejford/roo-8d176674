import React, { useEffect, useRef, useState } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DeliveryAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onPostcodeChange?: (postcode: string | null) => void;
}

export const DeliveryAddressInput = ({ value, onChange, onPostcodeChange }: DeliveryAddressInputProps) => {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const { toast } = useToast();
  const [isValidPostcode, setIsValidPostcode] = useState<boolean | null>(null);

  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      try {
        console.log('Fetching Google Maps API key...');
        const { data, error } = await supabase.functions.invoke('get-maps-key', {
          method: 'GET'
        });
        
        if (error) {
          console.error('Supabase function error:', error);
          throw error;
        }
        
        if (!data?.apiKey) {
          console.error('No API key in response:', data);
          throw new Error('Failed to fetch Google Maps API key');
        }

        console.log('API key fetched successfully');
        
        if (scriptRef.current && document.head.contains(scriptRef.current)) {
          document.head.removeChild(scriptRef.current);
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;

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
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      delete window.initGoogleMaps;
    };
  }, [toast]);

  const checkDeliveryZone = async (postcode: string) => {
    try {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('postcode', postcode)
        .eq('active', true)
        .single();

      if (error) throw error;

      const isValid = !!data;
      setIsValidPostcode(isValid);
      onPostcodeChange?.(isValid ? postcode : null);

      if (!isValid) {
        toast({
          title: "Delivery Unavailable",
          description: "Sorry, we don't deliver to this area yet.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error checking delivery zone:', error);
      setIsValidPostcode(false);
      onPostcodeChange?.(null);
    }
  };

  const initAutocomplete = () => {
    if (!addressInputRef.current || !window.google) {
      console.error('Google Maps or input reference not available');
      return;
    }

    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'AU' },
        fields: ['formatted_address', 'address_components']
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
          
          // Extract postcode from address components
          const postcodeComponent = place.address_components?.find(
            component => component.types.includes('postal_code')
          );
          
          if (postcodeComponent?.long_name) {
            checkDeliveryZone(postcodeComponent.long_name);
          }
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
        className={cn(
          "pl-10 py-6",
          isValidPostcode === false && "border-red-500",
          isValidPostcode === true && "border-green-500"
        )}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    </div>
  );
};

declare global {
  interface Window {
    initGoogleMaps: () => void;
    google: any;
  }
}