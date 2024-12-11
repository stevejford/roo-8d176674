import React, { createContext, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/stores/useCartStore';
import { useVoucherValidation } from '@/hooks/useVoucherValidation';
import { useOrderValidation } from '@/hooks/useOrderValidation';
import { supabase } from "@/integrations/supabase/client";
import type { Voucher } from '@/hooks/useVoucherValidation';

interface OrderContextType {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  showTimeModal: boolean;
  setShowTimeModal: (show: boolean) => void;
  showSuccessDialog: boolean;
  setShowSuccessDialog: (show: boolean) => void;
  successOrderDetails: any;
  setSuccessOrderDetails: (details: any) => void;
  handleCheckout: () => Promise<void>;
  calculateTotal: () => number;
  isProcessing: boolean;
  validVoucher: Voucher | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrderState = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderState must be used within an OrderStateProvider');
  }
  return context;
};

export const OrderStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTime, setSelectedTime] = useState("Select pickup time");
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState(null);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { items, clearCart } = useCartStore();
  const { validVoucher } = useVoucherValidation();
  const { isProcessing, setIsProcessing, validateOrder } = useOrderValidation();

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (validVoucher) {
      if (validVoucher.discount_type === 'percentage') {
        const discountAmount = (subtotal * validVoucher.discount_value) / 100;
        return Math.max(0, subtotal - discountAmount);
      } else if (validVoucher.discount_type === 'fixed') {
        return Math.max(0, subtotal - validVoucher.discount_value);
      }
    }
    
    return subtotal;
  };

  const handleCheckout = async () => {
    if (selectedTime === "Select pickup time") {
      toast({
        title: "Pickup Time Required",
        description: "Please select a pickup time before proceeding to checkout.",
        variant: "destructive"
      });
      setShowTimeModal(true);
      return;
    }

    if (!validateOrder(selectedTime)) {
      return;
    }

    try {
      setIsProcessing(true);

      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: items.map(item => ({
            title: item.title,
            description: `${item.size ? `Size: ${item.size}` : ''} Quantity: ${item.quantity}`,
            image_url: item.image_url,
            price: item.price,
            quantity: item.quantity,
          })),
          voucher: validVoucher,
          pickup_time: selectedTime
        }
      });

      if (checkoutError) throw checkoutError;

      if (checkoutData?.url) {
        window.open(checkoutData.url, '_blank');
        clearCart();
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const value = {
    selectedTime,
    setSelectedTime,
    showTimeModal,
    setShowTimeModal,
    showSuccessDialog,
    setShowSuccessDialog,
    successOrderDetails,
    setSuccessOrderDetails,
    handleCheckout,
    calculateTotal,
    isProcessing,
    validVoucher,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};