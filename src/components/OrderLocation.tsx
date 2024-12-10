import React, { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ComplementaryItems } from "./ComplementaryItems";
import { getStoreSettings, isStoreOpen } from "@/utils/businessHours";
import { PickupTimeModal } from "./PickupTimeModal";
import { OrderHeader } from "./order/OrderHeader";
import { LocationInfo } from "./order/LocationInfo";
import { OrderItems } from "./order/OrderItems";
import { CheckoutButton } from "./order/CheckoutButton";
import { useCartStore } from "@/stores/useCartStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

interface OrderLocationProps {
  mode: 'pickup' | 'delivery';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const OrderLocation = ({ mode, isOpen = true, onOpenChange }: OrderLocationProps) => {
  const isMobile = useIsMobile();
  const [selectedTime, setSelectedTime] = useState("Wednesday - Reopen");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeName, setStoreName] = useState("");
  const [isStoreCurrentlyOpen, setIsStoreCurrentlyOpen] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckingStoreHours, setIsCheckingStoreHours] = useState(true);
  const { items, clearCart } = useCartStore();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for payment status in URL
    const paymentStatus = searchParams.get('payment_status');
    if (paymentStatus === 'success') {
      toast({
        title: "Payment Successful",
        description: "Thank you for your order!",
        variant: "default"
      });
      // Remove the payment_status from URL without refreshing the page
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled.",
        variant: "destructive"
      });
      // Remove the payment_status from URL without refreshing the page
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams, toast]);

  useEffect(() => {
    const loadStoreData = async () => {
      setIsCheckingStoreHours(true);
      try {
        const settings = await getStoreSettings();
        if (settings) {
          setStoreAddress(settings.address);
          setStoreName(settings.store_name);
        }

        const storeOpen = await isStoreOpen();
        setIsStoreCurrentlyOpen(storeOpen);
      } catch (error) {
        console.error('Error loading store data:', error);
        toast({
          title: "Error",
          description: "Failed to check store hours. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsCheckingStoreHours(false);
      }
    };

    loadStoreData();
    
    // Check store status every minute
    const interval = setInterval(async () => {
      try {
        const storeOpen = await isStoreOpen();
        setIsStoreCurrentlyOpen(storeOpen);
      } catch (error) {
        console.error('Error checking store hours:', error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [toast]);

  const handleScheduleTime = (date: string, time: string) => {
    setSelectedTime(`${date} at ${time}`);
    setShowTimeModal(false);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
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
        }
      });

      if (checkoutError) throw checkoutError;

      if (checkoutData?.url) {
        // Open Stripe Checkout in a new window
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

  const content = (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <OrderHeader mode={mode} setMode={() => {}} />
          
          <LocationInfo 
            storeName={storeName}
            storeAddress={storeAddress}
            selectedTime={selectedTime}
            onTimeChange={() => setShowTimeModal(true)}
          />

          <OrderItems />

          <div className="pt-4">
            <ComplementaryItems />
          </div>
        </div>
      </div>

      <div className="mt-auto p-6">
        <CheckoutButton
          isStoreCurrentlyOpen={isStoreCurrentlyOpen}
          isCheckingStoreHours={isCheckingStoreHours}
          isProcessing={isProcessing}
          itemCount={items.length}
          total={calculateTotal()}
          onCheckout={handleCheckout}
        />
      </div>

      <PickupTimeModal
        isOpen={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        onSchedule={handleScheduleTime}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="fixed top-0 right-0 w-[400px] h-screen bg-white border-l border-gray-200 z-40">
      {content}
    </div>
  );
};
