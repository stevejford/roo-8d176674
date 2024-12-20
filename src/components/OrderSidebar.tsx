import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductDetails } from "./ProductDetails";
import { SizeBasedOrderSidebar } from "./order/sidebars/SizeBasedOrderSidebar";
import type { CategoryPricing, ProductPricing, PricingConfig } from "@/types/pricing/interfaces";

interface OrderSidebarProps {
  selectedProduct: {
    title: string;
    description: string;
    image: string;
    price: number;
    category_id?: string;
  } | null;
  onClose: () => void;
  onAfterClose?: () => void;
}

export const OrderSidebar = ({ selectedProduct, onClose, onAfterClose }: OrderSidebarProps) => {
  const isMobile = useIsMobile();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      setTimeout(() => {
        onAfterClose?.();
      }, 100);
    }, 300);
  };

  useEffect(() => {
    if (selectedProduct) {
      setIsClosing(false);
    }
  }, [selectedProduct]);

  // Fetch category pricing if product has a category
  const { data: categoryPricing } = useQuery({
    queryKey: ['category-pricing', selectedProduct?.category_id],
    queryFn: async () => {
      if (!selectedProduct?.category_id) return null;
      
      try {
        const { data, error } = await supabase
          .from('category_pricing')
          .select(`
            *,
            pricing_strategies (*)
          `)
          .eq('category_id', selectedProduct.category_id)
          .maybeSingle();
        
        if (error) throw error;
        return data as CategoryPricing | null;
      } catch (error) {
        console.error('Error fetching category pricing:', error);
        return null;
      }
    },
    enabled: !!selectedProduct?.category_id
  });

  // Fetch product pricing override if it exists
  const { data: productPricing } = useQuery({
    queryKey: ['product-pricing', selectedProduct?.title],
    queryFn: async () => {
      if (!selectedProduct?.title) return null;
      
      try {
        const { data: products, error: productError } = await supabase
          .from('products')
          .select('id')
          .eq('title', selectedProduct.title)
          .maybeSingle();

        if (productError) throw productError;
        if (!products) return null;

        const { data: pricing, error: pricingError } = await supabase
          .from('product_pricing')
          .select(`
            *,
            pricing_strategies (*)
          `)
          .eq('product_id', products.id)
          .maybeSingle();

        if (pricingError && pricingError.code !== 'PGRST116') throw pricingError;
        return pricing as ProductPricing | null;
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