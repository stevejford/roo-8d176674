import { format } from 'date-fns';
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface WaiterOrderCardProps {
  order: any;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  statusColors: Record<string, string>;
  isNew?: boolean;
}

export const WaiterOrderCard = ({ 
  order, 
  onUpdateStatus, 
  statusColors, 
  isNew = false 
}: WaiterOrderCardProps) => {
  const calculateTotal = () => {
    return order.order_items?.reduce((acc: number, item: any) => {
      return acc + (item.price * item.quantity);
    }, 0) || 0;
  };

  const orderTotal = calculateTotal();

  return (
    <div className={`border rounded-lg p-6 bg-white shadow-sm space-y-4 ${
      isNew ? 'ring-2 ring-blue-500 animate-pulse' : ''
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
            <Badge 
              variant="secondary"
              className={`${statusColors[order.status]} px-2 py-0.5`}
            >
              {order.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(order.created_at), 'HH:mm')}
          </p>
          {order.table_number && (
            <p className="text-sm font-medium text-gray-700 mt-1">
              Table {order.table_number}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {order.order_items?.map((item: any) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
            <div className="flex items-center gap-3">
              <span className="font-medium">{item.quantity}x</span>
              <span>{item.product?.title}</span>
            </div>
            <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Total</span>
          <span className="font-bold text-lg">${orderTotal.toFixed(2)}</span>
        </div>

        {order.status === 'pending' && (
          <Button
            onClick={() => onUpdateStatus(order.id, 'confirmed')}
            className="w-full"
            size="lg"
          >
            <Send className="w-4 h-4 mr-2" />
            Send to Kitchen
          </Button>
        )}
      </div>
    </div>
  );
};