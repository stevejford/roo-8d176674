import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      console.log('Fetching products with pricing information');
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
      console.log('Fetched products with pricing:', data);
      return data as unknown as Product[];
    },
  });

  const { data: categoryPricing } = useQuery({
    queryKey: ['category-pricing'],
    queryFn: async () => {
      console.log('Fetching category pricing');
      const { data, error } = await supabase
        .from('category_pricing')
        .select(`
          *,
          pricing_strategies (*)
        `);
      
      if (error) throw error;
      console.log('Fetched category pricing:', data);
      return data;
    },
  });

  const filteredProducts = selectedCategory
    ? products?.filter(p => p.category_id === selectedCategory)
    : products;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 gap-0">
        <Tabs defaultValue={selectedCategory || 'all'} className="w-full h-full flex flex-col">
          <div className="p-4 border-b">
            <TabsList className="w-full h-auto flex-wrap gap-2">
              <TabsTrigger 
                value="all"
                onClick={() => setSelectedCategory(null)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All Items
              </TabsTrigger>
              {categories?.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};