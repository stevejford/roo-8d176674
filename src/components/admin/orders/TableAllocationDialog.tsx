import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TableOrderActions } from './table/TableOrderActions';
import { TableAllocationForm } from './table/TableAllocationForm';

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

  const handleAllocation = async (customerName: string) => {
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
      const { data: existingItems, error: queryError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', table.order_id)
        .eq('product_id', product.id);

      if (queryError) throw queryError;

      let updatedItem;
      
      if (existingItems && existingItems.length > 0) {
        // Update quantity if item exists
        const existingItem = existingItems[0];
        const { data, error: updateError } = await supabase
          .from('order_items')
          .update({ 
            quantity: existingItem.quantity + 1,
            price: product.price
          })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (updateError) throw updateError;
        updatedItem = data;
      } else {
        // Insert new item if it doesn't exist
        const { data, error: insertError } = await supabase
          .from('order_items')
          .insert({
            order_id: table.order_id,
            product_id: product.id,
            quantity: 1,
            price: product.price,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        updatedItem = data;
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
        <TableAllocationForm onAllocate={handleAllocation} />
      ) : (
        <TableOrderActions 
          orderId={table.order_id!} 
          onAddItem={handleAddItem}
        />
      )}
    </DialogContent>
  );
};