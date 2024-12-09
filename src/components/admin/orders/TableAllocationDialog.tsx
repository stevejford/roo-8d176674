import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();
  const [customerName, setCustomerName] = React.useState('');
  const { toast } = useToast();

  const handleAllocation = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a customer name",
        variant: "destructive",
      });
      return;
    }

    console.log('Creating new order for table:', table.table_number);

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          table_number: table.table_number,
          customer_name: customerName,
          status: 'pending',
          created_by: (await supabase.auth.getUser()).data.user?.id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to allocate table",
        variant: "destructive",
      });
      return;
    }

    console.log('Order created successfully:', data);

    toast({
      title: "Success",
      description: `Table ${table.table_number} allocated to ${customerName}`,
    });
    
    setCustomerName('');
    onClose();
    onSuccess();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {table.status === 'available' 
            ? `Allocate Table ${table.table_number}`
            : `Table ${table.table_number} - ${table.customer_name}`
          }
        </DialogTitle>
      </DialogHeader>
      {table.status === 'available' ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Customer Name</label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <Button 
            className="w-full"
            onClick={handleAllocation}
          >
            Allocate Table
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Button 
            className="w-full"
            onClick={() => {
              navigate(`/admin/waiter/order/${table.order_id}`);
            }}
          >
            View/Edit Order
          </Button>
        </div>
      )}
    </DialogContent>
  );
};