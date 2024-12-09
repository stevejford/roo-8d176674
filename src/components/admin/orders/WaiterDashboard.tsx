import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuBrowser } from './MenuBrowser';
import { WaiterOrderCard } from './WaiterOrderCard';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

export const WaiterDashboard = () => {
  const { orderId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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

  if (!order) return null;

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
        isNew={false}
      />
    </div>
  );
};