import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Send, Printer, Trash2 } from "lucide-react";
import { POSMenuBrowser } from './POSMenuBrowser';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
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
    const { error } = await supabase
      .from('orders')
      .update({ 
        deleted_at: new Date().toISOString(),
        status: 'cancelled'
      })
      .eq('id', orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
      setOrderToDelete(null);
      refetch();
    }
  };

  const handlePrintReceipt = (order: any) => {
    // Implementation for printing receipt
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

  const calculateTotal = (orderItems: any[]) => {
    return orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
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
          <Card key={order.id} className="p-4 space-y-4">
            <Input
              placeholder="Customer Name"
              value={order.customer_name || ''}
              onChange={(e) => handleUpdateCustomerName(order.id, e.target.value)}
              className="w-full"
            />

            <div>
              <p className="text-sm text-gray-500 mb-2">Order Items:</p>
              <div className="space-y-1">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.product?.title}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center font-medium">
              <span>Total</span>
              <span>${calculateTotal(order.order_items).toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full bg-[#10B981]"
                onClick={() => handleAddItems(order.id)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Items
              </Button>

              <Button 
                className="w-full bg-[#10B981]"
                onClick={() => handleSendToKitchen(order.id)}
              >
                <Send className="w-4 h-4 mr-2" />
                Send to Kitchen
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handlePrintReceipt(order)}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>

              <Button 
                variant="destructive"
                className="w-full"
                onClick={() => setOrderToDelete(order.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Order
              </Button>
            </div>
          </Card>
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
              This action will delete the order. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => orderToDelete && handleDeleteOrder(orderToDelete)}
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