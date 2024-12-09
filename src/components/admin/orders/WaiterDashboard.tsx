import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

  // Query for all active orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', 'active'],
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
        .in('status', ['pending', 'confirmed', 'preparing', 'ready', 'delivered'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Tables</h2>
        <TableGrid />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Active Orders</h2>
        <OrderManagement 
          orders={orders}
          isLoading={isLoading}
          onUpdateStatus={handleStatusChange}
          statusColors={statusColors}
        />
      </div>
    </div>
  );
};