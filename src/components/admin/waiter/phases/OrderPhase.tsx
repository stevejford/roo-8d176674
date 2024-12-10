import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const OrderPhase = () => {
  const { data: activeOrders } = useQuery({
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
        .in('status', ['pending', 'confirmed', 'preparing'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Active Orders</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeOrders?.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Table {order.table_number}</h3>
                <p className="text-sm text-gray-500">{order.customer_name}</p>
              </div>
              <Badge>{order.status}</Badge>
            </div>
            
            <div className="space-y-2">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.product?.title}</span>
                  <span>${item.price}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};