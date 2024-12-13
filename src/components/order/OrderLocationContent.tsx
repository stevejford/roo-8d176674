import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getStoreSettings, isStoreOpen } from "@/utils/businessHours";
import { OrderContent } from "./OrderContent";
import { OrderSuccessDialog } from "./OrderSuccessDialog";
import { useOrderState } from "./OrderStateProvider";
import { useCartStore } from "@/stores/useCartStore";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeliveryModeSelector } from "./DeliveryModeSelector";
import { DeliveryAddressInput } from "./delivery/DeliveryAddressInput";

interface OrderLocationContentProps {
  mode: 'pickup' | 'delivery';
}

export const OrderLocationContent = ({ mode: initialMode }: OrderLocationContentProps) => {
  const [mode, setMode] = useState(initialMode);
  const [storeAddress, setStoreAddress] = useState("");
  const [storeName, setStoreName] = useState("");
  const [isStoreCurrentlyOpen, setIsStoreCurrentlyOpen] = useState(false);
  const [isCheckingStoreHours, setIsCheckingStoreHours] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState("");
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

  const renderDeliveryContent = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#2D3648]">Order</h2>
        <DeliveryModeSelector mode={mode} setMode={setMode} />
      </div>
      
      <div className="space-y-4">
        <DeliveryAddressInput 
          value={deliveryAddress}
          onChange={setDeliveryAddress}
        />

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-[#2D3648]">Delivery Time</h3>
                <p className="text-sm text-gray-600">{selectedTime}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setShowTimeModal(true)}
              className="text-emerald-600 font-medium hover:text-emerald-700"
            >
              CHANGE
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <OrderContent
          mode={mode}
          setMode={setMode}
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
      </div>
    </div>
  );

  const renderPickupContent = () => (
    <OrderContent
      mode={mode}
      setMode={setMode}
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
  );

  return (
    <>
      {mode === 'delivery' ? renderDeliveryContent() : renderPickupContent()}
      <OrderSuccessDialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        orderDetails={successOrderDetails}
      />
    </>
  );
};