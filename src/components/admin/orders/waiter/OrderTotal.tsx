import React from 'react';

interface OrderTotalProps {
  total: number;
}

export const OrderTotal = ({ total }: OrderTotalProps) => {
  return (
    <div className="border-t pt-4">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-lg">Total</span>
        <span className="font-bold text-xl">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};