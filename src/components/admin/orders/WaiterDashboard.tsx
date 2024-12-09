import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import type { Database } from '@/integrations/supabase/types';
import { TableGrid } from './TableGrid';
import { OrderManagement } from './OrderManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useWaiterOrders } from '@/hooks/useWaiterOrders';
import { WaiterOrderCard } from './WaiterOrderCard';
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

export const WaiterDashboard = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { singleOrder, orders, isLoading, isLoadingSingle } = useWaiterOrders(orderId);

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
          <OrderManagement
            orders={orders}
            isLoading={isLoading}
            onUpdateStatus={updateOrderStatus}
            statusColors={statusColors}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};