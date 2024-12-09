import React from 'react';
import { DeliveryModeSelector } from "./DeliveryModeSelector";

interface OrderHeaderProps {
  mode: 'pickup' | 'delivery';
  setMode: (mode: 'pickup' | 'delivery') => void;
}

export const OrderHeader = ({ mode, setMode }: OrderHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-[#2D3648]">Order</h2>
      <DeliveryModeSelector mode={mode} setMode={setMode} />
    </div>
  );
};