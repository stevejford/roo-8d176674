import React from 'react';
import { useCartStore } from "@/stores/useCartStore";
import type { Voucher } from "@/hooks/useVoucherValidation";

interface OrderTotalsProps {
  validVoucher: Voucher | null;
  calculateTotal: () => number;
}

export const OrderTotals = ({ validVoucher, calculateTotal }: OrderTotalsProps) => {
  const { items } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = calculateTotal();
  const discount = subtotal - total;

  if (!validVoucher) return null;

  return (
    <div className="mb-2 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-green-600 font-medium">
        <span>
          Discount ({validVoucher.discount_type === 'percentage' 
            ? `${validVoucher.discount_value}%` 
            : `$${validVoucher.discount_value}`}):
        </span>
        <span>-${discount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-semibold mt-1 text-base border-t pt-1">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};