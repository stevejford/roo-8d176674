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
  const isPreOrder = !isStoreCurrentlyOpen;

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

  const displayTotal = total.toFixed(2);

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
        isPreOrder 
          ? 'bg-[#F97316] hover:bg-[#F97316]/90' 
          : 'bg-emerald-600 hover:bg-emerald-700'
      } text-white py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={handleClick}
      disabled={itemCount === 0 || isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : isPreOrder ? (
        <>
          <Clock className="w-4 h-4" />
          <span>Pre-order ${displayTotal}</span>
        </>
      ) : (
        <>
          <span>Pay ${displayTotal}</span>
          <span className="ml-1">→</span>
        </>
      )}
    </button>
  );
};