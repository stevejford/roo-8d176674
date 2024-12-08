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
        console.log('Constructing Supabase query for product IDs:', productIds);
        
        // First, let's verify the product IDs exist in the products table
        const { data: productsCheck, error: productsError } = await supabase
          .from('products')
          .select('id')
          .in('id', productIds);

        console.log('Products check result:', productsCheck);
        console.log('Products check error:', productsError);

        if (productsError) {
          console.error('Error checking products:', productsError);
          throw productsError;
        }

        // Now query the product_pricing table
        const { data, error, status, statusText } = await supabase
          .from('product_pricing')
          .select(`
            *,
            pricing_strategies (*)
          `)
          .in('product_id', productIds);

        console.log('Product pricing query complete');
        console.log('Response status:', status, statusText);
        console.log('Response error:', error);
        console.log('Response data:', data);

        if (error) {
          console.error('Error fetching product pricing:', {
            error,
            status,
            statusText,
            productIds,
            query: 'product_pricing.select().in()',
            errorMessage: error.message,
            errorDetails: error.details,
            errorHint: error.hint
          });
          throw error;
        }

        const pricingMap = (data || []).reduce((acc: { [key: string]: ProductPricingRow }, pricing) => {
          console.log('Processing pricing for product:', pricing.product_id);
          acc[pricing.product_id] = pricing;
          return acc;
        }, {});

        console.log('Final pricing map:', pricingMap);
        return pricingMap;
      } catch (error) {
        console.error('Unexpected error in useProductPricing:', error);
        throw error;
      }
    },
    enabled: productIds.length > 0,
    retry: false // Disable retries to avoid flooding logs
  });
};