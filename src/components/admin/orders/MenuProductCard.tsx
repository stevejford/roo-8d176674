import React from 'react';
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCategoryPricing } from '@/hooks/useCategoryPricing';
import { useProductPricing } from '@/hooks/useProductPricing';
import type { Database } from '@/integrations/supabase/types';
import type { PricingConfig } from '@/types/pricing';

type Product = Database['public']['Tables']['products']['Row'];

interface MenuProductCardProps {
  product: Product;
  categoryId: string;
  onSelect: (product: Product) => void;
}

export const MenuProductCard = ({ product, categoryId, onSelect }: MenuProductCardProps) => {
  const { data: categoryPricing } = useCategoryPricing(categoryId);
  const { data: productPricingMap } = useProductPricing([product]);
  
  const productPricing = productPricingMap?.[product.id];
  const price = product.price_override ? product.price : (
    productPricing?.is_override ? 
      (productPricing.config as PricingConfig)?.price || product.price : 
      (categoryPricing?.config as PricingConfig)?.price || product.price
  );

  return (
    <Card 
      className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
      onClick={() => onSelect(product)}
    >
      <div className="flex items-center space-x-4">
        {product.image_url && (
          <img 
            src={product.image_url} 
            alt={product.title}
            className="w-12 h-12 rounded-md object-cover"
          />
        )}
        <div>
          <h3 className="font-medium">{product.title}</h3>
          <p className="text-sm text-gray-500">${price?.toFixed(2)}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </Card>
  );
};