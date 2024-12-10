import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const PaymentPhase = () => {
  const { data: payableTables } = useQuery({
    queryKey: ['payable-tables'],
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
        .eq('status', 'delivered')
        .eq('payment_status', 'pending')
        .is('deleted_at', null);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Required</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payableTables?.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Table {order.table_number}</h3>
                <p className="text-sm text-gray-500">{order.customer_name}</p>
              </div>
              <Badge>Payment Required</Badge>
            </div>
            
            <div className="space-y-4">
              <div className="text-xl font-bold">
                Total: ${order.total_amount}
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1" variant="outline">Cash</Button>
                <Button className="flex-1">Card</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};