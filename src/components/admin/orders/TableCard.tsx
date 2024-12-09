import React from 'react';
import { Plus, Users, ClipboardList, Pencil, Trash2 } from "lucide-react";
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
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TableCard = ({ table, onSelect, onViewOrder, onEdit, onDelete }: TableCardProps) => {
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
    <div className="relative">
      <DialogTrigger asChild>
        <Button
          variant={table.status === 'available' ? 'outline' : 'default'}
          className={`relative h-[12rem] w-full transition-all duration-300 hover:shadow-lg ${getTableStatusColor(table.status)}`}
          onClick={onSelect}
        >
          <div className="absolute top-3 left-3 text-left">
            <div className="text-2xl font-bold mb-1">Table {table.table_number}</div>
            <Badge 
              variant="secondary"
              className={`px-3 py-1 text-sm font-medium ${
                table.status === 'available' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'bg-white/20 text-white'
              }`}
            >
              {table.status === 'available' ? 'Available' : table.order_status || 'Occupied'}
            </Badge>
          </div>

          <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
            {table.status === 'occupied' ? (
              <>
                <Users className="h-8 w-8 opacity-90" />
                {table.customer_name && (
                  <div className="text-base font-medium opacity-90">
                    {table.customer_name}
                  </div>
                )}
                {table.order_id && onViewOrder && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-2 bg-white/20 hover:bg-white/30 text-white font-medium px-4"
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
                <Plus className="h-8 w-8" />
                <span className="text-base">Tap to add order</span>
              </>
            )}
          </div>
        </Button>
      </DialogTrigger>
      
      {/* Table management buttons */}
      <div className="absolute -top-2 right-2 flex space-x-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </div>
  );
};