import React from "react";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  mode: 'pickup' | 'delivery';
  selectedTime: string;
  onTimeChange: () => void;
}

export const TimeSelector = ({ mode, selectedTime, onTimeChange }: TimeSelectorProps) => {
  return (
    <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
      <Clock className="h-5 w-5 text-gray-400 mt-1" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[#2D3648]">{mode === 'pickup' ? 'Pickup Time' : 'Delivery Time'}</h3>
          <button 
            onClick={onTimeChange}
            className="text-[#10B981] text-sm font-medium hover:text-[#059669] transition-colors"
          >
            CHANGE
          </button>
        </div>
        <p className="text-sm text-gray-600">{selectedTime}</p>
      </div>
    </div>
  );
};