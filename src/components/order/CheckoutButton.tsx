import React from 'react';
import { Loader2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CheckoutButtonProps {
  isStoreCurrentlyOpen: boolean;
  isCheckingStoreHours: boolean;
  isProcessing: boolean;
  itemCount: number;
  total: number;
  onCheckout: () => void;
}

export const CheckoutButton = ({
  isStoreCurrentlyOpen,
  isCheckingStoreHours,
  isProcessing,
  itemCount,
  total,
  onCheckout
}: CheckoutButtonProps) => {
  const { toast } = useToast();

  const handleClick = () => {
    if (!isStoreCurrentlyOpen) {
      toast({
        title: "Store Closed",
        description: "Pre-orders will be accepted after 12am. Please try again then.",
        variant: "default"
      });
      return;
    }
    onCheckout();
  };

  if (isCheckingStoreHours) {
    return (
      <button
        className="w-full bg-gray-400 text-white py-4 rounded-lg font-medium flex items-center justify-center"
        disabled
      >
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Checking store hours...
      </button>
    );
  }

  return (
    <button
      className={`w-full ${
        isStoreCurrentlyOpen ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500'
      } text-white py-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors`}
      onClick={handleClick}
      disabled={!isStoreCurrentlyOpen || itemCount === 0 || isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : !isStoreCurrentlyOpen ? (
        <>
          <Clock className="w-4 h-4 mr-2" />
          Pre-order Available at 12am
        </>
      ) : (
        <>
          <span>Pay ${total.toFixed(2)}</span>
          <span className="ml-1">→</span>
        </>
      )}
    </button>
  );
};