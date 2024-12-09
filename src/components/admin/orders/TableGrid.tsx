import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Dialog } from "@/components/ui/dialog";
import { TableCard } from './TableCard';
import { TableAllocationDialog } from './TableAllocationDialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface Table {
  table_number: string;
  status: 'available' | 'occupied' | 'reserved';
  customer_name?: string;
  order_id?: string;
  order_status?: string;
}

export const TableGrid = () => {
  const [selectedTable, setSelectedTable] = React.useState<Table | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      for (let i = 1; i <= 12; i++) {
        const tableNumber = i.toString();
        const activeOrder = orders?.find(o => 
          o.table_number === tableNumber
        );
        
        tableMap[tableNumber] = {
          table_number: tableNumber,
          status: activeOrder ? 'occupied' : 'available',
          customer_name: activeOrder?.customer_name,
          order_id: activeOrder?.id,
          order_status: activeOrder?.status
        };
      }
      
      return tableMap;
    }
  });

  React.useEffect(() => {
    const ordersSubscription = supabase
      .channel('table-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new.status === 'completed') {
            toast({
              title: "Table Available",
              description: `Table ${payload.new.table_number} is now available`,
            });
          }
          refetch();
        }
      )
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
    };
  }, [refetch, toast]);

  const handleViewOrder = (orderId: string) => {
    navigate(`/admin/waiter/order/${orderId}`);
  };

  if (!tables) return null;

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {Object.values(tables).map((table) => (
          <Dialog key={table.table_number}>
            <TableCard
              table={table}
              onSelect={() => setSelectedTable(table)}
              onViewOrder={handleViewOrder}
            />
            {selectedTable && (
              <TableAllocationDialog
                table={selectedTable}
                onClose={() => setSelectedTable(null)}
                onSuccess={refetch}
              />
            )}
          </Dialog>
        ))}
      </div>
    </div>
  );
};