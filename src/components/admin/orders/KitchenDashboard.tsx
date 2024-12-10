import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { UtensilsCrossed } from "lucide-react";
import { Database } from '@/integrations/supabase/types';
import { KitchenOrderCard } from './KitchenOrderCard';
import { KitchenOrderSkeleton } from './KitchenOrderSkeleton';

type OrderStatus = Database['public']['Enums']['order_status'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const KitchenDashboard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['kitchen-orders'],
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
        .in('status', ['confirmed', 'preparing'])
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    }
  };

  React.useEffect(() => {
    const ordersSubscription = supabase
      .channel('kitchen-orders-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `status=in.(confirmed,preparing)`
        },
        async (payload) => {
          console.log('Received kitchen order update:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Order",
              description: `Order #${payload.new.id.slice(0, 8)} needs to be prepared.`,
            });
          }

          await queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
        }
      )
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
    };
  }, [queryClient, toast]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Kitchen Orders</h2>
        </div>
        <div className="border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <KitchenOrderSkeleton />
            <KitchenOrderSkeleton />
            <KitchenOrderSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Kitchen Orders</h2>
        </div>
        <div className="border rounded-lg p-6">
          <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-500">
            <UtensilsCrossed className="w-12 h-12" />
            <h3 className="text-xl font-semibold">No Orders to Prepare</h3>
            <p>When new orders come in, they will appear here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kitchen Orders</h2>
      </div>

      <div className="border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders?.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={updateOrderStatus}
              statusColors={statusColors}
            />
          ))}
        </div>
      </div>
    </div>
  );
};