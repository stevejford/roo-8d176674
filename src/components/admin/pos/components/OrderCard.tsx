import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Send, Printer } from "lucide-react";

interface OrderCardProps {
  order: {
    id: string;
    customerName?: string;
    items: Array<{
      title: string;
      quantity: number;
      price: number;
    }>;
    total: number;
  };
  onUpdateCustomerName: (orderId: string, name: string) => void;
  onSendToKitchen: (order: any) => void;
  onPrintReceipt: (order: any) => void;
  onStartNewOrder: () => void;
  onAddItems: (orderId: string) => void;
}

export const OrderCard = ({
  order,
  onUpdateCustomerName,
  onSendToKitchen,
  onPrintReceipt,
  onStartNewOrder,
  onAddItems,
}: OrderCardProps) => {
  return (
    <Card className="p-4 space-y-4">
      <Input
        placeholder="Customer Name"
        value={order.customerName || ''}
        onChange={(e) => onUpdateCustomerName(order.id, e.target.value)}
        className="w-full"
      />

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Order Items:</h3>
        <div className="space-y-1">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.title}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center font-medium">
        <span>Total</span>
        <span>${order.total.toFixed(2)}</span>
      </div>

      <div className="space-y-2">
        <Button 
          className="w-full bg-[#10B981]"
          onClick={() => onAddItems(order.id)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Items
        </Button>

        <Button 
          className="w-full bg-[#10B981]"
          onClick={() => onSendToKitchen(order)}
        >
          <Send className="w-4 h-4 mr-2" />
          Send to Kitchen
        </Button>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onPrintReceipt(order)}
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Receipt
        </Button>

        <Button 
          variant="secondary"
          className="w-full"
          onClick={onStartNewOrder}
        >
          Start New Order
        </Button>
      </div>
    </Card>
  );
};