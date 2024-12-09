import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const OrderList = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  React.useEffect(() => {
    // Subscribe to changes in the orders table
    const ordersSubscription = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          console.log('Received real-time update:', payload);
          
          // Show toast notification based on the type of change
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Order Received",
              description: `Order #${payload.new.id.slice(0, 8)} has been created.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Order Updated",
              description: `Order #${payload.new.id.slice(0, 8)} status changed to ${payload.new.status}.`,
            });
          }

          // Invalidate the orders query to trigger a refetch
          await queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      ordersSubscription.unsubscribe();
    };
  }, [queryClient, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                <TableCell>{order.customer_name || 'Anonymous'}</TableCell>
                <TableCell>
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="text-sm">
                      {item.quantity}x {item.product?.title}
                    </div>
                  ))}
                </TableCell>
                <TableCell>${order.total_amount}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={statusColors[order.status as keyof typeof statusColors]}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), 'MMM d, yyyy HH:mm')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};