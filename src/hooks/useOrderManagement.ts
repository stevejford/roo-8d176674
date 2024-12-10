import { useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

export const useOrderManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateOrderStatus = async (orderId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['active-orders'] });
      return { error: null };
    } catch (error: any) {
      console.error('Order update error:', error);
      return { error };
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      // Instead of deleting, we mark as cancelled and set deleted_at
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled' as OrderStatus,
          deleted_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Deletion process failed:', error);
        toast({
          title: "Error",
          description: "Failed to delete the order. Please try again.",
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Order Deleted",
        description: "The order has been successfully deleted",
      });

      await queryClient.invalidateQueries({ queryKey: ['active-orders'] });
      return { error: null };
    } catch (error: any) {
      console.error('Order deletion error:', error);
      toast({
        title: "Error",
        description: "Failed to delete the order. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const completeOrder = async (orderId: string, amount: number) => {
    return updateOrderStatus(orderId, {
      status: 'completed' as OrderStatus,
      payment_status: 'completed',
      payment_method: 'cash',
      paid_amount: amount
    });
  };

  const sendToKitchen = async (orderId: string) => {
    return updateOrderStatus(orderId, {
      status: 'preparing' as OrderStatus,
      order_taken_at: new Date().toISOString()
    });
  };

  return {
    deleteOrder,
    completeOrder,
    sendToKitchen
  };
};