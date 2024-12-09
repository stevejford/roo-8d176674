import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuBrowser } from './MenuBrowser';
import { WaiterOrderCard } from './WaiterOrderCard';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ClipboardList } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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

  // Query for all active orders when no specific order is selected
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

  const handleAddItem = async (product: any) => {
    if (!orderId) return;

    const { error } = await supabase
      .from('order_items')
      .insert({
        order_id: orderId,
        product_id: product.id,
        price: product.price,
      });

    if (error) {
      console.error('Error adding item:', error);
      return;
    }

    setIsMenuOpen(false);
  };

  const handleStatusChange = async (status: OrderStatus) => {
    if (!orderId) return;

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
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button>
                <Menu className="mr-2 h-4 w-4" />
                Add Items
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <div className="h-full py-6">
                <MenuBrowser onSelectItem={handleAddItem} />
              </div>
            </SheetContent>
          </Sheet>
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

  // Show the order management view when no specific order is selected
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Active Orders</h1>
      </div>
      <OrderManagement 
        orders={orders}
        isLoading={isLoading}
        onUpdateStatus={handleStatusChange}
        statusColors={statusColors}
      />
    </div>
  );
};