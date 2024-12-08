import React from "react";

interface DeliveryModeSelectorProps {
  mode: 'pickup' | 'delivery';
  setMode: (mode: 'pickup' | 'delivery') => void;
}

export const DeliveryModeSelector = ({ mode, setMode }: DeliveryModeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[#2D3648] text-lg">Pickup/Delivery</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMode('pickup')}
            className={`px-4 py-2 rounded-full ${mode === 'pickup' ? 'bg-[#10B981] text-white' : 'bg-gray-100'}`}
          >
            Pickup
          </button>
          <button 
            onClick={() => setMode('delivery')}
            className={`px-4 py-2 rounded-full ${mode === 'delivery' ? 'bg-[#10B981] text-white' : 'bg-gray-100'}`}
          >
            Delivery
          </button>
        </div>
      </div>
    </div>
  );
};