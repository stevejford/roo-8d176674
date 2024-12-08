import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCategoryPricing = (categoryId: string | null) => {
  return useQuery({
    queryKey: ['category-pricing', categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      
      const { data, error } = await supabase
        .from('category_pricing')
        .select(`
          *,
          pricing_strategies (*)
        `)
        .eq('category_id', categoryId);
      
      // If no pricing found, return null instead of throwing error
      if (error && error.code !== 'PGRST116') throw error;
      
      // Return the first pricing config if any exists
      return data?.[0] || null;
    },
    enabled: !!categoryId,
  });
};