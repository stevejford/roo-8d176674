import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from 'react';

export const useWaiterOrders = (orderId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query for single order if orderId is present
  const { data: singleOrder, isLoading: isLoadingSingle } = useQuery({
    queryKey: ['single-order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              title
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!orderId
  });

  // Query for all waiter orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['waiter-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              title
            )
          )
        `)
        .in('status', ['pending', 'ready'])
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !orderId
  });

  useEffect(() => {
    const ordersSubscription = supabase
      .channel('waiter-orders-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `status=in.(pending,ready)`
        },
        async (payload) => {
          console.log('Received waiter order update:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Order",
              description: `Order #${payload.new.id.slice(0, 8)} has been placed.`,
            });
          }

          await queryClient.invalidateQueries({ queryKey: ['waiter-orders'] });
          if (orderId) {
            await queryClient.invalidateQueries({ queryKey: ['single-order', orderId] });
          }
        }
      )
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
    };
  }, [queryClient, toast, orderId]);

  return {
    singleOrder,
    orders,
    isLoading,
    isLoadingSingle
  };
};