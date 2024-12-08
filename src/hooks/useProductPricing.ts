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
        console.log('Making Supabase request with query:', `
          SELECT *,
          pricing_strategies.*
          FROM product_pricing
          WHERE product_id IN (${productIds.join(', ')})
        `);

        const { data, error, status, statusText } = await supabase
          .from('product_pricing')
          .select(`
            *,
            pricing_strategies (*)
          `)
          .in('product_id', productIds);

        console.log('Supabase response status:', status, statusText);
        console.log('Supabase response data:', data);

        if (error) {
          console.error('Error fetching product pricing:', {
            error,
            status,
            statusText,
            query: 'product_pricing?select=*,pricing_strategies(*)',
            productIds
          });
          throw error;
        }

        // Transform the data into a map of product_id -> pricing data
        const pricingMap = (data || []).reduce((acc: { [key: string]: ProductPricingRow }, pricing) => {
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