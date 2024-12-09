import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuProductCard } from './MenuProductCard';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface MenuBrowserProps {
  onSelectItem: (product: Product) => void;
}

export const MenuBrowser = ({ onSelectItem }: MenuBrowserProps) => {
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
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products with pricing information');
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category_id,
          price
        `)
        .eq('active', true)
        .order('position');
      
      if (error) throw error;
      console.log('Fetched products:', data);
      return data;
    },
  });

  const productsByCategory = React.useMemo(() => {
    if (!products) return {};
    
    return products.reduce((acc: { [key: string]: Product[] }, product) => {
      const categoryId = product.category_id || 'uncategorized';
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(product);
      return acc;
    }, {});
  }, [products]);

  if (!categories || !products) return null;

  return (
    <Tabs defaultValue={categories[0]?.id} className="w-full">
      <ScrollArea className="w-full">
        <TabsList className="w-full justify-start">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="px-4 py-2"
            >
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>

      {categories.map((category) => (
        <TabsContent 
          key={category.id} 
          value={category.id}
          className="mt-4 space-y-2"
        >
          {productsByCategory[category.id]?.map((product) => (
            <MenuProductCard
              key={product.id}
              product={product}
              categoryId={category.id}
              onSelect={onSelectItem}
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};