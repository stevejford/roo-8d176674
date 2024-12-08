import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProductPriceProps {
  productId: string;
  categoryId: string | null;
}

export const ProductPrice = ({ productId, categoryId }: ProductPriceProps) => {
  // Fetch product pricing (override)
  const { data: productPricing } = useQuery({
    queryKey: ['product-pricing', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_pricing')
        .select(`
          *,
          pricing_strategies (
            name,
            type,
            config
          )
        `)
        .eq('product_id', productId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  // Fetch category pricing (fallback)
  const { data: categoryPricing } = useQuery({
    queryKey: ['category-pricing', categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      
      const { data, error } = await supabase
        .from('category_pricing')
        .select(`
          *,
          pricing_strategies (
            name,
            type,
            config
          )
        `)
        .eq('category_id', categoryId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!categoryId,
  });

  const renderPrice = () => {
    const pricing = productPricing || categoryPricing;
    
    if (!pricing) {
      return <span className="text-lg font-semibold">Price not set</span>;
    }

    const { type, config } = pricing.pricing_strategies;

    switch (type) {
      case 'simple':
        return (
          <span className="text-lg font-semibold">
            ${config.price?.toFixed(2) || '0.00'}
          </span>
        );
      case 'size_based':
        return (
          <div className="space-y-1">
            {config.sizes?.map((size: any, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{size.name}</span>
                <span className="font-semibold">${size.price?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        );
      case 'portion_based':
        return (
          <div className="space-y-1">
            {config.portions?.map((portion: any, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{portion.name}</span>
                <span className="font-semibold">${portion.price?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        );
      default:
        return <span className="text-lg font-semibold">Price not available</span>;
    }
  };

  return (
    <div className="mt-2">
      {renderPrice()}
    </div>
  );
};