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
      onValueChange={(value) => {
        if (value) setMode(value as 'pickup' | 'delivery');
      }}
      className="inline-flex h-10 items-center justify-center rounded-full bg-muted p-1"
    >
      <ToggleGroupItem
        value="pickup"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=off]:text-gray-600 hover:text-gray-900"
      >
        Pickup
      </ToggleGroupItem>
      <ToggleGroupItem
        value="delivery"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=off]:text-gray-600 hover:text-gray-900"
      >
        Delivery
      </ToggleGroupItem>
    </ToggleGroup>
  );
};