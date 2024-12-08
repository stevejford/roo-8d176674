import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PricingConfig } from "@/types/pricing";
import { ProductDetails } from "./ProductDetails";
import { OrderLocation } from "./OrderLocation";
import { PickupTimeModal } from "./PickupTimeModal";
import { ComplementaryItems } from "./ComplementaryItems";
import { OrderHeader } from "./order/OrderHeader";
import { DeliveryModeSelector } from "./order/DeliveryModeSelector";
import { TimeSelector } from "./order/TimeSelector";
import { VoucherSection } from "./order/VoucherSection";
import { SizeBasedOrderSidebar } from "./order/sidebars/SizeBasedOrderSidebar";

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

interface CategoryPricing {
  id: string;
  category_id: string;
  strategy_id: string;
  config: PricingConfig;
  pricing_strategies: {
    id: string;
    name: string;
    type: string;
    config: PricingConfig;
  };
}

export const OrderSidebar = ({ selectedProduct, onClose }: OrderSidebarProps) => {
  const [mode, setMode] = useState<'pickup' | 'delivery'>('pickup');
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Today - 20 Minutes");
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
      return data?.[0] || null;
    },
    enabled: !!selectedProduct?.category_id
  });

  // Fetch product pricing override if it exists
  const { data: productPricing } = useQuery<CategoryPricing | null>({
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
      return pricing?.[0] || null;
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

  // Render size-based sidebar if applicable
  if (pricingStrategy?.type === 'size_based' && pricingConfig?.sizes) {
    return (
      <SizeBasedOrderSidebar
        product={selectedProduct}
        pricing={pricingConfig as Required<PricingConfig>}
        onClose={onClose}
      />
    );
  }

  // Default to ProductDetails for other pricing types
  return (
    <div className={`fixed ${isMobile ? 'inset-0' : 'top-0 right-0 w-[400px]'} bg-white border-l border-gray-200 h-screen overflow-hidden`}>
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