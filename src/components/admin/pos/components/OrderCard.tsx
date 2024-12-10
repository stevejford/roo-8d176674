import React from 'react';
import { Printer, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderCardProps {
  order: {
    items: Array<{
      id: string;
      title: string;
      quantity: number;
      price: number;
    }>;
    total: number;
  };
  onUpdateCustomerName: (name: string) => void;
  onSendToKitchen: () => void;
  onPrintReceipt: () => void;
  onStartNewOrder: () => void;
}

export const OrderCard = ({
  order,
  onUpdateCustomerName,
  onSendToKitchen,
  onPrintReceipt,
  onStartNewOrder,
}: OrderCardProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Customer Name"
          onChange={(e) => onUpdateCustomerName(e.target.value)}
          className="w-full"
        />
        <div className="text-sm text-gray-500">
          Order Items:
        </div>
        <div className="space-y-1">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.title}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button 
          onClick={onSendToKitchen}
          className="w-full"
          variant="default"
        >
          <Send className="w-4 h-4 mr-2" />
          Send to Kitchen
        </Button>
        <Button
          onClick={onPrintReceipt}
          variant="outline"
          className="w-full"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Receipt
        </Button>
        <Button
          onClick={onStartNewOrder}
          variant="secondary"
          className="w-full"
        >
          Start New Order
        </Button>
      </div>
    </Card>
  );
};