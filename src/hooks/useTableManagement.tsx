import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Table {
  id: string;
  table_number: string;
  status: 'available' | 'occupied' | 'reserved';
  customer_name?: string;
  order_id?: string;
  order_status?: string;
  position: number;
}

export const useTableManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tables, refetch } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      // First, get all tables
      const { data: tablesData, error: tablesError } = await supabase
        .from('tables')
        .select('*')
        .order('position');

      if (tablesError) throw tablesError;

      // Then, get active orders to determine table status
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .not('table_number', 'is', null)
        .in('status', ['pending', 'confirmed', 'preparing', 'ready', 'delivered'])
        .order('created_at', { ascending: false });

      const tableMap: Record<string, Table> = {};
      
      // Create table entries for all tables
      tablesData?.forEach(table => {
        const activeOrder = orders?.find(o => o.table_number === table.table_number);
        tableMap[table.table_number] = {
          id: table.id,
          table_number: table.table_number,
          status: activeOrder ? 'occupied' : 'available',
          customer_name: activeOrder?.customer_name,
          order_id: activeOrder?.id,
          order_status: activeOrder?.status,
          position: table.position
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

    // Get the current maximum position
    const { data: maxPositionData } = await supabase
      .from('tables')
      .select('position')
      .order('position', { ascending: false })
      .limit(1);

    const nextPosition = (maxPositionData?.[0]?.position || 0) + 1;

    const { error } = await supabase
      .from('tables')
      .insert({ 
        table_number: tableNumber,
        position: nextPosition
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
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

  const updateTable = async (tableId: string, newTableNumber: string) => {
    if (!newTableNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a table number",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from('tables')
      .update({ table_number: newTableNumber })
      .eq('id', tableId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    await refetch();
    return true;
  };

  const updateTablePositions = async (updates: any[]) => {
    const { error } = await supabase
      .from('tables')
      .upsert(updates, {
        onConflict: 'id'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update table positions",
        variant: "destructive",
      });
      return false;
    }

    await refetch();
    return true;
  };

  return {
    tables,
    refetch,
    addTable,
    updateTable,
    updateTablePositions
  };
};