import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DeliveryModeSelectorProps {
  mode: 'pickup' | 'delivery';
  setMode: (mode: 'pickup' | 'delivery') => void;
}

export const DeliveryModeSelector = ({ mode, setMode }: DeliveryModeSelectorProps) => {
  return (
    <ToggleGroup 
      type="single" 
      value={mode}
      onValueChange={(value) => value && setMode(value as 'pickup' | 'delivery')}
      className="bg-muted p-1 rounded-full"
    >
      <ToggleGroupItem 
        value="pickup" 
        className="data-[state=on]:bg-white data-[state=on]:text-foreground rounded-full px-6 py-1.5 text-sm font-medium transition-colors"
      >
        Pickup
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="delivery" 
        className="data-[state=on]:bg-white data-[state=on]:text-foreground rounded-full px-6 py-1.5 text-sm font-medium transition-colors"
      >
        Delivery
      </ToggleGroupItem>
    </ToggleGroup>
  );
};