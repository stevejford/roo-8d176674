import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/components/admin/products/types';

export const useProductPricing = (products: Product[]) => {
  return useQuery({
    queryKey: ['product-pricing', products.map(p => p.id).sort().join(',')],
    queryFn: async () => {
      if (products.length === 0) return {};
      
      const { data: pricingData, error } = await supabase
        .from('product_pricing')
        .select(`
          *,
          pricing_strategies (
            id,
            name,
            type,
            config
          )
        `)
        .in('product_id', products.map(p => p.id));
      
      if (error) {
        console.error('Error fetching product pricing:', error);
        throw error;
      }

      // Convert to map for easier lookup
      const pricingMap = (pricingData || []).reduce((acc, pricing) => {
        acc[pricing.product_id] = {
          ...pricing,
          pricing_strategies: pricing.pricing_strategies || null
        };
        return acc;
      }, {} as Record<string, any>);

      return pricingMap;
    },
    enabled: products.length > 0,
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    cacheTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });
};