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
      if (!productIds.length) {
        return {};
      }

      try {
        console.log('Fetching product pricing for products:', productIds);
        const { data, error } = await supabase
          .from('product_pricing')
          .select('*, pricing_strategies (*)')
          .in('product_id', productIds);

        if (error) {
          console.error('Product pricing error:', error);
          return {}; // Return empty object on error
        }

        // If no data found, return empty object
        if (!data || data.length === 0) {
          console.log('No product pricing found for products:', productIds);
          return {};
        }

        // Transform the data into a map
        const pricingMap = data.reduce((acc: { [key: string]: ProductPricingRow }, pricing) => {
          acc[pricing.product_id] = pricing;
          return acc;
        }, {});

        console.log('Found pricing data:', pricingMap);
        return pricingMap;
      } catch (error) {
        console.error('Unexpected error in product pricing:', error);
        return {}; // Return empty object on error
      }
    },
    enabled: productIds.length > 0,
    staleTime: 30000, // Cache for 30 seconds
  });
};