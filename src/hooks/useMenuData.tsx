import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export const useMenuData = () => {
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data;
    },
    enabled: true
  });

  const { data: products = [], isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('position');
      
      if (error) throw error;
      return data;
    },
    enabled: true
  });

  useEffect(() => {
    if (categoriesError) {
      console.error("Categories error:", categoriesError);
      toast.error("Failed to load menu categories");
    }
    if (productsError) {
      console.error("Products error:", productsError);
      toast.error("Failed to load menu items");
    }
  }, [categoriesError, productsError]);

  const refetch = async () => {
    await Promise.all([refetchCategories(), refetchProducts()]);
  };

  return {
    categories,
    products,
    isLoading: categoriesLoading || productsLoading,
    hasError: !!categoriesError || !!productsError,
    refetch
  };
};