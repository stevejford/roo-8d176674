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
        <div
          role="button"
          tabIndex={0}
          className={`relative h-[12rem] w-full transition-all duration-300 hover:shadow-lg ${
            table.status === 'available' 
              ? 'border rounded-md border-input bg-background hover:bg-accent hover:text-accent-foreground' 
              : `text-white ${getTableStatusColor(table.status)}`
          }`}
          onClick={onSelect}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelect();
            }
          }}
        >
          <div className="flex flex-col h-full p-4">
            {/* Header section */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col items-start">
                <h3 className="text-xl font-bold mb-1">Table {table.table_number}</h3>
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
            </div>

            {/* Content section */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {table.status === 'occupied' ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 opacity-90" />
                    {table.customer_name && (
                      <span className="text-lg font-medium opacity-90">
                        {table.customer_name}
                      </span>
                    )}
                  </div>
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
                  <Plus className="h-8 w-8 mb-2" />
                  <span className="text-base">Tap to add order</span>
                </>
              )}
            </div>
          </div>
        </div>
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