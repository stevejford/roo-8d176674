import React, { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { getStoreSettings, isStoreOpen } from "@/utils/businessHours";
import { useToast } from "@/hooks/use-toast";
import { OrderContent } from "./order/OrderContent";
import { OrderSuccessDialog } from "./order/OrderSuccessDialog";
import { OrderStateProvider, useOrderState } from "./order/OrderStateProvider";
import { useCartStore } from "@/stores/useCartStore";

interface OrderLocationProps {
  mode: 'pickup' | 'delivery';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const OrderLocationContent = ({ mode }: { mode: 'pickup' | 'delivery' }) => {
  const [storeAddress, setStoreAddress] = useState("");
  const [storeName, setStoreName] = useState("");
  const [isStoreCurrentlyOpen, setIsStoreCurrentlyOpen] = useState(false);
  const [isCheckingStoreHours, setIsCheckingStoreHours] = useState(true);
  const { toast } = useToast();
  const { items } = useCartStore();
  const {
    selectedTime,
    showTimeModal,
    setShowTimeModal,
    showSuccessDialog,
    setShowSuccessDialog,
    successOrderDetails,
    handleCheckout,
    calculateTotal,
    isProcessing,
    validVoucher,
    setSelectedTime
  } = useOrderState();

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
    const formattedTime = `${date} at ${time}`;
    setSelectedTime(formattedTime);
    setShowTimeModal(false);
  };

  return (
    <>
      <OrderContent
        mode={mode}
        storeName={storeName}
        storeAddress={storeAddress}
        selectedTime={selectedTime}
        isStoreCurrentlyOpen={isStoreCurrentlyOpen}
        isCheckingStoreHours={isCheckingStoreHours}
        isProcessing={isProcessing}
        itemCount={items.length}
        total={calculateTotal()}
        validVoucher={validVoucher}
        calculateTotal={calculateTotal}
        onTimeChange={() => setShowTimeModal(true)}
        onCheckout={handleCheckout}
        showTimeI'll help fix the checkout flow to properly handle pickup time selection and update the state correctly. The issue is in the OrderStateProvider where the handleScheduleTime function isn't actually updating the selected time.

<lov-code>
Let's update the OrderLocation.tsx file to properly handle time selection:

<lov-write file_path="src/components/OrderLocation.tsx">
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { getStoreSettings, isStoreOpen } from "@/utils/businessHours";
import { useToast } from "@/hooks/use-toast";
import { OrderContent } from "./order/OrderContent";
import { OrderSuccessDialog } from "./order/OrderSuccessDialog";
import { OrderStateProvider, useOrderState } from "./order/OrderStateProvider";
import { useCartStore } from "@/stores/useCartStore";

interface OrderLocationProps {
  mode: 'pickup' | 'delivery';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const OrderLocationContent = ({ mode }: { mode: 'pickup' | 'delivery' }) => {
  const [storeAddress, setStoreAddress] = useState("");
  const [storeName, setStoreName] = useState("");
  const [isStoreCurrentlyOpen, setIsStoreCurrentlyOpen] = useState(false);
  const [isCheckingStoreHours, setIsCheckingStoreHours] = useState(true);
  const { toast } = useToast();
  const { items } = useCartStore();
  const {
    selectedTime,
    showTimeModal,
    setShowTimeModal,
    showSuccessDialog,
    setShowSuccessDialog,
    successOrderDetails,
    handleCheckout,
    calculateTotal,
    isProcessing,
    validVoucher,
    setSelectedTime
  } = useOrderState();

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
    const formattedTime = `${date} at ${time}`;
    setSelectedTime(formattedTime);
    setShowTimeModal(false);
  };

  return (
    <>
      <OrderContent
        mode={mode}
        storeName={storeName}
        storeAddress={storeAddress}
        selectedTime={selectedTime}
        isStoreCurrentlyOpen={isStoreCurrentlyOpen}
        isCheckingStoreHours={isCheckingStoreHours}
        isProcessing={isProcessing}
        itemCount={items.length}
        total={calculateTotal()}
        validVoucher={validVoucher}
        calculateTotal={calculateTotal}
        onTimeChange={() => setShowTimeModal(true)}
        onCheckout={handleCheckout}
        showTimeModal={showTimeModal}
        onCloseTimeModal={() => setShowTimeModal(false)}
        onScheduleTime={handleScheduleTime}
      />
      <OrderSuccessDialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        orderDetails={successOrderDetails}
      />
    </>
  );
};

export const OrderLocation = ({ mode, isOpen = true, onOpenChange }: OrderLocationProps) => {
  const isMobile = useIsMobile();

  const wrappedContent = (
    <OrderStateProvider>
      <OrderLocationContent mode={mode} />
    </OrderStateProvider>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0">
          {wrappedContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="fixed top-0 right-0 w-[400px] h-screen bg-white border-l border-gray-200 z-40">
      {wrappedContent}
    </div>
  );
};