import { useState } from 'react';
import { Plus, Users, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableStatusBadge } from './table/TableStatusBadge';
import { TableManagementButtons } from './table/TableManagementButtons';
import { TableEditForm } from './table/TableEditForm';

interface TableCardProps {
  table: {
    id: string;
    table_number: string;
    status: 'available' | 'occupied' | 'reserved';
    customer_name?: string;
    order_id?: string;
    order_status?: string;
  };
  onClick: () => void;
  onSelect?: () => void;
  onViewOrder?: (orderId: string) => void;
  onDelete?: () => void;
}

export const TableCard = ({ table, onClick, onViewOrder, onDelete }: TableCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative p-2">
      <Dialog>
        <DialogTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`relative h-[12rem] w-full transition-all duration-300 hover:shadow-lg ${
              table.status === 'available' 
                ? 'border rounded-md border-input bg-background hover:bg-accent hover:text-accent-foreground' 
                : `text-white bg-${table.status === 'occupied' ? 'green' : 'yellow'}-600 hover:bg-${table.status === 'occupied' ? 'green' : 'yellow'}-700`
            }`}
            onClick={onClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick();
              }
            }}
          >
            <div className="flex flex-col h-full p-4">
              {/* Header section */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-col items-start">
                  {isEditing ? (
                    <TableEditForm
                      tableId={table.id}
                      initialTableNumber={table.table_number}
                      onSuccess={() => setIsEditing(false)}
                    />
                  ) : (
                    <h3 className="text-xl font-bold mb-1">Table {table.table_number}</h3>
                  )}
                  <TableStatusBadge status={table.status} orderStatus={table.order_status} />
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
      </Dialog>
      
      {/* Table management buttons */}
      {!isEditing && (
        <TableManagementButtons
          onEdit={() => setIsEditing(true)}
          onDelete={() => onDelete?.()}
        />
      )}
    </div>
  );
};