import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuProductCard } from './MenuProductCard';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Database } from '@/integrations/supabase/types';

type PricingStrategy = Database['public']['Tables']['pricing_strategies']['Row'];
type ProductPricingRow = Database['public']['Tables']['product_pricing']['Row'];

interface ProductPricing extends ProductPricingRow {
  pricing_strategies: PricingStrategy;
}

interface Product extends Database['public']['Tables']['products']['Row'] {
  product_pricing?: ProductPricing[];
}

interface MenuBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: any) => void;
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

  const handleProductSelect = (product: Product) => {
    console.log('Selected product with pricing:', product);
    onSelect(product);
    onClose();
  };

  const filteredProducts = selectedCategory
    ? products?.filter(p => p.category_id === selectedCategory)
    : products;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <Tabs defaultValue={selectedCategory || 'all'} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger 
              value="all"
              onClick={() => setSelectedCategory(null)}
            >
              All Items
            </TabsTrigger>
            {categories?.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="flex-1 px-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredProducts?.map((product) => {
                console.log('Rendering product:', product.title, 'with price:', product.price);
                console.log('Product pricing:', product.product_pricing?.[0]);
                console.log('Category pricing:', categoryPricing?.find(
                  cp => cp.category_id === product.category_id
                ));
                
                return (
                  <MenuProductCard
                    key={product.id}
                    product={product}
                    categoryId={product.category_id || ''}
                    productPricing={product.product_pricing?.[0]}
                    categoryPricing={categoryPricing?.find(
                      cp => cp.category_id === product.category_id
                    )}
                    onSelect={handleProductSelect}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};