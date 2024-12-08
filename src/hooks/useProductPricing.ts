import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/components/admin/products/types';

export const useProductPricing = (products: Product[]) => {
  return useQuery({
    queryKey: ['product-pricing', products.map(p => p.id).join(',')],
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
      
      // Convert to map for easier lookup and add debug logging
      const pricingMap = (pricingData || []).reduce((acc, pricing) => {
        console.log(`Adding pricing for product ${pricing.product_id}:`, pricing);
        acc[pricing.product_id] = pricing;
        return acc;
      }, {} as Record<string, any>);

      console.log('Final pricing map:', pricingMap);
      return pricingMap;
    },
    enabled: products.length > 0,
  });
};