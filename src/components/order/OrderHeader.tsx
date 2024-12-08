import React from "react";
import { X } from "lucide-react";

interface OrderHeaderProps {
  onClose: () => void;
}

export const OrderHeader = ({ onClose }: OrderHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold text-[#2D3648]">Order</h2>
      <button 
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};