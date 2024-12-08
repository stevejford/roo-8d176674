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
        // First try to get a single product pricing to test the connection
        if (productIds.length === 1) {
          console.log('Fetching single product pricing for:', productIds[0]);
          const { data: singleData, error: singleError } = await supabase
            .from('product_pricing')
            .select('*, pricing_strategies (*)')
            .eq('product_id', productIds[0])
            .single();

          if (singleError) {
            console.error('Single product pricing error:', singleError);
            throw singleError;
          }

          return singleData ? { [productIds[0]]: singleData } : {};
        }

        // If we have multiple products, fetch them all
        console.log('Fetching multiple product pricing for:', productIds);
        const { data, error } = await supabase
          .from('product_pricing')
          .select('*, pricing_strategies (*)')
          .filter('product_id', 'in', `(${productIds.join(',')})`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Multiple product pricing error:', error);
          throw error;
        }

        // Transform the data into a map
        return (data || []).reduce((acc: { [key: string]: ProductPricingRow }, pricing) => {
          acc[pricing.product_id] = pricing;
          return acc;
        }, {});
      } catch (error) {
        console.error('Product pricing error:', error);
        // Return empty object instead of throwing to prevent UI from breaking
        return {};
      }
    },
    enabled: productIds.length > 0,
    retry: 1, // Only retry once to avoid too many requests
    staleTime: 30000, // Cache for 30 seconds
  });
};