import { format } from 'date-fns';
import { CheckCircle, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface WaiterOrderCardProps {
  order: any;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  statusColors: Record<string, string>;
}

export const WaiterOrderCard = ({ order, onUpdateStatus, statusColors }: WaiterOrderCardProps) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
          <p className="text-sm text-gray-500">
            {format(new Date(order.created_at), 'HH:mm')}
          </p>
        </div>
        <Badge 
          variant="secondary"
          className={statusColors[order.status as keyof typeof statusColors]}
        >
          {order.status}
        </Badge>
      </div>

      <div className="space-y-2">
        {order.order_items?.map((item: any) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.quantity}x</span>
              <span>{item.product?.title}</span>
            </div>
            {item.notes && (
              <span className="text-sm text-gray-500">Note: {item.notes}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        {order.status === 'pending' && (
          <Button
            onClick={() => onUpdateStatus(order.id, 'confirmed')}
            className="flex-1"
            variant="outline"
          >
            <Send className="w-4 h-4 mr-2" />
            Send to Kitchen
          </Button>
        )}
        {order.status === 'ready' && (
          <Button
            onClick={() => onUpdateStatus(order.id, 'delivered')}
            className="flex-1"
            variant="outline"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark Delivered
          </Button>
        )}
      </div>
    </div>
  );
};