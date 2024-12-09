import React from 'react';
import { Plus, Users, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DialogTrigger } from "@/components/ui/dialog";

interface TableCardProps {
  table: {
    table_number: string;
    status: 'available' | 'occupied' | 'reserved';
    customer_name?: string;
    order_id?: string;
    order_status?: string;
  };
  onSelect: () => void;
  onViewOrder?: (orderId: string) => void;
}

export const TableCard = ({ table, onSelect, onViewOrder }: TableCardProps) => {
  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-green-600 hover:bg-green-700';
      case 'reserved':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return '';
    }
  };

  return (
    <DialogTrigger asChild>
      <Button
        variant={table.status === 'available' ? 'outline' : 'default'}
        className={`h-32 w-full ${getTableStatusColor(table.status)}`}
        onClick={onSelect}
      >
        <div className="text-center space-y-2">
          <div className="text-lg font-semibold">Table {table.table_number}</div>
          {table.status === 'occupied' ? (
            <>
              <Users className="mx-auto h-6 w-6" />
              <div className="text-sm">{table.customer_name}</div>
              <Badge variant="secondary" className="bg-white/20">
                {table.order_status || 'Occupied'}
              </Badge>
              {table.order_id && onViewOrder && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewOrder(table.order_id!);
                  }}
                >
                  <ClipboardList className="w-4 h-4 mr-1" />
                  View Order
                </Button>
              )}
            </>
          ) : (
            <>
              <Plus className="mx-auto h-6 w-6" />
              <Badge variant="secondary">
                Available
              </Badge>
            </>
          )}
        </div>
      </Button>
    </DialogTrigger>
  );
};