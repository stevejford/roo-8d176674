import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Phone } from 'lucide-react';

interface PhoneOrderDialogProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PhoneOrderDialog = ({ onClose, onSuccess }: PhoneOrderDialogProps) => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const handleCreateOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        title: "Error",
        description: "Please enter customer name and phone number",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: customerName,
            customer_phone: customerPhone,
            order_type: 'phone',
            status: 'pending',
            created_by: (await supabase.auth.getUser()).data.user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Phone order created for ${customerName}`,
      });
      
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New Phone Order</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name *</Label>
          <div className="relative">
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className="pl-10"
            />
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerPhone">Phone Number *</Label>
          <div className="relative">
            <Input
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter phone number"
              className="pl-10"
              required
            />
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreateOrder}>Create Order</Button>
        </div>
      </div>
    </DialogContent>
  );
};