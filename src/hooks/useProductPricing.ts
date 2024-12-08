import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ProductPricingRow = Database['public']['Tables']['product_pricing']['Row'] & {
  pricing_strategies: Database['public']['Tables']['pricing_strategies']['Row']
};

export const useProductPricing = (products: any[] | null) => {
  const productIds = products?.map(p => p.id) || [];

  console.log('useProductPricing hook called with products:', products);
  console.log('Extracted product IDs:', productIds);

  return useQuery({
    queryKey: ['product-pricing', productIds],
    queryFn: async () => {
      console.log('Starting product pricing query for IDs:', productIds);
      
      if (!productIds.length) {
        console.log('No product IDs provided, returning empty object');
        return {};
      }

      try {
        // Instead of using .in(), let's fetch all product pricing and filter in JS
        // This avoids potential issues with the IN clause and response format
        const { data, error, status, statusText } = await supabase
          .from('product_pricing')
          .select(`
            *,
            pricing_strategies (*)
          `);

        console.log('Supabase response status:', status, statusText);
        console.log('Raw response data:', data);

        if (error) {
          console.error('Error fetching product pricing:', {
            error,
            status,
            statusText,
            query: 'product_pricing?select=*,pricing_strategies(*)'
          });
          throw error;
        }

        // Filter the data for our product IDs and transform into a map
        const pricingMap = (data || [])
          .filter(pricing => productIds.includes(pricing.product_id))
          .reduce((acc: { [key: string]: ProductPricingRow }, pricing) => {
            console.log('Processing pricing data for product:', pricing.product_id);
            acc[pricing.product_id] = pricing;
            return acc;
          }, {});

        console.log('Final transformed pricing map:', pricingMap);
        return pricingMap;
      } catch (error) {
        console.error('Unexpected error in useProductPricing:', error);
        throw error;
      }
    },
    enabled: productIds.length > 0
  });
};