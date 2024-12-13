import React from "react";

interface DeliveryModeSelectorProps {
  mode: 'pickup' | 'delivery';
  setMode: (mode: 'pickup' | 'delivery') => void;
}

export const DeliveryModeSelector = ({ mode, setMode }: DeliveryModeSelectorProps) => {
  return (
    <div className="inline-flex p-1 bg-gray-100 rounded-full">
      <button 
        onClick={() => setMode('pickup')}
        className={`px-6 py-2 rounded-full text-sm transition-colors ${
          mode === 'pickup' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Pickup
      </button>
      <button 
        onClick={() => setMode('delivery')}
        className={`px-6 py-2 rounded-full text-sm transition-colors ${
          mode === 'delivery' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Delivery
      </button>
    </div>
  );
};