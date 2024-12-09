import React from 'react';
import { Plus, Users, ClipboardList, CheckCircle } from "lucide-react";
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
        className={`relative min-h-[16rem] w-full transition-all duration-300 hover:shadow-lg ${getTableStatusColor(table.status)}`}
        onClick={onSelect}
      >
        <div className="absolute top-4 left-4">
          <div className="text-3xl font-bold mb-1">Table {table.table_number}</div>
          <Badge 
            variant="secondary"
            className={`px-4 py-1.5 text-sm font-medium ${
              table.status === 'available' 
                ? 'bg-gray-100 text-gray-900' 
                : 'bg-white/20 text-white'
            }`}
          >
            {table.status === 'available' ? 'Available' : table.order_status || 'Occupied'}
          </Badge>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full space-y-6 p-8">
          {table.status === 'occupied' ? (
            <>
              <Users className="h-12 w-12 opacity-90" />
              {table.customer_name && (
                <div className="text-lg font-medium opacity-90">
                  {table.customer_name}
                </div>
              )}
              {table.order_id && onViewOrder && (
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-4 bg-white/20 hover:bg-white/30 text-white font-medium px-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewOrder(table.order_id!);
                  }}
                >
                  <ClipboardList className="w-5 h-5 mr-2" />
                  View Order
                </Button>
              )}
            </>
          ) : (
            <>
              <Plus className="h-12 w-12" />
              <span className="text-lg">Tap to add order</span>
            </>
          )}
        </div>
      </Button>
    </DialogTrigger>
  );
};