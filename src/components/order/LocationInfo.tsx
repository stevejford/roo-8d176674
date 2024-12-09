import React from 'react';
import { MapPin, Clock } from "lucide-react";

interface LocationInfoProps {
  storeName: string;
  storeAddress: string;
  selectedTime: string;
  onTimeChange: () => void;
}

export const LocationInfo = ({ 
  storeName, 
  storeAddress, 
  selectedTime, 
  onTimeChange 
}: LocationInfoProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex items-start space-x-3">
        <MapPin className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-[#2D3648]">{storeName}</h3>
          <p className="text-sm text-gray-600">{storeAddress}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-[#2D3648]">Pickup Time</h3>
            <p className="text-sm text-gray-600">{selectedTime}</p>
          </div>
        </div>
        <button 
          onClick={onTimeChange}
          className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors"
        >
          CHANGE
        </button>
      </div>
    </div>
  );
};