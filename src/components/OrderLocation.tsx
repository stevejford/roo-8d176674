import React from "react";
import { MapPin, Search } from "lucide-react";

interface OrderLocationProps {
  mode: 'pickup' | 'delivery';
}

export const OrderLocation = ({ mode }: OrderLocationProps) => {
  if (mode === 'pickup') {
    return (
      <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
        <div>
          <h3 className="font-medium text-[#2D3648]">Roo Restaurant</h3>
          <p className="text-sm text-gray-600">
            7A Rockingham Beach Rd, Rockingham WA 6168
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
      <Search className="h-5 w-5 text-gray-400 mt-1" />
      <div className="flex-1">
        <input 
          type="text" 
          placeholder="Enter delivery address"
          className="w-full text-sm text-gray-600 bg-transparent border-none focus:outline-none p-0"
        />
      </div>
    </div>
  );
};