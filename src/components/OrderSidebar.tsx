import React, { useState } from "react";
import { Clock, Plus, X } from "lucide-react";
import { ProductDetails } from "./ProductDetails";
import { OrderLocation } from "./OrderLocation";
import { PickupTimeModal } from "./PickupTimeModal";
import { ComplementaryItems } from "./ComplementaryItems";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PricingConfig } from "@/types/pricing";

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

  // Fetch category pricing if product has a category
  const { data: categoryPricing } = useQuery({
    queryKey: ['category-pricing', selectedProduct?.category_id],
    queryFn: async () => {
      if (!selectedProduct?.category_id) return null;
      
      console.log("Fetching category pricing for category:", selectedProduct.category_id);
      
      const { data, error } = await supabase
        .from('category_pricing')
        .select(`
          *,
          pricing_strategies (
            id,
            name,
            type,
            config
          )
        `)
        .eq('category_id', selectedProduct.category_id)
        .single();
      
      if (error) {
        console.error("Error fetching category pricing:", error);
        throw error;
      }
      
      console.log("Category pricing data:", data);
      return data;
    },
    enabled: !!selectedProduct?.category_id
  });

  // Fetch product pricing override if it exists
  const { data: productPricing } = useQuery({
    queryKey: ['product-pricing', selectedProduct?.title],
    queryFn: async () => {
      if (!selectedProduct?.title) return null;
      
      console.log("Fetching product pricing for:", selectedProduct.title);
      
      // First get the product ID
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('id')
        .eq('title', selectedProduct.title)
        .limit(1);

      if (productError) {
        console.error("Error fetching product:", productError);
        throw productError;
      }
      
      if (!products?.length) return null;

      // Then get the pricing data
      const { data: pricing, error: pricingError } = await supabase
        .from('product_pricing')
        .select(`
          *,
          pricing_strategies (
            id,
            name,
            type,
            config
          )
        `)
        .eq('product_id', products[0].id)
        .limit(1);

      if (pricingError) {
        console.error("Error fetching product pricing:", pricingError);
        throw pricingError;
      }
      
      console.log("Product pricing data:", pricing?.[0]);
      return pricing?.[0] || null;
    },
    enabled: !!selectedProduct?.title
  });

  const calculatePrice = () => {
    if (!selectedProduct) return 0;
    
    console.log("Calculating price for:", selectedProduct.title);
    console.log("Product base price:", selectedProduct.price);
    console.log("Product pricing override:", productPricing);
    console.log("Category pricing:", categoryPricing);

    // Check for product-specific pricing override
    if (productPricing?.is_override) {
      const strategy = productPricing.pricing_strategies;
      const config = productPricing.config as PricingConfig;
      
      console.log("Using product pricing override with strategy:", strategy?.type);

      switch (strategy?.type) {
        case 'simple':
          return config.price || selectedProduct.price;
        case 'size_based':
          return config.sizes?.[0]?.price || selectedProduct.price;
        case 'portion_based':
          return config.portions?.[0]?.price || selectedProduct.price;
        case 'selection_based':
          return config.options?.[0]?.price || selectedProduct.price;
        case 'volume_based':
          return config.volumes?.[0]?.price || selectedProduct.price;
        default:
          return selectedProduct.price;
      }
    }

    // Use category pricing if available
    if (categoryPricing?.pricing_strategies) {
      const strategy = categoryPricing.pricing_strategies;
      const config = categoryPricing.config as PricingConfig;
      
      console.log("Using category pricing with strategy:", strategy.type);

      switch (strategy.type) {
        case 'simple':
          return config.price || selectedProduct.price;
        case 'size_based':
          return config.sizes?.[0]?.price || selectedProduct.price;
        case 'portion_based':
          return config.portions?.[0]?.price || selectedProduct.price;
        case 'selection_based':
          return config.options?.[0]?.price || selectedProduct.price;
        case 'volume_based':
          return config.volumes?.[0]?.price || selectedProduct.price;
        default:
          return selectedProduct.price;
      }
    }

    // Fallback to product's default price
    console.log("Using product default price:", selectedProduct.price);
    return selectedProduct.price;
  };

  const handleTimeSchedule = (date: string, time: string) => {
    setSelectedTime(`${date} - ${time}`);
    setShowTimeModal(false);
  };

  if (selectedProduct) {
    const calculatedPrice = calculatePrice();
    console.log("Final calculated price:", calculatedPrice);
    
    return (
      <div className={`fixed ${isMobile ? 'inset-0' : 'top-0 right-0 w-[400px]'} bg-white border-l border-gray-200 h-screen overflow-hidden`}>
        <ProductDetails
          title={selectedProduct.title}
          description={selectedProduct.description}
          image={selectedProduct.image}
          price={calculatedPrice}
          onClose={onClose}
        />
      </div>
    );
  }

  return (
    <div className={`fixed ${isMobile ? 'inset-0' : 'top-0 right-0 w-[400px]'} bg-white border-l border-gray-200 h-screen flex flex-col`}>
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-[#2D3648]">Order</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#2D3648] text-lg">Pickup/Delivery</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setMode('pickup')}
                  className={`px-4 py-2 rounded-full ${mode === 'pickup' ? 'bg-[#10B981] text-white' : 'bg-gray-100'}`}
                >
                  Pickup
                </button>
                <button 
                  onClick={() => setMode('delivery')}
                  className={`px-4 py-2 rounded-full ${mode === 'delivery' ? 'bg-[#10B981] text-white' : 'bg-gray-100'}`}
                >
                  Delivery
                </button>
              </div>
            </div>
            <OrderLocation mode={mode} />
          </div>

          <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
            <Clock className="h-5 w-5 text-gray-400 mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-[#2D3648]">{mode === 'pickup' ? 'Pickup Time' : 'Delivery Time'}</h3>
                <button 
                  onClick={() => setShowTimeModal(true)}
                  className="px-3 py-1 border border-[#10B981] text-[#10B981] text-sm font-medium rounded hover:bg-[#10B981]/5 transition-colors"
                >
                  CHANGE
                </button>
              </div>
              <p className="text-sm text-gray-600">{selectedTime}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#2D3648]">Items</h3>
              {!showVoucherInput && (
                <button 
                  onClick={() => setShowVoucherInput(true)}
                  className="text-[#E86452] text-sm font-medium flex items-center gap-1 hover:text-[#E86452]/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Voucher
                </button>
              )}
            </div>
            
            {showVoucherInput ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ENTER VOUCHER CODE"
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#E86452]"
                  />
                  <button
                    onClick={() => setShowVoucherInput(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E86452] hover:text-[#E86452]/90"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Your cart is empty</p>
                <p className="text-sm">Add items to get started</p>
              </div>
            )}
          </div>

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