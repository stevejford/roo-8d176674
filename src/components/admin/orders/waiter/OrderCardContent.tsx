import { OrderHeader } from './OrderHeader';
import { OrderItems } from './OrderItems';
import { OrderTotal } from './OrderTotal';
import { OrderActions } from './OrderActions';
import { Button } from "@/components/ui/button";
import { Plus, UtensilsCrossed, Trash2 } from "lucide-react";

interface OrderCardContentProps {
  order: any;
  statusColors: Record<string, string>;
  onSendToKitchen: (e: React.MouseEvent) => void;
  onAddItems: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onPayment: (method: 'cash' | 'card') => Promise<void>;
  isProcessingPayment: boolean;
}

export const OrderCardContent = ({
  order,
  statusColors,
  onSendToKitchen,
  onAddItems,
  onDeleteClick,
  onPayment,
  isProcessingPayment
}: OrderCardContentProps) => {
  return (
    <div className="relative">
      <div className="flex justify-between items-start">
        <OrderHeader 
          orderId={order.id}
          status={order.status}
          statusColors={statusColors}
        />
        {order.status === 'pending' && (
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={onDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <OrderItems items={order.order_items} />
      <OrderTotal total={order.total_amount} />

      <div className="flex flex-col gap-3">
        {order.status === 'pending' && (
          <>
            <Button 
              variant="outline"
              className="w-full justify-center"
              onClick={onAddItems}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Items
            </Button>
            <Button 
              className="w-full justify-center bg-orange-500 hover:bg-orange-600"
              onClick={onSendToKitchen}
            >
              <UtensilsCrossed className="w-4 h-4 mr-2" />
              Send to Kitchen
            </Button>
          </>
        )}
        
        <OrderActions
          status={order.status}
          orderTotal={order.total_amount}
          isProcessingPayment={isProcessingPayment}
          onPayment={onPayment}
        />
      </div>
    </div>
  );
};