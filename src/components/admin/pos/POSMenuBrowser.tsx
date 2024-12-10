import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuCard } from '@/components/MenuCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface POSMenuBrowserProps {
  onSelect: (product: any) => void;
}

export const POSMenuBrowser = ({ onSelect }: POSMenuBrowserProps) => {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*, products(*)')
        .order('position');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <DialogContent className="max-w-5xl h-[80vh]">
      <DialogHeader>
        <DialogTitle>Select Items</DialogTitle>
      </DialogHeader>

      <ScrollArea className="h-[calc(80vh-8rem)]">
        <div className="space-y-8">
          {categories?.map((category) => (
            <div key={category.id} className="space-y-4">
              <h3 className="text-xl font-semibold">{category.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.products?.map((product) => (
                  <MenuCard
                    key={product.id}
                    title={product.title}
                    price={product.price}
                    description={product.description || ''}
                    image={product.image_url || ''}
                    onClick={() => onSelect(product)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};