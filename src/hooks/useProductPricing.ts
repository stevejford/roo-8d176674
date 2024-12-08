import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ProductPricingRow = Database['public']['Tables']['product_pricing']['Row'] & {
  pricing_strategies: Database['public']['Tables']['pricing_strategies']['Row']
};

export const useProductPricing = (products: any[] | null) => {
  const productIds = products?.map(p => p.id) || [];

  return useQuery({
    queryKey: ['product-pricing', productIds],
    queryFn: async () => {
      if (!productIds.length) return {};

      const { data, error } = await supabase
        .from('product_pricing')
        .select(`
          *,
          pricing_strategies (*)
        `)
        .in('product_id', productIds);

      if (error) {
        console.error('Error fetching product pricing:', error);
        throw error;
      }

      // Transform the data into a map of product_id -> pricing data
      return (data || []).reduce((acc: { [key: string]: ProductPricingRow }, pricing) => {
        acc[pricing.product_id] = pricing;
        return acc;
      }, {});
    },
    enabled: productIds.length > 0
  });
};