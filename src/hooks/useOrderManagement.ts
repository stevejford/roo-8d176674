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

      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['active-orders'] });
      
      return { error: null };
    } catch (error: any) {
      console.error('Order update error:', error);
      return { error };
    }
  };

  const deleteOrder = async (orderId: string) => {
    console.log('Attempting to delete order:', orderId);
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          deleted_at: new Date().toISOString(),
          status: 'cancelled' as OrderStatus
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order Deleted",
        description: "The order has been successfully deleted",
      });

      // Invalidate and refetch
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
      payment_status: 'completed',
      payment_method: 'cash',
      paid_amount: amount,
      status: 'completed' as OrderStatus
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