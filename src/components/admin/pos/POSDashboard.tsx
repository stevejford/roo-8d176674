import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { POSMenuBrowser } from './POSMenuBrowser';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OrderCard } from './components/OrderCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const POSDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: orders, refetch } = useQuery({
    queryKey: ['pos-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleUpdateCustomerName = async (orderId: string, name: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ customer_name: name })
      .eq('id', orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update customer name",
        variant: "destructive"
      });
    }
  };

  const handleSendToKitchen = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'preparing' })
      .eq('id', orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send order to kitchen",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Order sent to kitchen",
      });
      refetch();
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    console.log('Attempting to delete order:', orderId);
    
    // First, delete related order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('Error deleting order items:', itemsError);
      toast({
        title: "Error",
        description: "Failed to delete order items",
        variant: "destructive"
      });
      return;
    }

    // Then delete the order itself
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (orderError) {
      console.error('Error deleting order:', orderError);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      });
    } else {
      console.log('Order successfully deleted:', orderId);
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
      setOrderToDelete(null);
      refetch();
    }
  };

  const handlePrintReceipt = (order: any) => {
    console.log('Printing receipt for order:', order);
    toast({
      title: "Print Receipt",
      description: "Receipt printing functionality will be implemented soon",
    });
  };

  const handleStartNewOrder = async () => {
    const { data, error } = await supabase
      .from('orders')
      .insert({ status: 'pending' })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create new order",
        variant: "destructive"
      });
    } else {
      setSelectedOrderId(data.id);
      setIsMenuOpen(true);
    }
  };

  const handleAddItems = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsMenuOpen(true);
  };

  return (
    <div className="h-screen flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Active Orders</h2>
        <Button onClick={handleStartNewOrder} className="bg-[#10B981]">
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders?.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onUpdateCustomerName={handleUpdateCustomerName}
            onAddItems={handleAddItems}
            onSendToKitchen={handleSendToKitchen}
            onPrintReceipt={handlePrintReceipt}
            onDelete={(orderId) => {
              console.log('Delete button clicked for order:', orderId);
              setOrderToDelete(orderId);
            }}
          />
        ))}
      </div>
      
      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DialogContent className="max-w-7xl h-[90vh]">
          <POSMenuBrowser 
            orderId={selectedOrderId}
            onOrderComplete={() => {
              setIsMenuOpen(false);
              refetch();
            }} 
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the order and all its items. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (orderToDelete) {
                  console.log('Confirming deletion of order:', orderToDelete);
                  handleDeleteOrder(orderToDelete);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};