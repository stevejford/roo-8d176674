import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";

interface TableOrderActionsProps {
  orderId: string;
  onAddItem: (product: any) => Promise<void>;
}

export const TableOrderActions = ({ orderId, onAddItem }: TableOrderActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4">
      <Button 
        className="flex-1"
        onClick={() => {
          navigate(`/admin/waiter/order/${orderId}`);
        }}
      >
        View Order Details
      </Button>
      <Button onClick={() => navigate('/admin/waiter/menu')}>
        <Plus className="mr-2 h-4 w-4" />
        Add Items
      </Button>
    </div>
  );
};