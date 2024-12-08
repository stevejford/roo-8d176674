import { useState } from 'react';
import type { Database } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];

export const useSearch = (products: Product[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = searchQuery
    ? products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      )
    : products;

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts,
  };
};