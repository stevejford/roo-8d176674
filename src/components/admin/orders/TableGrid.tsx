import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface Table {
  table_number: string;
  status: 'available' | 'occupied' | 'reserved';
  customer_name?: string;
  order_id?: string;
}

export const TableGrid = () => {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = React.useState<Table | null>(null);
  const [customerName, setCustomerName] = React.useState('');
  const { toast } = useToast();

  // Add console logs to track data fetching
  console.log('Fetching table data...');

  const { data: tables, refetch } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      console.log('Executing table query...');
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .not('table_number', 'is', null)
        .order('created_at', { ascending: false });

      console.log('Orders fetched:', orders);

      // Create a map of tables with their current status
      const tableMap: Record<string, Table> = {};
      for (let i = 1; i <= 12; i++) {
        const tableNumber = i.toString();
        const activeOrder = orders?.find(o => 
          o.table_number === tableNumber && 
          ['pending', 'confirmed', 'preparing'].includes(o.status)
        );
        
        tableMap[tableNumber] = {
          table_number: tableNumber,
          status: activeOrder ? 'occupied' : 'available',
          customer_name: activeOrder?.customer_name,
          order_id: activeOrder?.id
        };
      }
      
      console.log('Processed table map:', tableMap);
      return tableMap;
    }
  });

  const allocateTable = async (tableNumber: string) => {
    if (!customerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a customer name",
        variant: "destructive",
      });
      return;
    }

    console.log('Creating new order for table:', tableNumber);

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          table_number: tableNumber,
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
      description: `Table ${tableNumber} allocated to ${customerName}`,
    });
    
    setCustomerName('');
    setSelectedTable(null);
    refetch();
  };

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

  if (!tables) return null;

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
      {Object.values(tables).map((table) => (
        <Dialog key={table.table_number}>
          <DialogTrigger asChild>
            <Button
              variant={table.status === 'available' ? 'outline' : 'default'}
              className={`h-32 w-full ${getTableStatusColor(table.status)}`}
              onClick={() => setSelectedTable(table)}
            >
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold">Table {table.table_number}</div>
                {table.status === 'occupied' ? (
                  <>
                    <Users className="mx-auto h-6 w-6" />
                    <div className="text-sm">{table.customer_name}</div>
                    <Badge variant="secondary" className="bg-white/20">
                      Occupied
                    </Badge>
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
                  onClick={() => allocateTable(table.table_number)}
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
        </Dialog>
      ))}
    </div>
  );
};