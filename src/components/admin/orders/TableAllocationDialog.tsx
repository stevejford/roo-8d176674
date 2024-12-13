import React from 'react';
import { Dialog } from "@/components/ui/dialog";
import { DineInOrderDialog } from './table/DineInOrderDialog';

interface Table {
  table_number: string;
  status: 'available' | 'occupied' | 'reserved';
  customer_name?: string;
  order_id?: string;
}

interface TableAllocationDialogProps {
  table: Table;
  onClose: () => void;
  onSuccess: () => void;
}

export const TableAllocationDialog = ({ table, onClose, onSuccess }: TableAllocationDialogProps) => {
  return (
    <DineInOrderDialog
      table={table}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};