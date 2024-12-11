import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getStoreSettings, isStoreOpen } from "@/utils/businessHours";
import { OrderContent } from "./OrderContent";
import { OrderSuccessDialog } from "./OrderSuccessDialog";
import { useOrderState } from "./OrderStateProvider";
import { useCartStore } from "@/stores/useCartStore";

interface OrderLocationContentProps {
  mode: 'pickup' | 'delivery';
}

export const OrderLocationContent = ({ mode }: OrderLocationContentProps) => {
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