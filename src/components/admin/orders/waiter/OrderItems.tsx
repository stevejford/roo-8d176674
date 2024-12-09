import React from 'react';
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface OrderItem {
  id: string;
  quantity: number;
  product: {
    title: string;
  };
  price: number;
  size?: string;
  notes?: string;
}

interface OrderItemsProps {
  items: OrderItem[];
}

export const OrderItems = ({ items }: OrderItemsProps) => {
  const { toast } = useToast();

  const handleRemoveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('order_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Item Removed",
        description: "The item has been removed from the order",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from order",
        variant: "destructive",
      });
    }
  };

  // Calculate total price
  const totalPrice = items?.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0) || 0;

  return (
    <div>
      <div className="space-y-3 mb-6">
        {items?.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-lg">{item.quantity}x</span>
              <div>
                <span className="text-base">{item.product?.title}</span>
                {item.size && (
                  <span className="text-sm text-gray-500 ml-2">({item.size})</span>
                )}
                {item.notes && (
                  <p className="text-sm text-gray-600 italic">Note: {item.notes}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};