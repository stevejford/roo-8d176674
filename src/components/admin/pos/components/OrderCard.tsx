import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Printer, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OrderCardProps {
  order: any;
  onAddItems: () => void;
  onDelete: (orderId: string) => void;
}

export const OrderCard = ({ order, onAddItems, onDelete }: OrderCardProps) => {
  const [isEditing, setIsEditing] = useState(!order.customer_name);
  const [customerName, setCustomerName] = useState(order.customer_name || '');
  const { toast } = useToast();

  const calculateTotal = (items: any[]) => {
    return items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  };

  const handleUpdateCustomerName = async () => {
    if (!customerName.trim()) return;

    const { error } = await supabase
      .from('orders')
      .update({ customer_name: customerName.trim() })
      .eq('id', order.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update customer name",
        variant: "destructive"
      });
    } else {
      setIsEditing(false);
    }
  };

  const handlePrintReceipt = () => {
    console.log('Printing receipt for order:', order);
    toast({
      title: "Print Receipt",
      description: "Receipt printing functionality will be implemented soon",
    });
  };

  return (
    <Card className="p-6 space-y-6">
      {isEditing ? (
        <div className="space-y-2">
          <Input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdateCustomerName();
              }
            }}
            onBlur={handleUpdateCustomerName}
          />
        </div>
      ) : (
        <div 
          className="cursor-pointer py-2 text-lg font-medium"
          onClick={() => setIsEditing(true)}
        >
          {customerName || 'Click to add customer name'}
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm text-gray-500">Order Items:</p>
        <div className="space-y-2 min-h-[100px]">
          {order.order_items?.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.product?.title}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center text-lg font-semibold border-t pt-4">
        <span>Total</span>
        <span>${calculateTotal(order.order_items).toFixed(2)}</span>
      </div>

      <div className="grid gap-2">
        <Button 
          onClick={onAddItems}
          variant="outline"
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Items
        </Button>
        
        <Button
          onClick={() => {
            // Send to kitchen functionality will be implemented
            toast({
              title: "Coming Soon",
              description: "Send to kitchen functionality will be implemented soon",
            });
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Send to Kitchen
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handlePrintReceipt}
            variant="outline"
            className="w-full"
          >
            <Printer className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => onDelete(order.id)}
            variant="outline"
            className="w-full text-red-600 hover:text-red-700"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};