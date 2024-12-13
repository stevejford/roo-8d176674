import React from "react";

interface DeliveryModeSelectorProps {
  mode: 'pickup' | 'delivery';
  setMode: (mode: 'pickup' | 'delivery') => void;
}

export const DeliveryModeSelector = ({ mode, setMode }: DeliveryModeSelectorProps) => {
  return (
    <div className="inline-flex p-1 bg-gray-100 rounded-full relative">
      {/* Sliding background */}
      <div
        className={`absolute inset-y-1 w-[50%] bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
          mode === 'delivery' ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      
      {/* Buttons */}
      <button 
        onClick={() => setMode('pickup')}
        className={`relative px-6 py-2 rounded-full text-sm transition-colors ${
          mode === 'pickup' 
            ? 'text-gray-900' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Pickup
      </button>
      <button 
        onClick={() => setMode('delivery')}
        className={`relative px-6 py-2 rounded-full text-sm transition-colors ${
          mode === 'delivery' 
            ? 'text-gray-900' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Delivery
      </button>
    </div>
  );
};