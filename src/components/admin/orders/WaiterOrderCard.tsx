import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { OrderHeader } from './waiter/OrderHeader';
import { OrderItems } from './waiter/OrderItems';
import { OrderActions } from './waiter/OrderActions';
import { OrderTotal } from './waiter/OrderTotal';
import { DeleteOrderDialog } from './waiter/DeleteOrderDialog';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Plus, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface WaiterOrderCardProps {
  order: any;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return order.order_items?.reduce((acc: number, item: any) => {
      const itemPrice = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return acc + (itemPrice * quantity);
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
          status: 'completed' as OrderStatus
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

  const handleSendToKitchen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'preparing' as OrderStatus,
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

  const handleDeleteOrder = async () => {
    try {
      console.log('Starting deletion process for order:', order.id);
      
      // First delete all order items
      const { error: itemsError, data: deletedItems } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', order.id);

      if (itemsError) {
        console.error('Error deleting order items:', itemsError);
        throw itemsError;
      }
      console.log('Successfully deleted order items:', deletedItems);

      // Then delete the order itself
      const { error: orderError, data: deletedOrder } = await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);

      if (orderError) {
        console.error('Error deleting order:', orderError);
        throw orderError;
      }
      console.log('Successfully deleted order:', deletedOrder);

      toast({
        title: "Order Deleted",
        description: "The order has been successfully deleted",
      });

      // Close the dialog and update the parent component
      setShowDeleteDialog(false);
      onUpdateStatus(order.id, 'cancelled');
    } catch (error) {
      console.error('Deletion process failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete the order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!showDeleteDialog) {
      navigate(`/admin/waiter/order/${order.id}`);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleAddItems = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/admin/waiter/menu');
  };

  return (
    <div 
      className={`border rounded-lg p-6 bg-white shadow-sm space-y-6 transition-all duration-300 ${
        isNew ? 'ring-2 ring-blue-500 animate-pulse' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="flex justify-between items-start">
          <OrderHeader 
            orderId={order.id}
            status={order.status}
            statusColors={statusColors}
          />
          {order.status === 'pending' && (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <OrderItems items={order.order_items} />
        <OrderTotal total={calculateTotal()} />

        <div className="flex flex-col gap-3">
          {order.status === 'pending' && (
            <>
              <Button 
                variant="outline"
                className="w-full justify-center"
                onClick={handleAddItems}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Items
              </Button>
              <Button 
                className="w-full justify-center bg-orange-500 hover:bg-orange-600"
                onClick={handleSendToKitchen}
              >
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Send to Kitchen
              </Button>
            </>
          )}
          
          <OrderActions
            status={order.status}
            orderTotal={calculateTotal()}
            isProcessingPayment={isProcessingPayment}
            onPayment={handlePayment}
          />
        </div>
      </div>

      <DeleteOrderDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteOrder}
      />
    </div>
  );
};