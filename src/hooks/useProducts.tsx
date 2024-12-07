import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import type { Product } from '@/components/admin/products/types';

export const useProducts = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data;
    },
  });

  const updateProductOrder = useMutation({
    mutationFn: async ({ sourceIndex, destinationIndex, productId, categoryId }: any) => {
      const { error } = await supabase
        .from('products')
        .update({ 
          position: destinationIndex,
          category_id: categoryId
        })
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Product order updated successfully");
    },
  });

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete product");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['products'] });
    toast.success("Product deleted successfully");
  };

  return {
    products,
    isLoading,
    updateProductOrder,
    deleteProduct
  };
};