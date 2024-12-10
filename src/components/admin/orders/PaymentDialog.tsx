import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  onSuccess: () => void;
}

export const PaymentDialog = ({ 
  open, 
  onOpenChange, 
  order,
  onSuccess 
}: PaymentDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleStripeCheckout = async () => {
    try {
      setIsLoading(true);

      // Prepare items for Stripe
      const items = order.order_items?.map((item: any) => ({
        title: item.product?.title || 'Unknown Item',
        description: item.product?.description,
        image_url: item.product?.image_url,
        price: item.price,
        quantity: item.quantity,
      }));

      // Create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items,
          customer_email: order.customer_email,
        },
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      }

      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-sm text-gray-500">
            Total Amount: ${order.total_amount?.toFixed(2)}
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleStripeCheckout}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Pay with Stripe"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};