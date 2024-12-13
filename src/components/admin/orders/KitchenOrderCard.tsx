import { format, differenceInMinutes } from 'date-fns';
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from '@/integrations/supabase/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type OrderStatus = Database['public']['Enums']['order_status'];

interface KitchenOrderCardProps {
  order: any;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  statusColors: Record<string, string>;
}

export const KitchenOrderCard = ({ order, onUpdateStatus, statusColors }: KitchenOrderCardProps) => {
  const getWaitTime = () => {
    const waitTime = differenceInMinutes(new Date(), new Date(order.created_at));
    return waitTime;
  };

  const getUrgencyIndicator = () => {
    const waitTime = getWaitTime();
    if (waitTime >= 30) return { color: 'text-red-500', urgent: true };
    if (waitTime >= 20) return { color: 'text-yellow-500', urgent: false };
    return { color: 'text-green-500', urgent: false };
  };

  const urgency = getUrgencyIndicator();

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className={`h-4 w-4 ${urgency.color}`} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Wait time: {getWaitTime()} minutes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {format(new Date(order.created_at), 'HH:mm')}
          </div>
          {order.table_number && (
            <p className="text-sm font-medium mt-1">Table {order.table_number}</p>
          )}
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
        {order.status === 'confirmed' && (
          <Button
            onClick={() => onUpdateStatus(order.id, 'preparing')}
            className="flex-1"
            variant="outline"
          >
            <Clock className="w-4 h-4 mr-2" />
            Start Preparing
          </Button>
        )}
        {order.status === 'preparing' && (
          <>
            <Button
              onClick={() => onUpdateStatus(order.id, 'ready')}
              className="flex-1"
              variant="outline"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Ready
            </Button>
            <Button
              onClick={() => onUpdateStatus(order.id, 'cancelled')}
              variant="destructive"
              size="icon"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};