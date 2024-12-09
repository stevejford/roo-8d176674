import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MenuBrowserDialog } from '../menu/MenuBrowserDialog';
import { DollarSign, CreditCard, Banknote, Plus } from "lucide-react";

interface OrderActionsProps {
  status: string;
  orderTotal: number;
  isProcessingPayment: boolean;
  onPayment: (method: 'cash' | 'card') => Promise<void>;
  onAddItem: (product: any) => Promise<void>;
}

export const OrderActions = ({ 
  status, 
  orderTotal,
  isProcessingPayment,
  onPayment,
  onAddItem
}: OrderActionsProps) => {
  return (
    <div className="border-t pt-4">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-lg">Total</span>
        <span className="font-bold text-xl">${orderTotal.toFixed(2)}</span>
      </div>

      <div className="flex gap-3">
        {status === 'delivered' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1">
                <DollarSign className="w-5 h-5 mr-2" />
                Process Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <p className="text-lg font-semibold">
                  Total Amount: ${orderTotal.toFixed(2)}
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => onPayment('card')}
                    disabled={isProcessingPayment}
                    className="flex-1"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Card Payment
                  </Button>
                  <Button
                    onClick={() => onPayment('cash')}
                    disabled={isProcessingPayment}
                    className="flex-1"
                  >
                    <Banknote className="w-5 h-5 mr-2" />
                    Cash Payment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Items
            </Button>
          </DialogTrigger>
          <MenuBrowserDialog onSelectItem={onAddItem} />
        </Dialog>
      </div>
    </div>
  );
};