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
      className="relative inline-flex h-10 items-center justify-center rounded-full bg-muted p-1"
    >
      <div
        className={`absolute h-8 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
          mode === 'delivery' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
        }`}
      />
      <ToggleGroupItem
        value="pickup"
        className="relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 text-sm font-medium transition-colors data-[state=on]:text-gray-900 data-[state=off]:text-gray-600 hover:text-gray-900"
      >
        Pickup
      </ToggleGroupItem>
      <ToggleGroupItem
        value="delivery"
        className="relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 text-sm font-medium transition-colors data-[state=on]:text-gray-900 data-[state=off]:text-gray-600 hover:text-gray-900"
      >
        Delivery
      </ToggleGroupItem>
    </ToggleGroup>
  );
};