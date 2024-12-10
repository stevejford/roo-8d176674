import React, { useState } from 'react';
import { OrderCard } from './OrderCard';

interface OrderDashboardProps {
  onAddItems: (orderId: string) => void;
}

export const OrderDashboard = ({ onAddItems }: OrderDashboardProps) => {
  const [activeOrders, setActiveOrders] = useState<any[]>([]);

  const handleUpdateCustomerName = (orderId: string, name: string) => {
    setActiveOrders(orders =>
      orders.map(order =>
        order.id === orderId
          ? { ...order, customerName: name }
          : order
      )
    );
  };

  const handleSendToKitchen = async (order: any) => {
    // Implementation for sending to kitchen
    console.log('Sending to kitchen:', order);
  };

  const handlePrintReceipt = (order: any) => {
    // Implementation for printing receipt
    console.log('Printing receipt:', order);
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {activeOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onUpdateCustomerName={handleUpdateCustomerName}
          onSendToKitchen={handleSendToKitchen}
          onPrintReceipt={handlePrintReceipt}
          onStartNewOrder={handleStartNewOrder}
          onAddItems={onAddItems}
        />
      ))}
      
      {activeOrders.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No active orders. Click "New Order" to start one.
        </div>
      )}
    </div>
  );
};