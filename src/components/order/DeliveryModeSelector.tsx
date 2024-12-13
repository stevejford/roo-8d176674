import React from "react";
import { Toggle } from "@/components/ui/toggle";

interface DeliveryModeSelectorProps {
  mode: 'pickup' | 'delivery';
  setMode: (mode: 'pickup' | 'delivery') => void;
}

export const DeliveryModeSelector = ({ mode, setMode }: DeliveryModeSelectorProps) => {
  return (
    <div className="bg-muted rounded-full p-1 flex gap-1">
      <Toggle
        pressed={mode === 'pickup'}
        onPressedChange={() => setMode('pickup')}
        className="w-[100px] data-[state=on]:bg-white rounded-full transition-colors"
      >
        Pickup
      </Toggle>
      <Toggle
        pressed={mode === 'delivery'}
        onPressedChange={() => setMode('delivery')}
        className="w-[100px] data-[state=on]:bg-white rounded-full transition-colors"
      >
        Delivery
      </Toggle>
    </div>
  );
};