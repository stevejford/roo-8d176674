import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
      setOrderToDelete(null);
      refetch();
    } catch (error: any) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      });
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

  if (isMenuOpen) {
    return (
      <POSMenuBrowser 
        orderId={selectedOrderId}
        onOrderComplete={() => {
          setIsMenuOpen(false);
          setSelectedOrderId(null);
          refetch();
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Active Orders</h2>
        <Button onClick={handleStartNewOrder} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {orders?.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onAddItems={handleAddItems}
            onPrintReceipt={handlePrintReceipt}
            onDelete={(orderId) => setOrderToDelete(orderId)}
          />
        ))}
      </div>

      <AlertDialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the order and its items. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (orderToDelete) {
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