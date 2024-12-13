import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DeliveryModeSelectorProps {
  mode: 'pickup' | 'delivery';
  setMode: (mode: 'pickup' | 'delivery') => void;
}

export const DeliveryModeSelector = ({ mode, setMode }: DeliveryModeSelectorProps) => {
  return (
    <div className="relative inline-flex">
      {/* Sliding background */}
      <div
        className={`absolute inset-y-1 w-[120px] bg-white rounded-full transition-transform duration-200 ease-in-out ${
          mode === 'delivery' ? 'translate-x-[120px]' : 'translate-x-1'
        }`}
      />
      
      {/* ToggleGroup buttons */}
      <ToggleGroup 
        type="single" 
        value={mode}
        onValueChange={(value) => value && setMode(value as 'pickup' | 'delivery')}
        className="bg-muted p-1 rounded-full relative z-10"
      >
        <ToggleGroupItem 
          value="pickup" 
          className="rounded-full px-6 py-1.5 text-sm font-medium transition-colors data-[state=on]:bg-transparent data-[state=on]:text-foreground data-[state=off]:text-muted-foreground"
        >
          Pickup
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="delivery" 
          className="rounded-full px-6 py-1.5 text-sm font-medium transition-colors data-[state=on]:bg-transparent data-[state=on]:text-foreground data-[state=off]:text-muted-foreground"
        >
          Delivery
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};