import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Database } from '@/integrations/supabase/types';
import { WaiterOrderCard } from './WaiterOrderCard';
import { KitchenOrderSkeleton } from './KitchenOrderSkeleton';
import { TableGrid } from './TableGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

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
  const navigate = useNavigate();
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
    enabled: !orderId // Only fetch all orders when not viewing a single order
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
      queryClient.invalidateQueries({ queryKey: ['waiter-orders'] });
      queryClient.invalidateQueries({ queryKey: ['single-order', orderId] });
    }
  };

  React.useEffect(() => {
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

  // If viewing a single order
  if (orderId) {
    if (isLoadingSingle) {
      return <KitchenOrderSkeleton />;
    }

    if (!singleOrder) {
      return (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/waiter')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tables
          </Button>
          <div className="text-center">
            <p>Order not found</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/waiter')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tables
        </Button>
        <WaiterOrderCard
          order={singleOrder}
          onUpdateStatus={updateOrderStatus}
          statusColors={statusColors}
        />
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Waiter Dashboard</h2>
      </div>

      <Tabs defaultValue="tables">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables" className="mt-4">
          <TableGrid />
        </TabsContent>
        
        <TabsContent value="orders">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <KitchenOrderSkeleton />
              <KitchenOrderSkeleton />
              <KitchenOrderSkeleton />
            </div>
          ) : !orders?.length ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-500">
              <ClipboardList className="w-12 h-12" />
              <h3 className="text-xl font-semibold">No Orders to Handle</h3>
              <p>When new orders come in or are ready for delivery, they will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders?.map((order) => (
                <WaiterOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  statusColors={statusColors}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};