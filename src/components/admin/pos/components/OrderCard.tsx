import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OrderActions } from "./OrderActions";

interface OrderCardProps {
  order: any;
  onUpdateCustomerName: (orderId: string, name: string) => void;
  onAddItems: (orderId: string) => void;
  onSendToKitchen: (orderId: string) => void;
  onPrintReceipt: (order: any) => void;
  onDelete: (orderId: string) => void;
}

export const OrderCard = ({
  order,
  onUpdateCustomerName,
  onAddItems,
  onSendToKitchen,
  onPrintReceipt,
  onDelete
}: OrderCardProps) => {
  const calculateTotal = (orderItems: any[]) => {
    return orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  };

  return (
    <Card key={order.id} className="p-4 space-y-4">
      <Input
        placeholder="Customer Name"
        value={order.customer_name || ''}
        onChange={(e) => onUpdateCustomerName(order.id, e.target.value)}
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

      <OrderActions
        orderId={order.id}
        onAddItems={onAddItems}
        onSendToKitchen={onSendToKitchen}
        onPrintReceipt={onPrintReceipt}
        onDelete={onDelete}
      />
    </Card>
  );
};