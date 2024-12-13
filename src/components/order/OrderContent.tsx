import React from 'react';
import { OrderHeader } from "./OrderHeader";
import { LocationInfo } from "./LocationInfo";
import { OrderItems } from "./OrderItems";
import { ComplementaryItems } from "../ComplementaryItems";
import { OrderTotals } from "./OrderTotals";
import { CheckoutButton } from "./CheckoutButton";
import { PickupTimeModal } from "../PickupTimeModal";
import { TrustInfo } from "./TrustInfo";
import type { Voucher } from "@/hooks/useVoucherValidation";

interface OrderContentProps {
  mode: 'pickup' | 'delivery';
  setMode: (mode: 'pickup' | 'delivery') => void;
  storeName: string;
  storeAddress: string;
  selectedTime: string;
  isStoreCurrentlyOpen: boolean;
  isCheckingStoreHours: boolean;
  isProcessing: boolean;
  itemCount: number;
  total: number;
  validVoucher: Voucher | null;
  calculateTotal: () => number;
  onTimeChange: () => void;
  onCheckout: () => void;
  showTimeModal: boolean;
  onCloseTimeModal: () => void;
  onScheduleTime: (date: string, time: string) => void;
}

export const OrderContent = ({
  mode,
  setMode,
  storeName,
  storeAddress,
  selectedTime,
  isStoreCurrentlyOpen,
  isCheckingStoreHours,
  isProcessing,
  itemCount,
  total,
  validVoucher,
  calculateTotal,
  onTimeChange,
  onCheckout,
  showTimeModal,
  onCloseTimeModal,
  onScheduleTime,
}: OrderContentProps) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <OrderHeader mode={mode} setMode={setMode} />
          
          <LocationInfo 
            storeName={storeName}
            storeAddress={storeAddress}
            selectedTime={selectedTime}
            onTimeChange={onTimeChange}
          />

          <OrderItems />

          <div className="pt-4">
            <ComplementaryItems />
          </div>
        </div>
      </div>

      <div className="mt-auto p-6">
        <OrderTotals 
          validVoucher={validVoucher}
          calculateTotal={calculateTotal}
        />
        <CheckoutButton
          isStoreCurrentlyOpen={isStoreCurrentlyOpen}
          isCheckingStoreHours={isCheckingStoreHours}
          isProcessing={isProcessing}
          itemCount={itemCount}
          total={total}
          onCheckout={onCheckout}
        />
        <TrustInfo />
      </div>

      <PickupTimeModal
        isOpen={showTimeModal}
        onClose={onCloseTimeModal}
        onSchedule={onScheduleTime}
      />
    </div>
  );
};