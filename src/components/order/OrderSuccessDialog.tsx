import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Check } from "lucide-react";

interface OrderSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  orderDetails: {
    items: Array<{
      title: string;
      quantity: number;
      price: number;
      size?: string;
    }>;
    total: number;
    pickupTime: string;
  } | null;
}

export const OrderSuccessDialog = ({ open, onClose, orderDetails }: OrderSuccessDialogProps) => {
  if (!orderDetails) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl">Order Confirmed!</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Pickup Time</h3>
            <p className="text-gray-600">{orderDetails.pickupTime}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Order Items</h3>
            <div className="space-y-2">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.title}
                    {item.size && ` (${item.size})`}
                  </span>
                  <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};