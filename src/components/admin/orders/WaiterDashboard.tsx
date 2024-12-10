import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { TableGrid } from './TableGrid';
import { OrderManagement } from './OrderManagement';
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

  const { data: orders, isLoading } = useQuery({
    queryKey: ['active-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .in('status', ['pending', 'confirmed', 'preparing', 'ready'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const orderChannel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['active-orders'] });
        }
      )
      .subscribe();

    return () => {
      orderChannel.unsubscribe();
    };
  }, [queryClient]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    console.log('Updating order status:', { orderId, newStatus });
    
    if (newStatus === 'cancelled') {
      // For cancelled status, we don't need to update the database
      // as the order has already been deleted
      queryClient.setQueryData(['active-orders'], (oldData: any) => {
        return oldData?.filter((order: any) => order.id !== orderId) ?? [];
      });
      return;
    }

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['active-orders'] });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Tables</h2>
        <TableGrid />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Active Orders</h2>
        <OrderManagement
          orders={orders}
          isLoading={isLoading}
          onUpdateStatus={handleUpdateStatus}
          statusColors={statusColors}
        />
      </div>
    </div>
  );
};