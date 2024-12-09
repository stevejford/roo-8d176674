import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList } from "lucide-react";
import { WaiterOrderCard } from './WaiterOrderCard';
import { KitchenOrderSkeleton } from './KitchenOrderSkeleton';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface OrderManagementProps {
  orders: any[] | null;
  isLoading: boolean;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  statusColors: Record<string, string>;
}

export const OrderManagement = ({ 
  orders, 
  isLoading, 
  onUpdateStatus,
  statusColors 
}: OrderManagementProps) => {
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timeouts = new Map();

    orders?.forEach(order => {
      if (newOrderIds.has(order.id)) {
        const timeout = setTimeout(() => {
          setNewOrderIds(prev => {
            const updated = new Set(prev);
            updated.delete(order.id);
            return updated;
          });
        }, 3000);
        timeouts.set(order.id, timeout);
      }
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [orders, newOrderIds]);

  useEffect(() => {
    if (orders?.length) {
      const lastOrder = orders[0];
      if (lastOrder && Date.now() - new Date(lastOrder.created_at).getTime() < 5000) {
        setNewOrderIds(prev => new Set(prev).add(lastOrder.id));
      }
    }
  }, [orders]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KitchenOrderSkeleton />
        <KitchenOrderSkeleton />
        <KitchenOrderSkeleton />
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-500">
        <ClipboardList className="w-12 h-12" />
        <h3 className="text-xl font-semibold">No Orders to Handle</h3>
        <p>When new orders come in or are ready for delivery, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders?.map((order) => (
        <WaiterOrderCard
          key={order.id}
          order={order}
          onUpdateStatus={onUpdateStatus}
          statusColors={statusColors}
          isNew={newOrderIds.has(order.id)}
        />
      ))}
    </div>
  );
};