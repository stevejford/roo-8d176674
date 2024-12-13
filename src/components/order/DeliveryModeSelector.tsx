import React from "react";

interface DeliveryModeSelectorProps {
  mode: 'pickup' | 'delivery';
  setMode: (mode: 'pickup' | 'delivery') => void;
}

export const DeliveryModeSelector = ({ mode, setMode }: DeliveryModeSelectorProps) => {
  return (
    <div className="inline-flex h-10 items-center justify-center rounded-full bg-muted p-1">
      <div className="relative">
        {/* Background slider */}
        <div
          className={`absolute inset-0 h-8 w-[120px] bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
            mode === 'delivery' ? 'translate-x-[124px]' : 'translate-x-0'
          }`}
        />
        
        {/* Buttons */}
        <div className="relative z-10 flex">
          <button
            onClick={() => setMode('pickup')}
            className={`relative px-6 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
              mode === 'pickup' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pickup
          </button>
          <button
            onClick={() => setMode('delivery')}
            className={`relative px-6 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
              mode === 'delivery' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Delivery
          </button>
        </div>
      </div>
    </div>
  );
};