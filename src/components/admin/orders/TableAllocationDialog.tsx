import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TableOrderActions } from './table/TableOrderActions';

interface Table {
  table_number: string;
  status: 'available' | 'occupied' | 'reserved';
  customer_name?: string;
  order_id?: string;
}

interface TableAllocationDialogProps {
  table: Table;
  onClose: () => void;
  onSuccess: () => void;
}

export const TableAllocationDialog = ({ table, onClose, onSuccess }: TableAllocationDialogProps) => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeout' | 'phone'>('dine-in');

  const handleAllocation = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter customer name",
        variant: "destructive",
      });
      return;
    }

    console.log('Creating new order for table:', table.table_number);

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          table_number: orderType === 'dine-in' ? table.table_number : null,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          order_type: orderType,
          status: 'pending',
          created_by: (await supabase.auth.getUser()).data.user?.id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to allocate table",
        variant: "destructive",
      });
      return;
    }

    console.log('Order created successfully:', data);

    toast({
      title: "Success",
      description: `Order created for ${customerName}`,
    });
    
    onClose();
    onSuccess();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {table.status === 'available' 
            ? `New Order - Table ${table.table_number}`
            : `Table ${table.table_number} - ${table.customer_name}`
          }
        </DialogTitle>
        <DialogDescription>
          {table.status === 'available' 
            ? "Enter customer details to create a new order"
            : "View or manage the current order"
          }
        </DialogDescription>
      </DialogHeader>

      {table.status === 'available' ? (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="orderType">Order Type</Label>
            <Select
              value={orderType}
              onValueChange={(value: 'dine-in' | 'takeout' | 'phone') => setOrderType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dine-in">Dine-in</SelectItem>
                <SelectItem value="takeout">Takeout</SelectItem>
                <SelectItem value="phone">Phone Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAllocation}>Create Order</Button>
          </div>
        </div>
      ) : (
        <TableOrderActions 
          orderId={table.order_id!} 
          onAddItem={() => {}}
        />
      )}
    </DialogContent>
  );
};