import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { OrderHeader } from './waiter/OrderHeader';
import { OrderItems } from './waiter/OrderItems';
import { OrderActions } from './waiter/OrderActions';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Plus, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

  const handleSendToKitchen = async () => {
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

      if (itemsError) throw itemsError;

      // Then delete the order itself
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);

      if (orderError) throw orderError;

      toast({
        title: "Order Deleted",
        description: "The order has been successfully deleted",
      });

      // Update status to trigger a refresh of the orders list
      onUpdateStatus(order.id, 'cancelled');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete the order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`border rounded-lg p-6 bg-white shadow-sm space-y-6 transition-all duration-300 ${
      isNew ? 'ring-2 ring-blue-500 animate-pulse' : ''
    }`}>
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
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <OrderItems items={order.order_items} />
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-xl">${calculateTotal().toFixed(2)}</span>
        </div>

        <div className="flex flex-col gap-3">
          {order.status === 'pending' && (
            <>
              <Button 
                variant="outline"
                className="w-full justify-center"
                onClick={() => navigate('/admin/waiter/menu')}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteOrder}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};