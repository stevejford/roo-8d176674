import React, { useState } from 'react';
import { Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Database } from '@/integrations/supabase/types';
import type { PricingConfig } from '@/types/pricing';

type PricingStrategy = Database['public']['Tables']['pricing_strategies']['Row'];
type ProductPricingRow = Database['public']['Tables']['product_pricing']['Row'];

interface ProductPricing extends ProductPricingRow {
  pricing_strategies: PricingStrategy;
}

interface Product extends Database['public']['Tables']['products']['Row'] {
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
    <Card className="p-4 flex justify-between items-center hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        {product.image_url && (
          <img 
            src={product.image_url} 
            alt={product.title}
            className="w-16 h-16 rounded-md object-cover"
          />
        )}
        <div>
          <h3 className="font-medium">{product.title}</h3>
          <p className="text-sm text-gray-500">${price?.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
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