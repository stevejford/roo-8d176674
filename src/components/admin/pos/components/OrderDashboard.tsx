import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { OrderCard } from './OrderCard';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  customerName?: string;
}

export const OrderDashboard = () => {
  const [activeOrders, setActiveOrders] = React.useState<Order[]>([]);
  const { toast } = useToast();

  const handleUpdateCustomerName = (orderId: string, name: string) => {
    setActiveOrders(orders =>
      orders.map(order =>
        order.id === orderId
          ? { ...order, customerName: name }
          : order
      )
    );
  };

  const handleSendToKitchen = async (order: Order) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_name: order.customerName,
          status: 'confirmed',
          total_amount: order.total,
        })
        .select()
        .single();

      if (error) throw error;

      // Add order items
      const orderItems = order.items.map(item => ({
        order_id: data.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Order Sent",
        description: "Order has been sent to the kitchen",
      });

      // Remove the order from active orders
      setActiveOrders(orders =>
        orders.filter(o => o.id !== order.id)
      );
    } catch (error) {
      console.error('Error sending order:', error);
      toast({
        title: "Error",
        description: "Failed to send order to kitchen",
        variant: "destructive",
      });
    }
  };

  const handlePrintReceipt = (order: Order) => {
    // Create a new window for the receipt
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .item { display: flex; justify-content: space-between; margin: 5px 0; }
              .total { border-top: 1px solid black; margin-top: 10px; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Receipt</h2>
              <p>Customer: ${order.customerName || 'Guest'}</p>
              <p>${new Date().toLocaleString()}</p>
            </div>
            ${order.items.map(item => `
              <div class="item">
                <span>${item.quantity}x ${item.title}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="total">
              <strong>Total: $${order.total.toFixed(2)}</strong>
            </div>
          </body>
        </html>
      `);
      receiptWindow.document.close();
      receiptWindow.print();
    }
  };

  const handleStartNewOrder = () => {
    setActiveOrders(orders => [
      ...orders,
      {
        id: Math.random().toString(36).substr(2, 9),
        items: [],
        total: 0,
      }
    ]);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Active Orders</h2>
        <Button onClick={handleStartNewOrder}>
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onUpdateCustomerName={(name) => handleUpdateCustomerName(order.id, name)}
            onSendToKitchen={() => handleSendToKitchen(order)}
            onPrintReceipt={() => handlePrintReceipt(order)}
            onStartNewOrder={handleStartNewOrder}
          />
        ))}
      </div>
    </div>
  );
};