import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuBrowser } from './MenuBrowser';
import {
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

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
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleAllocation = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a customer name",
        variant: "destructive",
      });
      return;
    }

    console.log('Creating new order for table:', table.table_number);

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          table_number: table.table_number,
          customer_name: customerName,
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
      description: `Table ${table.table_number} allocated to ${customerName}`,
    });
    
    setCustomerName('');
    onClose();
    onSuccess();
  };

  const handleAddItem = async (product: any) => {
    if (!table.order_id) {
      toast({
        title: "Error",
        description: "No active order found for this table",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, check if the item already exists in the order
      const { data: existingItems } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', table.order_id)
        .eq('product_id', product.id)
        .single();

      if (existingItems) {
        // Update quantity if item exists
        const { error: updateError } = await supabase
          .from('order_items')
          .update({ 
            quantity: existingItems.quantity + 1,
            price: product.price
          })
          .eq('id', existingItems.id);

        if (updateError) throw updateError;
      } else {
        // Insert new item if it doesn't exist
        const { error: insertError } = await supabase
          .from('order_items')
          .insert({
            order_id: table.order_id,
            product_id: product.id,
            quantity: 1,
            price: product.price,
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: `Added ${product.title} to the order`,
      });

      // Update the total amount in the orders table
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('price, quantity')
        .eq('order_id', table.order_id);

      if (orderItems) {
        const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        await supabase
          .from('orders')
          .update({ total_amount: totalAmount })
          .eq('id', table.order_id);
      }

      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item to order",
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {table.status === 'available' 
            ? `Allocate Table ${table.table_number}`
            : `Table ${table.table_number} - ${table.customer_name}`
          }
        </DialogTitle>
        <DialogDescription>
          {table.status === 'available' 
            ? "Enter customer details to allocate this table"
            : "View or manage the current table allocation"
          }
        </DialogDescription>
      </DialogHeader>
      {table.status === 'available' ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Customer Name</label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <Button 
            className="w-full"
            onClick={handleAllocation}
          >
            Allocate Table
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button 
              className="flex-1"
              onClick={() => {
                navigate(`/admin/waiter/order/${table.order_id}`);
              }}
            >
              View Order Details
            </Button>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Items
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <div className="h-full py-6">
                  <MenuBrowser onSelectItem={handleAddItem} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}
    </DialogContent>
  );
};