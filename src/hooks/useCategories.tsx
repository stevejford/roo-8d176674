import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import type { Category } from '@/components/admin/products/types';
import React from 'react';

export const useCategories = () => {
  const queryClient = useQueryClient();
  const [categories, setCategories] = React.useState<Category[]>([]);

  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setCategories(data);
    },
  });

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete category");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['categories'] });
    toast.success("Category deleted successfully");
  };

  return {
    categories,
    deleteCategory,
    setCategories
  };
};