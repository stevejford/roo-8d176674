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
        className={`min-h-[10rem] w-full transition-all duration-300 hover:shadow-lg ${getTableStatusColor(table.status)}`}
        onClick={onSelect}
      >
        <div className="flex flex-col items-center justify-center w-full space-y-3 p-4">
          <div className="text-xl font-semibold mb-1">Table {table.table_number}</div>
          {table.status === 'occupied' ? (
            <>
              <Users className="h-7 w-7 mb-2 opacity-90" />
              {table.customer_name && (
                <div className="text-sm font-medium opacity-90">
                  {table.customer_name}
                </div>
              )}
              <Badge 
                variant="secondary" 
                className="bg-white/20 text-white font-medium px-3 py-1"
              >
                {table.order_status || 'Occupied'}
              </Badge>
              {table.order_id && onViewOrder && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-2 bg-white/20 hover:bg-white/30 text-white font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewOrder(table.order_id!);
                  }}
                >
                  <ClipboardList className="w-4 h-4 mr-2" />
                  View Order
                </Button>
              )}
            </>
          ) : (
            <>
              <Plus className="h-7 w-7 mb-2" />
              <Badge 
                variant="secondary"
                className="px-3 py-1 font-medium"
              >
                Available
              </Badge>
            </>
          )}
        </div>
      </Button>
    </DialogTrigger>
  );
};