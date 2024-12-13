import React from "react";
import { cn } from "@/lib/utils";

interface DeliveryModeSelectorProps {
  mode: 'pickup' | 'delivery';
  setMode: (mode: 'pickup' | 'delivery') => void;
}

export const DeliveryModeSelector = ({ mode, setMode }: DeliveryModeSelectorProps) => {
  return (
    <div className="relative inline-flex p-1 bg-gray-100 rounded-full">
      <div
        className={cn(
          "absolute inset-y-1 transition-transform duration-200 ease-in-out bg-white rounded-full shadow-sm w-[96px]",
          mode === 'delivery' ? 'translate-x-[96px]' : 'translate-x-0'
        )}
      />
      <button 
        onClick={() => setMode('pickup')}
        className={cn(
          "relative px-6 py-2 rounded-full text-sm transition-colors z-10",
          mode === 'pickup' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
        )}
      >
        Pickup
      </button>
      <button 
        onClick={() => setMode('delivery')}
        className={cn(
          "relative px-6 py-2 rounded-full text-sm transition-colors z-10",
          mode === 'delivery' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
        )}
      >
        Delivery
      </button>
    </div>
  );
};