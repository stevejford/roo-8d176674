import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export const useOrderOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteOrder = async (orderId: string) => {
    console.log('Attempting to delete order:', orderId);
    
    // First, delete related order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('Error deleting order items:', itemsError);
      throw itemsError;
    }

    // Then delete the order itself
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (orderError) {
      console.error('Error deleting order:', orderError);
      throw orderError;
    }

    await queryClient.invalidateQueries({ queryKey: ['pos-orders'] });
  };

  const updateCustomerName = async (orderId: string, name: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ customer_name: name })
      .eq('id', orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update customer name",
        variant: "destructive"
      });
    }
  };

  const sendToKitchen = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'preparing' })
      .eq('id', orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send order to kitchen",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Order sent to kitchen",
      });
      await queryClient.invalidateQueries({ queryKey: ['pos-orders'] });
    }
  };

  return {
    deleteOrder,
    updateCustomerName,
    sendToKitchen
  };
};