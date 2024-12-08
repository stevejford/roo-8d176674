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
  const [mode, setMode] = useState<'pickup' | 'delivery'>('pickup');
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Today - 20 Minutes");
  const isMobile = useIsMobile();

  console.log("OrderSidebar - Selected Product:", selectedProduct); // Debug log

  // Fetch category pricing if product has a category
  const { data: categoryPricing } = useQuery({
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
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedProduct?.category_id
  });

  // Fetch product pricing override if it exists
  const { data: productPricing } = useQuery({
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

  const calculatePrice = () => {
    if (!selectedProduct) return 0;
    console.log("Calculating price for product:", selectedProduct.title);

    // Check for product-specific pricing override
    if (productPricing?.is_override) {
      const strategy = productPricing.pricing_strategies;
      const config = productPricing.config as PricingConfig;
      console.log("Using product pricing override:", config);

      switch (strategy?.type) {
        case 'simple':
          return config.price || selectedProduct.price || 0;
        case 'size_based':
          return config.sizes?.[0]?.price || selectedProduct.price || 0;
        case 'portion_based':
          return config.portions?.[0]?.price || selectedProduct.price || 0;
        case 'selection_based':
          return config.options?.[0]?.price || selectedProduct.price || 0;
        case 'volume_based':
          return config.volumes?.[0]?.price || selectedProduct.price || 0;
        default:
          return selectedProduct.price || 0;
      }
    }

    // Use category pricing if available
    if (categoryPricing?.pricing_strategies) {
      const strategy = categoryPricing.pricing_strategies;
      const config = categoryPricing.config as PricingConfig;
      console.log("Using category pricing:", config);

      switch (strategy.type) {
        case 'simple':
          return config.price || selectedProduct.price || 0;
        case 'size_based':
          return config.sizes?.[0]?.price || selectedProduct.price || 0;
        case 'portion_based':
          return config.portions?.[0]?.price || selectedProduct.price || 0;
        case 'selection_based':
          return config.options?.[0]?.price || selectedProduct.price || 0;
        case 'volume_based':
          return config.volumes?.[0]?.price || selectedProduct.price || 0;
        default:
          return selectedProduct.price || 0;
      }
    }

    // Fallback to product's default price
    console.log("Using default price:", selectedProduct.price);
    return selectedProduct.price || 0;
  };

  const handleTimeSchedule = (date: string, time: string) => {
    setSelectedTime(`${date} - ${time}`);
    setShowTimeModal(false);
  };

  if (selectedProduct) {
    console.log("Rendering ProductDetails with price:", calculatePrice()); // Debug log
    return (
      <div className={`fixed ${isMobile ? 'inset-0' : 'top-0 right-0 w-[400px]'} bg-white border-l border-gray-200 h-screen overflow-hidden`}>
        <ProductDetails
          title={selectedProduct.title}
          description={selectedProduct.description}
          image={selectedProduct.image}
          price={calculatePrice()}
          onClose={onClose}
        />
      </div>
    );
  }

  return (
    <div className={`fixed ${isMobile ? 'inset-0' : 'top-0 right-0 w-[400px]'} bg-white border-l border-gray-200 h-screen flex flex-col`}>
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <OrderHeader onClose={onClose} />
          <DeliveryModeSelector mode={mode} setMode={setMode} />
          <OrderLocation mode={mode} />
          <TimeSelector 
            mode={mode} 
            selectedTime={selectedTime} 
            onTimeChange={() => setShowTimeModal(true)} 
          />
          <VoucherSection 
            showVoucherInput={showVoucherInput}
            setShowVoucherInput={setShowVoucherInput}
          />
          <ComplementaryItems />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <button className="w-full py-3 px-4 bg-[#E86452] text-white rounded-md flex items-center justify-center space-x-2">
          <span>Store Closed</span>
          <span>→</span>
        </button>
      </div>

      <PickupTimeModal 
        isOpen={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        onSchedule={handleTimeSchedule}
      />
    </div>
  );
};