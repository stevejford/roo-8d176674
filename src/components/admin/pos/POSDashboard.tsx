import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { POSMenuBrowser } from './POSMenuBrowser';

export const POSDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleAddItem = async (product: any) => {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            status: 'pending',
            total_amount: product.price,
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: itemError } = await supabase
        .from('order_items')
        .insert([
          {
            order_id: order.id,
            product_id: product.id,
            quantity: 1,
            price: product.price
          }
        ]);

      if (itemError) throw itemError;

      toast({
        title: "Item Added",
        description: `${product.title} has been added to a new order.`,
      });

      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item to order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen">
      <POSMenuBrowser onSelect={handleAddItem} />
    </div>
  );
};