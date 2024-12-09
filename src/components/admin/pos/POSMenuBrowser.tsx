import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

  // Fetch category pricing data
  const { data: categoryPricing } = useQuery({
    queryKey: ['category-pricing', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return null;
      
      const { data, error } = await supabase
        .from('category_pricing')
        .select(`
          *,
          pricing_strategies (*)
        `)
        .eq('category_id', selectedCategory)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!selectedCategory,
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
    console.log('Calculating price for product:', product.title);
    
    // First check for product-specific pricing override
    const productPricing = product.product_pricing?.[0];
    if (productPricing?.is_override) {
      console.log('Using product override pricing');
      const config = productPricing.config as PricingConfig;
      
      switch (productPricing.pricing_strategies?.type) {
        case 'simple':
          return config.price || product.price || 0;
        case 'portion_based':
          return config.portions?.[0]?.price || product.price || 0;
        default:
          return product.price || 0;
      }
    }

    // Then check for category pricing
    if (categoryPricing?.pricing_strategies) {
      console.log('Using category pricing');
      const config = categoryPricing.config as PricingConfig;
      
      switch (categoryPricing.pricing_strategies.type) {
        case 'simple':
          return config.price || product.price || 0;
        case 'portion_based':
          return config.portions?.[0]?.price || product.price || 0;
        default:
          return product.price || 0;
      }
    }

    // Fallback to product's default price
    console.log('Using default product price:', product.price);
    return product.price || 0;
  };

  return (
    <DialogContent className="max-w-5xl h-[80vh]">
      <DialogHeader>
        <DialogTitle>Select Items</DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="all" className="flex-1 h-full">
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

        <ScrollArea className="flex-1 h-[calc(80vh-10rem)]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {products?.map((product) => {
              const price = calculatePrice(product);
              return (
                <Card 
                  key={product.id}
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onSelect({ ...product, price })}
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-gray-500">
                        ${price.toFixed(2)}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </Tabs>
    </DialogContent>
  );
};