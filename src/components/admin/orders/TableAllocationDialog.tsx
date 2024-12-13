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
import { Phone, User, Mail, Store, TakeoutDining } from 'lucide-react';

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

  if (table.status !== 'available') {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Table {table.table_number} - {table.customer_name}
          </DialogTitle>
          <DialogDescription>
            View or manage the current order
          </DialogDescription>
        </DialogHeader>
        {table.order_id && (
          <TableOrderActions 
            orderId={table.order_id} 
            onAddItem={async () => {
              // This is now a Promise<void> as required by the type
              return new Promise<void>((resolve) => {
                // Implementation for adding item would go here
                resolve();
              });
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
        <DialogDescription>
          Enter customer details to create a new order
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="orderType">Order Type</Label>
          <Select
            value={orderType}
            onValueChange={(value: 'dine-in' | 'takeout' | 'phone') => setOrderType(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select order type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dine-in">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span>Dine-in</span>
                </div>
              </SelectItem>
              <SelectItem value="takeout">
                <div className="flex items-center gap-2">
                  <TakeoutDining className="h-4 w-4" />
                  <span>Takeout</span>
                </div>
              </SelectItem>
              <SelectItem value="phone">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone Order</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

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
          <Label htmlFor="customerPhone">Phone Number</Label>
          <div className="relative">
            <Input
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter phone number"
              className="pl-10"
            />
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email</Label>
          <div className="relative">
            <Input
              id="customerEmail"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Enter email address"
              className="pl-10"
              type="email"
            />
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAllocation}>Create Order</Button>
        </div>
      </div>
    </DialogContent>
  );
};