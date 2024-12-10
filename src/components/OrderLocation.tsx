import React, { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ComplementaryItems } from "./ComplementaryItems";
import { getStoreSettings, isStoreOpen } from "@/utils/businessHours";
import { PickupTimeModal } from "./PickupTimeModal";
import { OrderHeader } from "./order/OrderHeader";
import { LocationInfo } from "./order/LocationInfo";
import { OrderItems } from "./order/OrderItems";
import { useCartStore } from "@/stores/useCartStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

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
  const { items, clearCart } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    const loadStoreData = async () => {
      const settings = await getStoreSettings();
      if (settings) {
        setStoreAddress(settings.address);
        setStoreName(settings.store_name);
      }

      const storeOpen = await isStoreOpen();
      setIsStoreCurrentlyOpen(storeOpen);
    };

    loadStoreData();
    
    // Check store status every minute
    const interval = setInterval(async () => {
      const storeOpen = await isStoreOpen();
      setIsStoreCurrentlyOpen(storeOpen);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
        window.location.href = checkoutData.url;
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
        <button
          className={`w-full ${
            isStoreCurrentlyOpen ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500'
          } text-white py-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors`}
          disabled={!isStoreCurrentlyOpen || items.length === 0 || isProcessing}
          onClick={handleCheckout}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <span>
                {isStoreCurrentlyOpen 
                  ? `Pay ${calculateTotal().toFixed(2)} $` 
                  : 'Store Closed'}
              </span>
              {isStoreCurrentlyOpen && <span className="ml-1">→</span>}
            </>
          )}
        </button>
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