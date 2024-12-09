import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Dialog } from "@/components/ui/dialog";
import { TableCard } from './TableCard';
import { TableAllocationDialog } from './TableAllocationDialog';

interface Table {
  table_number: string;
  status: 'available' | 'occupied' | 'reserved';
  customer_name?: string;
  order_id?: string;
}

export const TableGrid = () => {
  const [selectedTable, setSelectedTable] = React.useState<Table | null>(null);

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

  if (!tables) return null;

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
      {Object.values(tables).map((table) => (
        <Dialog key={table.table_number}>
          <TableCard
            table={table}
            onSelect={() => setSelectedTable(table)}
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
  );
};