import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
      const config = productPricing.config;
      return config.price || product.price || 0;
    }
    return product.price || 0;
  };

  return (
    <DialogContent className="max-w-6xl max-h-[90vh] p-0">
      <DialogHeader className="p-4 pb-0">
        <DialogTitle>Select Items</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col h-full">
        {/* Categories */}
        <div className="relative px-4">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-4">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="shrink-0"
                size="sm"
              >
                All Items
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="shrink-0"
                  size="sm"
                >
                  {category.title}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Products Grid */}
        <ScrollArea className="flex-1 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products?.map((product) => {
              const price = calculatePrice(product);
              return (
                <Card 
                  key={product.id}
                  className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onSelect({ ...product, price })}
                >
                  <div className="relative pb-[100%]">
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="absolute top-2 right-2 h-7 w-7 bg-white shadow-md hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-sm truncate">{product.title}</h3>
                    <p className="text-sm text-gray-500">
                      ${price.toFixed(2)}
                    </p>
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
