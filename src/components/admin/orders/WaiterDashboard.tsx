import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { WaiterOrderCard } from './WaiterOrderCard';
import type { Database } from '@/integrations/supabase/types';

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

export const WaiterDashboard = () => {
  const { orderId } = useParams();
  const queryClient = useQueryClient();

  // Query for specific order when orderId is present
  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });

  // Set up real-time subscription
  useEffect(() => {
    const orderChannel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: orderId ? `id=eq.${orderId}` : undefined
        },
        () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items',
          filter: orderId ? `order_id=eq.${orderId}` : undefined
        },
        () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        }
      )
      .subscribe();

    return () => {
      orderChannel.unsubscribe();
    };
  }, [orderId, queryClient]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating status:', error);
    }
  };

  // If we have an orderId and the order data, show the order details
  if (orderId && order) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
        </div>

        <WaiterOrderCard 
          order={order}
          onUpdateStatus={handleStatusChange}
          statusColors={statusColors}
          isNew={false}
        />
      </div>
    );
  }

  // Show a message if no order is selected
  return (
    <div className="container mx-auto py-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-600">
          Select an order to view details
        </h2>
      </div>
    </div>
  );
};