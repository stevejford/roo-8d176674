import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MenuProductCard } from './MenuProductCard';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type PricingStrategy = Tables['pricing_strategies']['Row'];
type ProductPricingRow = Tables['product_pricing']['Row'];
type ProductRow = Tables['products']['Row'];

interface ProductPricing extends Omit<ProductPricingRow, 'pricing_strategies'> {
  pricing_strategies: PricingStrategy;
}

interface Product extends Omit<ProductRow, 'product_pricing'> {
  product_pricing?: ProductPricing[];
}

interface MenuBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
}

export const MenuBrowser = ({ isOpen, onClose, onSelect }: MenuBrowserProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    queryKey: ['products-with-pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_pricing (
            *,
            pricing_strategies (*)
          )
        `)
        .eq('active', true)
        .order('position');
      
      if (error) throw error;
      return data as unknown as Product[];
    },
  });

  const { data: categoryPricing } = useQuery({
    queryKey: ['category-pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('category_pricing')
        .select(`
          *,
          pricing_strategies (*)
        `);
      
      if (error) throw error;
      return data;
    },
  });

  const filteredProducts = selectedCategory
    ? products?.filter(p => p.category_id === selectedCategory)
    : products;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-full h-screen max-h-screen p-0 m-0 rounded-none">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <ScrollArea className="w-full">
              <div className="flex space-x-2 pb-2">
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
            </ScrollArea>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {filteredProducts?.map((product) => (
                <MenuProductCard
                  key={product.id}
                  product={product}
                  categoryId={product.category_id || ''}
                  productPricing={product.product_pricing?.[0]}
                  categoryPricing={categoryPricing?.find(
                    cp => cp.category_id === product.category_id
                  )}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};