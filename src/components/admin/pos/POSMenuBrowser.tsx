import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface POSMenuBrowserProps {
  onSelect: (product: any) => void;
}

export const POSMenuBrowser = ({ onSelect }: POSMenuBrowserProps) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [quantities, setQuantities] = React.useState<{ [key: string]: number }>({});

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
        .select(`
          id, 
          title, 
          price, 
          image_url, 
          category_id,
          product_pricing (
            *,
            pricing_strategies (*)
          )
        `)
        .eq('active', true);

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const calculatePrice = (product: any) => {
    const productPricing = product.product_pricing?.[0];
    if (productPricing?.is_override) {
      const config = productPricing.config;
      return config.price || product.price || 0;
    }
    return product.price || 0;
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 0;
      const newQuantity = Math.max(0, current + delta);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleAddToOrder = (product: any) => {
    const quantity = quantities[product.id] || 1;
    for (let i = 0; i < quantity; i++) {
      onSelect(product);
    }
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header with category filters */}
      <div className="p-4 bg-white border-b">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="shrink-0 h-8 px-3 text-sm"
          >
            All Items
          </Button>
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="shrink-0 h-8 px-3 text-sm"
            >
              {category.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {products?.map((product) => {
            const price = calculatePrice(product);
            const quantity = quantities[product.id] || 0;
            return (
              <Card 
                key={product.id}
                className="overflow-hidden hover:bg-gray-50 transition-colors"
              >
                <div className="relative pb-[60%]">
                  <img
                    src={product.image_url || '/placeholder.svg'}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-1.5">
                  <h3 className="font-medium text-xs truncate">{product.title}</h3>
                  <p className="text-xs text-gray-500">
                    ${price.toFixed(2)}
                  </p>
                  <div className="flex items-center justify-between mt-1 gap-1">
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-5 w-5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(product.id, -1);
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs w-4 text-center">{quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-5 w-5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(product.id, 1);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      className="h-5 text-xs px-2"
                      onClick={() => handleAddToOrder(product)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};