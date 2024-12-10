import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface POSMenuBrowserProps {
  orderId?: string | null;
  onOrderComplete?: () => void;
}

export const POSMenuBrowser = ({ orderId, onOrderComplete }: POSMenuBrowserProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ['pos-products', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('active', true);

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 0;
      const newQuantity = Math.max(0, current + delta);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleAddToOrder = async (product: any, quantity: number) => {
    if (!orderId) {
      toast({
        title: "Error",
        description: "No order selected",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('order_items')
        .insert({
          order_id: orderId,
          product_id: product.id,
          quantity: quantity,
          price: product.price
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Added ${quantity}x ${product.title} to order`,
      });

      setQuantities(prev => ({ ...prev, [product.id]: 0 }));

      if (onOrderComplete) {
        onOrderComplete();
      }
    } catch (error) {
      console.error('Error adding items to order:', error);
      toast({
        title: "Error",
        description: "Failed to add items to order",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onOrderComplete}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        <ScrollArea className="pb-3">
          <div className="flex gap-2 px-4">
            <Button 
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
              className="shrink-0"
            >
              All Items
            </Button>
            {categories?.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                size="sm"
                className="shrink-0"
              >
                {category.title}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1">
          {products?.map((product) => {
            const quantity = quantities[product.id] || 0;
            return (
              <Card 
                key={product.id}
                className="overflow-hidden hover:bg-gray-50 transition-colors w-[120px]"
              >
                <div className="w-[120px] h-[120px] flex items-center justify-center">
                  <img
                    src={product.image_url || '/placeholder.svg'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-1">
                  <h3 className="font-medium text-xs truncate">{product.title}</h3>
                  <p className="text-xs text-gray-500 mb-1">
                    ${product.price?.toFixed(2)}
                  </p>
                  <div className="flex items-center justify-between gap-0.5">
                    <div className="flex items-center gap-0.5">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-5 w-5"
                        onClick={() => handleQuantityChange(product.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs w-4 text-center">{quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-5 w-5"
                        onClick={() => handleQuantityChange(product.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      className="h-5 text-xs px-1.5"
                      onClick={() => handleAddToOrder(product, quantity)}
                      disabled={quantity === 0}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};