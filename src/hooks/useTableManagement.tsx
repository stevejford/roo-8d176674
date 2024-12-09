import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Table {
  table_number: string;
  status: 'available' | 'occupied' | 'reserved';
  customer_name?: string;
  order_id?: string;
  order_status?: string;
}

export const useTableManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tables, refetch } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .not('table_number', 'is', null)
        .in('status', ['pending', 'confirmed', 'preparing', 'ready', 'delivered'])
        .order('created_at', { ascending: false });

      const tableMap: Record<string, Table> = {};
      
      // First, get all existing tables from orders
      const existingTables = Array.from(new Set(orders?.map(o => o.table_number) || []));
      
      // Create table entries for all tables
      existingTables.forEach(tableNumber => {
        const activeOrder = orders?.find(o => o.table_number === tableNumber);
        tableMap[tableNumber] = {
          table_number: tableNumber,
          status: activeOrder ? 'occupied' : 'available',
          customer_name: activeOrder?.customer_name,
          order_id: activeOrder?.id,
          order_status: activeOrder?.status
        };
      });

      return tableMap;
    }
  });

  const addTable = async (tableNumber: string) => {
    if (!tableNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a table number",
        variant: "destructive",
      });
      return false;
    }

    // Check if table already exists
    if (tables && tables[tableNumber]) {
      toast({
        title: "Error",
        description: "This table number already exists",
        variant: "destructive",
      });
      return false;
    }

    // Create a dummy order to initialize the table (will be immediately completed)
    const { error } = await supabase
      .from('orders')
      .insert({
        table_number: tableNumber,
        status: 'completed',
        customer_name: 'Table Setup',
        total_amount: 0
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add table",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: `Table ${tableNumber} has been added`,
    });
    
    await refetch();
    return true;
  };

  return {
    tables,
    refetch,
    addTable
  };
};