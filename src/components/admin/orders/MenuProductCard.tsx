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
    console.log('Calculating price for:', product.title);
    console.log('Product base price:', product.price);
    console.log('Product pricing override:', productPricing);
    console.log('Category pricing:', categoryPricing);
    
    // First check for product-specific pricing override
    if (productPricing?.is_override) {
      const config = productPricing.config as PricingConfig;
      const calculatedPrice = config.price || product.price || 0;
      console.log('Using product override price:', calculatedPrice);
      return calculatedPrice;
    }

    // Then check for category pricing
    if (categoryPricing?.pricing_strategies) {
      const config = categoryPricing.config as PricingConfig;
      const calculatedPrice = config.price || product.price || 0;
      console.log('Using category price:', calculatedPrice);
      return calculatedPrice;
    }

    // Fallback to product's default price
    const defaultPrice = product.price || 0;
    console.log('Using default product price:', defaultPrice);
    return defaultPrice;
  };

  const price = calculatePrice();
  console.log('Final calculated price:', price);

  const handleQuantityChange = (increment: boolean) => {
    const newQuantity = increment ? quantity + 1 : Math.max(0, quantity - 1);
    setQuantity(newQuantity);
    
    if (increment && newQuantity === 1) {
      const productWithPrice = {
        ...product,
        price
      };
      console.log('Selecting product with calculated price:', productWithPrice);
      onSelect(productWithPrice);
    }
  };

  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        {product.image_url && (
          <img 
            src={product.image_url} 
            alt={product.title}
            className="w-20 h-20 rounded-md object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-lg truncate">{product.title}</h3>
          <p className="text-sm text-gray-500 mt-1">${price?.toFixed(2)}</p>
          {product.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-3 mt-auto">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleQuantityChange(false)}
          disabled={quantity === 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="w-8 text-center font-medium">{quantity}</span>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleQuantityChange(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};