import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { DollarSign, CreditCard, Banknote, Plus } from "lucide-react";

interface OrderActionsProps {
  status: string;
  orderTotal: number;
  isProcessingPayment: boolean;
  onPayment: (method: 'cash' | 'card') => Promise<void>;
}

export const OrderActions = ({ 
  status, 
  orderTotal,
  isProcessingPayment,
  onPayment
}: OrderActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3">
      {status === 'delivered' && (
        <Dialog>
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

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => navigate('/admin/waiter/menu')}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Items
      </Button>
    </div>
  );
};