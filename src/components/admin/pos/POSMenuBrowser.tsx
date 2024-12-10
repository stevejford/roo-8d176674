import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { PricingConfig } from '@/types/pricing';

interface POSMenuBrowserProps {
  onSelect: (product: any) => void;
}

export const POSMenuBrowser = ({ onSelect }: POSMenuBrowserProps) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

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
      const config = productPricing.config as PricingConfig;
      return config.price || product.price || 0;
    }
    return product.price || 0;
  };

  return (
    <DialogContent className="max-w-6xl h-[90vh]">
      <DialogHeader>
        <DialogTitle>Select Items</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col h-full">
        {/* Categories */}
        <div className="relative">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-4">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="shrink-0"
              >
                All Items
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="shrink-0"
                >
                  {category.title}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Products Grid */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {products?.map((product) => {
              const price = calculatePrice(product);
              return (
                <Card 
                  key={product.id}
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onSelect({ ...product, price })}
                >
                  {product.image_url && (
                    <div className="relative pb-[100%] mb-4">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-md"
                      />
                      <Button 
                        size="icon" 
                        variant="secondary"
                        className="absolute top-2 right-2 bg-white shadow-md hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-gray-500">
                        ${price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </DialogContent>
  );
};