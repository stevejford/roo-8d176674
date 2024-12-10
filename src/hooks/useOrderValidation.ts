import { useState } from 'react';
import { useToast } from './use-toast';

export const useOrderValidation = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const validateOrder = (selectedTime: string) => {
    if (selectedTime === "Wednesday - Reopen") {
      toast({
        title: "Pickup Time Required",
        description: "Please select a pickup time before proceeding to checkout.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  return {
    isProcessing,
    setIsProcessing,
    validateOrder
  };
};