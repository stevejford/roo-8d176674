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
import { TableOrderActions } from './TableOrderActions';
import { User } from 'lucide-react';

interface Table {
  table_number: string;
  status: 'available' | 'occupied' | 'reserved';
  customer_name?: string;
  order_id?: string;
}

interface DineInOrderDialogProps {
  table: Table;
  onClose: () => void;
  onSuccess: () => void;
}

export const DineInOrderDialog = ({ table, onClose, onSuccess }: DineInOrderDialogProps) => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');

  const handleCreateOrder = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter customer name",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            table_number: table.table_number,
            customer_name: customerName,
            order_type: 'dine-in',
            status: 'pending',
            created_by: (await supabase.auth.getUser()).data.user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Order created for ${customerName}`,
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

  if (table.status !== 'available') {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Table {table.table_number} - {table.customer_name}
          </DialogTitle>
        </DialogHeader>
        {table.order_id && (
          <TableOrderActions 
            orderId={table.order_id} 
            onAddItem={async () => {
              // Implementation for adding item would go here
              return Promise.resolve();
            }}
          />
        )}
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New Order - Table {table.table_number}</DialogTitle>
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

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreateOrder}>Create Order</Button>
        </div>
      </div>
    </DialogContent>
  );
};