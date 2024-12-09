import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { OrderHeader } from './waiter/OrderHeader';
import { OrderItems } from './waiter/OrderItems';
import { OrderActions } from './waiter/OrderActions';

interface WaiterOrderCardProps {
  order: any;
  onUpdateStatus: (orderId: string, status: string) => void;
  statusColors: Record<string, string>;
  isNew?: boolean;
}

export const WaiterOrderCard = ({ 
  order, 
  onUpdateStatus, 
  statusColors, 
  isNew = false 
}: WaiterOrderCardProps) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { toast } = useToast();

  const calculateTotal = () => {
    return order.order_items?.reduce((acc: number, item: any) => {
      return acc + (item.price * item.quantity);
    }, 0) || 0;
  };

  const handlePayment = async (method: 'cash' | 'card') => {
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

  const handleAddItem = async (product: any) => {
    try {
      const { data: existingItems } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)
        .eq('product_id', product.id);

      if (existingItems && existingItems.length > 0) {
        const existingItem = existingItems[0];
        await supabase
          .from('order_items')
          .update({ 
            quantity: existingItem.quantity + 1,
            price: product.price
          })
          .eq('id', existingItem.id);
      } else {
        await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: product.id,
            quantity: 1,
            price: product.price,
          });
      }

      toast({
        title: "Success",
        description: `Added ${product.title} to the order`,
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item to order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`border rounded-lg p-6 bg-white shadow-sm space-y-6 transition-all duration-300 ${
      isNew ? 'ring-2 ring-blue-500 animate-pulse' : ''
    }`}>
      <OrderHeader 
        orderId={order.id}
        status={order.status}
        statusColors={statusColors}
      />
      
      <OrderItems items={order.order_items} />
      
      <OrderActions
        status={order.status}
        orderTotal={calculateTotal()}
        isProcessingPayment={isProcessingPayment}
        onPayment={handlePayment}
        onAddItem={handleAddItem}
      />
    </div>
  );
};