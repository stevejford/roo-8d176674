import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductDetails } from "./ProductDetails";
import { SizeBasedOrderSidebar } from "./order/sidebars/SizeBasedOrderSidebar";
import type { CategoryPricing, ProductPricing } from "@/types/pricing/interfaces";

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

  // Fetch category pricing if product has a category
  const { data: categoryPricing } = useQuery<CategoryPricing | null>({
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
        .limit(1);
      
      if (error) throw error;
      return data?.[0] as CategoryPricing || null;
    },
    enabled: !!selectedProduct?.category_id
  });

  // Fetch product pricing override if it exists
  const { data: productPricing } = useQuery<ProductPricing | null>({
    queryKey: ['product-pricing', selectedProduct?.title],
    queryFn: async () => {
      if (!selectedProduct?.title) return null;
      
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
        .limit(1);

      if (pricingError) throw pricingError;
      return pricing?.[0] as ProductPricing || null;
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
    ? productPricing.config
    : categoryPricing?.config;

  const baseClassName = `fixed ${
    isMobile ? 'inset-0' : 'top-0 right-0 w-[400px]'
  } bg-white border-l border-gray-200 h-screen z-[60] animate-slide-in-right`; // Added animation class

  // Show size-based sidebar for products with size-based pricing
  if (pricingStrategy?.type === 'size_based' && pricingConfig?.sizes) {
    return (
      <div className={baseClassName}>
        <SizeBasedOrderSidebar
          product={selectedProduct}
          pricing={pricingConfig}
          onClose={onClose}
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
        onClose={onClose}
      />
    </div>
  );
};