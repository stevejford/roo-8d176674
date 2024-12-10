import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { OrderCardContent } from './waiter/OrderCardContent';
import { OrderDeleteDialog } from './waiter/OrderDeleteDialog';
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

  const handlePayment = async (method: 'cash' | 'card') => {
    setIsProcessingPayment(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          payment_method: method,
          paid_amount: order.total_amount,
          status: 'completed' as OrderStatus
        })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Payment Processed",
        description: `Payment of $${order.total_amount.toFixed(2)} processed successfully via ${method}`,
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
      // First delete all order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', order.id);

      if (itemsError) {
        console.error('Error deleting order items:', itemsError);
        throw itemsError;
      }

      // Then delete the order itself
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);

      if (orderError) {
        console.error('Error deleting order:', orderError);
        throw orderError;
      }

      toast({
        title: "Order Deleted",
        description: "The order has been successfully deleted",
      });

      setShowDeleteDialog(false);
      // Notify parent component to update the UI
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

  const handleCardClick = () => {
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
      <OrderCardContent
        order={order}
        statusColors={statusColors}
        onSendToKitchen={handleSendToKitchen}
        onAddItems={handleAddItems}
        onDeleteClick={handleDeleteClick}
        onPayment={handlePayment}
        isProcessingPayment={isProcessingPayment}
      />

      <OrderDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteOrder}
      />
    </div>
  );
};