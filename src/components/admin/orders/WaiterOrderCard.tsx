import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { OrderHeader } from './waiter/OrderHeader';
import { OrderItems } from './waiter/OrderItems';
import { OrderActions } from './waiter/OrderActions';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";

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
    console.log('Calculating total for order items:', order.order_items);
    return order.order_items?.reduce((acc: number, item: any) => {
      const itemPrice = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const itemTotal = itemPrice * quantity;
      console.log(`Item: ${item.product?.title}, Price: ${itemPrice}, Quantity: ${quantity}, Total: ${itemTotal}`);
      return acc + itemTotal;
    }, 0) || 0;
  };

  const handlePayment = async (method: 'cash' | 'card') => {
    setIsProcessingPayment(true);
    try {
      const total = calculateTotal();
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          payment_method: method,
          paid_amount: total,
          status: 'completed'
        })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Payment Processed",
        description: `Payment of $${total.toFixed(2)} processed successfully via ${method}`,
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

  const handleSendToKitchen = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'preparing',
          order_taken_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Order Sent to Kitchen",
        description: "The order has been sent to the kitchen for preparation",
      });
      onUpdateStatus(order.id, 'preparing');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send order to kitchen",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = async (product: any) => {
    console.log('Adding product to order:', product);
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
            price: product.price // Ensure we use the passed price
          })
          .eq('id', existingItem.id);
      } else {
        await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: product.id,
            quantity: 1,
            price: product.price, // Ensure we use the passed price
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
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-xl">${calculateTotal().toFixed(2)}</span>
        </div>

        <div className="flex gap-3">
          {order.status === 'pending' && (
            <Button 
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={handleSendToKitchen}
            >
              <UtensilsCrossed className="w-4 h-4 mr-2" />
              Send to Kitchen
            </Button>
          )}
          
          <OrderActions
            status={order.status}
            orderTotal={calculateTotal()}
            isProcessingPayment={isProcessingPayment}
            onPayment={handlePayment}
            onAddItem={handleAddItem}
          />
        </div>
      </div>
    </div>
  );
};