import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductDetails } from "./ProductDetails";
import { SizeBasedOrderSidebar } from "./order/sidebars/SizeBasedOrderSidebar";
import type { CategoryPricing, ProductPricing, PricingConfig } from "@/types/pricing/interfaces";
import type { Database } from "@/integrations/supabase/types";

type CategoryPricingRow = Database['public']['Tables']['category_pricing']['Row'] & {
  pricing_strategies: Database['public']['Tables']['pricing_strategies']['Row']
};

type ProductPricingRow = Database['public']['Tables']['product_pricing']['Row'] & {
  pricing_strategies: Database['public']['Tables']['pricing_strategies']['Row']
};

interface OrderSidebarProps {
  selectedProduct: {
    title: string;
    description: string;
    image: string;
    price: number;
    category_id?: string;
  } | null;
  onClose: () => void;
}

export const OrderSidebar = ({ selectedProduct, onClose }: OrderSidebarProps) => {
  const isMobile = useIsMobile();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (selectedProduct) {
      setIsClosing(false);
    }
  }, [selectedProduct]);

  // Fetch category pricing if product has a category
  const { data: categoryPricing } = useQuery<CategoryPricingRow | null>({
    queryKey: ['category-pricing', selectedProduct?.category_id],
    queryFn: async () => {
      if (!selectedProduct?.category_id) return null;
      
      const { data, error } = await supabase
        .from('category_pricing')
        .select(`
          *,
          pricing_strategies (*)
        `)
        .eq('category_id', selectedProduct.category_id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!selectedProduct?.category_id
  });

  // Fetch product pricing override if it exists
  const { data: productPricing } = useQuery<ProductPricingRow | null>({
    queryKey: ['product-pricing', selectedProduct?.title],
    queryFn: async () => {
      if (!selectedProduct?.title) return null;
      
      try {
        const { data: products, error: productError } = await supabase
          .from('products')
          .select('id')
          .eq('title', selectedProduct.title)
          .limit(1);

        if (productError) throw productError;
        if (!products?.length) return null;

        const { data: pricing, error: pricingError } = await supabase
          .from('product_pricing')
          .select(`
            *,
            pricing_strategies (*)
          `)
          .eq('product_id', products[0].id)
          .maybeSingle();

        if (pricingError && pricingError.code !== 'PGRST116') throw pricingError;
        return pricing;
      } catch (error) {
        console.error('Error fetching product pricing:', error);
        return null;
      }
    },
    enabled: !!selectedProduct?.title
  });

  if (!selectedProduct) {
    return null;
  }

  const pricingStrategy = productPricing?.is_override 
    ? productPricing.pricing_strategies
    : categoryPricing?.pricing_strategies;

  const pricingConfig = productPricing?.is_override
    ? productPricing.config as PricingConfig
    : categoryPricing?.config as PricingConfig;

  const baseClassName = `fixed ${
    isMobile ? 'inset-0' : 'top-0 right-0 w-[400px]'
  } bg-white border-l border-gray-200 h-screen z-[60] ${
    isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
  }`;

  // Show size-based sidebar for products with size-based pricing
  if (pricingStrategy?.type === 'size_based' && pricingConfig?.sizes) {
    return (
      <div className={baseClassName}>
        <SizeBasedOrderSidebar
          product={selectedProduct}
          pricing={pricingConfig}
          onClose={handleClose}
        />
      </div>
    );
  }

  // Show regular product details for other products
  return (
    <div className={baseClassName}>
      <ProductDetails
        title={selectedProduct.title}
        description={selectedProduct.description}
        image={selectedProduct.image}
        price={selectedProduct.price}
        category_id={selectedProduct.category_id}
        onClose={handleClose}
      />
    </div>
  );
};