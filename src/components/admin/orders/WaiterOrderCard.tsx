import { format } from 'date-fns';
import { CheckCircle, Send, Eye, DollarSign, CreditCard, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WaiterOrderCardProps {
  order: any;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  statusColors: Record<string, string>;
  isNew?: boolean;
}

type PaymentMethod = 'cash' | 'card';

export const WaiterOrderCard = ({ order, onUpdateStatus, statusColors, isNew = false }: WaiterOrderCardProps) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { toast } = useToast();

  const calculateTotal = () => {
    return order.order_items?.reduce((acc: number, item: any) => {
      return acc + (item.price * item.quantity);
    }, 0) || 0;
  };

  const handlePayment = async (method: PaymentMethod) => {
    setIsProcessingPayment(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          payment_method: method,
          paid_amount: calculateTotal(),
          status: 'completed'
        })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Payment Processed",
        description: `Payment of $${calculateTotal().toFixed(2)} processed successfully via ${method}`,
      });
      setShowPaymentDialog(false);
      onUpdateStatus(order.id, 'completed');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const orderTotal = calculateTotal();

  return (
    <div className={`border rounded-lg p-6 bg-white shadow-sm space-y-6 transition-all duration-300 ${
      highlight ? 'ring-2 ring-blue-500 animate-pulse' : ''
    }`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Order #{order.id.slice(0, 8)}</h3>
          <p className="text-sm text-gray-500">
            {format(new Date(order.created_at), 'HH:mm')}
          </p>
          {order.table_number && (
            <p className="text-base font-medium text-gray-700">
              Table {order.table_number}
            </p>
          )}
        </div>
        <Badge 
          variant="secondary"
          className={`${statusColors[order.status]} px-4 py-1.5`}
        >
          {order.status}
        </Badge>
      </div>

      <div className="space-y-3">
        {order.order_items?.map((item: any) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-lg">{item.quantity}x</span>
              <div>
                <span className="text-base">{item.product?.title}</span>
                {item.size && (
                  <span className="text-sm text-gray-500 ml-2">({item.size})</span>
                )}
                {item.notes && (
                  <p className="text-sm text-gray-600 italic">Note: {item.notes}</p>
                )}
              </div>
            </div>
            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-xl">${orderTotal.toFixed(2)}</span>
        </div>

        <div className="flex gap-3">
          {order.status === 'pending' && (
            <Button
              onClick={() => onUpdateStatus(order.id, 'confirmed')}
              className="flex-1"
              size="lg"
            >
              <Send className="w-5 h-5 mr-2" />
              Send to Kitchen
            </Button>
          )}
          {order.status === 'ready' && (
            <Button
              onClick={() => onUpdateStatus(order.id, 'delivered')}
              className="flex-1"
              size="lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Mark Delivered
            </Button>
          )}
          {order.status === 'delivered' && order.payment_status !== 'completed' && (
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <DialogTrigger asChild>
                <Button className="flex-1" size="lg">
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
                      onClick={() => handlePayment('card')}
                      disabled={isProcessingPayment}
                      className="flex-1"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Card Payment
                    </Button>
                    <Button
                      onClick={() => handlePayment('cash')}
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
        </div>
      </div>
    </div>
  );
};