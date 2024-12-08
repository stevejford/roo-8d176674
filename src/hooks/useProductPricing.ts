import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/components/admin/products/types';

export const useProductPricing = (products: Product[]) => {
  return useQuery({
    queryKey: ['product-pricing', products.map(p => p.id)],
    queryFn: async () => {
      if (products.length === 0) return {};
      
      const { data, error } = await supabase
        .from('product_pricing')
        .select(`
          *,
          pricing_strategies (*)
        `)
        .in('product_id', products.map(p => p.id));
      
      if (error) throw error;
      
      // Convert to map for easier lookup
      return (data || []).reduce((acc, pricing) => {
        acc[pricing.product_id] = pricing;
        return acc;
      }, {} as Record<string, any>);
    },
    enabled: products.length > 0,
  });
};