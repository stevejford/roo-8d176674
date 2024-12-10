import React, { useState } from 'react';
import { Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Database } from '@/integrations/supabase/types';
import type { PricingConfig } from '@/types/pricing';

type Tables = Database['public']['Tables'];
type PricingStrategy = Tables['pricing_strategies']['Row'];
type ProductPricingRow = Tables['product_pricing']['Row'];
type ProductRow = Tables['products']['Row'];

interface ProductPricing extends Omit<ProductPricingRow, 'pricing_strategies'> {
  pricing_strategies: PricingStrategy;
}

interface Product extends Omit<ProductRow, 'product_pricing'> {
  product_pricing?: ProductPricing[];
}

interface MenuProductCardProps {
  product: Product;
  categoryId: string;
  productPricing?: ProductPricing;
  categoryPricing?: {
    config: any;
    pricing_strategies: PricingStrategy;
  };
  onSelect: (product: Product) => void;
}

export const MenuProductCard = ({ 
  product, 
  categoryId, 
  productPricing,
  categoryPricing,
  onSelect 
}: MenuProductCardProps) => {
  const [quantity, setQuantity] = useState(0);
  
  const calculatePrice = () => {
    if (productPricing?.is_override) {
      const config = productPricing.config as PricingConfig;
      const calculatedPrice = config.price || product.price || 0;
      return calculatedPrice;
    }

    if (categoryPricing?.pricing_strategies) {
      const config = categoryPricing.config as PricingConfig;
      const calculatedPrice = config.price || product.price || 0;
      return calculatedPrice;
    }

    const defaultPrice = product.price || 0;
    return defaultPrice;
  };

  const price = calculatePrice();

  const handleQuantityChange = (increment: boolean) => {
    const newQuantity = increment ? quantity + 1 : Math.max(0, quantity - 1);
    setQuantity(newQuantity);
    
    if (increment && newQuantity === 1) {
      const productWithPrice = {
        ...product,
        price
      };
      onSelect(productWithPrice);
    }
  };

  return (
    <Card className="p-2 flex flex-col gap-2">
      <div className="flex items-start gap-2">
        {product.image_url && (
          <img 
            src={product.image_url} 
            alt={product.title}
            className="w-16 h-16 rounded-md object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{product.title}</h3>
          <p className="text-sm text-gray-500">${price?.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-auto">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleQuantityChange(false)}
          disabled={quantity === 0}
          className="h-8 w-8"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="w-8 text-center font-medium text-sm">{quantity}</span>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleQuantityChange(true)}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};