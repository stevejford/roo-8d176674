import React from 'react';
import { Badge } from "@/components/ui/badge";

interface OrderHeaderProps {
  orderId: string;
  status: string;
  statusColors: Record<string, string>;
}

export const OrderHeader = ({ orderId, status, statusColors }: OrderHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-bold">Order #{orderId.slice(0, 8)}</h3>
      <Badge 
        variant="secondary"
        className={`${statusColors[status]} px-4 py-1.5`}
      >
        {status}
      </Badge>
    </div>
  );
};