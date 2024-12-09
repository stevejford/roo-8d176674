import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useCategoryPricing } from '@/hooks/useCategoryPricing';
import { useProductPricing } from '@/hooks/useProductPricing';
import type { Database } from '@/integrations/supabase/types';
import type { PricingConfig } from '@/types/pricing';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

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
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('position');
      
      if (error) throw error;
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

  const renderProductCard = (product: Product, categoryId: string) => {
    const { data: categoryPricing } = useCategoryPricing(categoryId);
    const { data: productPricingMap } = useProductPricing([product]);
    
    const productPricing = productPricingMap?.[product.id];
    const price = product.price_override ? product.price : (
      productPricing?.is_override ? 
        (productPricing.config as PricingConfig)?.price || product.price : 
        (categoryPricing?.config as PricingConfig)?.price || product.price
    );

    return (
      <Card 
        key={product.id} 
        className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
        onClick={() => onSelectItem(product)}
      >
        <div className="flex items-center space-x-4">
          {product.image_url && (
            <img 
              src={product.image_url} 
              alt={product.title}
              className="w-12 h-12 rounded-md object-cover"
            />
          )}
          <div>
            <h3 className="font-medium">{product.title}</h3>
            <p className="text-sm text-gray-500">${price?.toFixed(2)}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </Card>
    );
  };

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
          {productsByCategory[category.id]?.map((product) => 
            renderProductCard(product, category.id)
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};