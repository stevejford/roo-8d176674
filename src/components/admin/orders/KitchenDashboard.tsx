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
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Database } from '@/integrations/supabase/types';

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kitchen Orders</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders?.map((order) => (
          <div 
            key={order.id}
            className="border rounded-lg p-4 bg-white shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(order.created_at), 'HH:mm')}
                </p>
              </div>
              <Badge 
                variant="secondary"
                className={statusColors[order.status as keyof typeof statusColors]}
              >
                {order.status}
              </Badge>
            </div>

            <div className="space-y-2">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.quantity}x</span>
                    <span>{item.product?.title}</span>
                  </div>
                  {item.notes && (
                    <span className="text-sm text-gray-500">Note: {item.notes}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              {order.status === 'confirmed' && (
                <Button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  className="flex-1"
                  variant="outline"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Start Preparing
                </Button>
              )}
              {order.status === 'preparing' && (
                <>
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="flex-1"
                    variant="outline"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Ready
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    variant="destructive"
                    size="icon"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};