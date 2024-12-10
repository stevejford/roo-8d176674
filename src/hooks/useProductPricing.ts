import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type PricingStrategy = Database['public']['Tables']['pricing_strategies']['Row'];
type ProductPricing = Database['public']['Tables']['product_pricing']['Row'];

type ProductPricingRow = ProductPricing & {
  pricing_strategies: PricingStrategy;
};

export const useProductPricing = (products: any[] | null) => {
  const productIds = products?.map(p => p.id) || [];

  return useQuery({
    queryKey: ['product-pricing', productIds],
    queryFn: async () => {
      if (!productIds.length) {
        console.log('No product IDs provided');
        return {};
      }

      try {
        console.log('Attempting to fetch pricing for products:', productIds);
        
        // First check if the products exist
        const { data: productsExist, error: productsError } = await supabase
          .from('products')
          .select('id')
          .in('id', productIds);

        if (productsError) {
          console.error('Error checking products:', productsError);
          return {};
        }

        if (!productsExist?.length) {
          console.log('No products found with the provided IDs');
          return {};
        }

        // Then fetch pricing data with all required fields
        const { data: pricingData, error: pricingError } = await supabase
          .from('product_pricing')
          .select(`
            *,
            pricing_strategies (*)
          `)
          .in('product_id', productIds);

        if (pricingError && pricingError.code !== 'PGRST116') {
          console.error('Error fetching product pricing:', pricingError);
          return {};
        }

        // Transform the data into a map, even if empty
        const pricingMap = (pricingData || []).reduce((acc: { [key: string]: ProductPricingRow }, pricing) => {
          if (pricing.product_id) {
            acc[pricing.product_id] = pricing as ProductPricingRow;
          }
          return acc;
        }, {});

        console.log('Pricing data map created:', pricingMap);
        return pricingMap;
      } catch (error) {
        console.error('Unexpected error in useProductPricing:', error);
        return {};
      }
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: false, // Don't retry on failure
  });
};