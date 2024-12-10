import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { POSMenuBrowser } from './POSMenuBrowser';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from 'date-fns';

interface OrderItem {
  product: any;
  quantity: number;
  price: number;
}

export const POSDashboard = () => {
  const [customerName, setCustomerName] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const { toast } = useToast();

  const handleAddItem = async (product: any, quantity: number) => {
    const existingItem = orderItems.find(item => item.product.id === product.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setOrderItems([...orderItems, { product, quantity, price: product.price }]);
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Customer name required",
        description: "Please enter a customer name before submitting the order",
        variant: "destructive",
      });
      return;
    }

    if (orderItems.length === 0) {
      toast({
        title: "Empty order",
        description: "Please add items to the order before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: customerName,
            status: 'confirmed',
            total_amount: calculateTotal(),
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItemsData = orderItems.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      toast({
        title: "Order sent to kitchen",
        description: `Order #${order.id.slice(0, 8)} has been created`,
      });

      setShowReceipt(true);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const resetOrder = () => {
    setOrderItems([]);
    setCustomerName('');
    setShowReceipt(false);
  };

  return (
    <div className="h-screen flex">
      {/* Left side - Menu Browser */}
      <div className="flex-1 border-r">
        <POSMenuBrowser onSelect={handleAddItem} />
      </div>

      {/* Right side - Order Summary */}
      <div className="w-96 flex flex-col bg-gray-50 p-4">
        <h2 className="text-2xl font-bold mb-4">Current Order</h2>
        
        <Input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="mb-4"
        />

        <div className="flex-1 overflow-auto">
          {orderItems.map((item, index) => (
            <div key={`${item.product.id}-${index}`} className="flex justify-between items-center mb-2 p-2 bg-white rounded shadow-sm">
              <div>
                <p className="font-medium">{item.product.title}</p>
                <p className="text-sm text-gray-500">
                  ${item.price} × {item.quantity}
                </p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold">${calculateTotal().toFixed(2)}</span>
          </div>

          <Button 
            className="w-full mb-2" 
            onClick={handleSubmitOrder}
            disabled={orderItems.length === 0 || !customerName.trim()}
          >
            Send to Kitchen
          </Button>
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Receipt</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-bold text-xl">Restaurant Name</h3>
              <p className="text-sm text-gray-500">{format(new Date(), 'PPpp')}</p>
            </div>

            <div>
              <p><strong>Customer:</strong> {customerName}</p>
            </div>

            <div className="space-y-2">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.product.title}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button onClick={handlePrintReceipt}>Print Receipt</Button>
            <Button onClick={resetOrder} variant="outline">New Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};