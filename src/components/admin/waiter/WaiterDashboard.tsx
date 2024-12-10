import React, { useState } from 'react';
import { TableCard } from '@/components/TableCard';
import { MenuBrowser } from '@/components/admin/orders/MenuBrowser';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Table {
  id: string;
  table_number: string;
  status: 'available' | 'occupied' | 'reserved';
  customer_name?: string;
  order_id?: string;
  order_status?: string;
}

export const WaiterDashboard = () => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const { data: tables = [], refetch } = useQuery<Table[]>({
    queryKey: ['tables'],
    queryFn: async () => {
      // First, get all tables
      const { data: tablesData, error: tablesError } = await supabase
        .from('tables')
        .select('*');
      
      if (tablesError) {
        console.error('Error fetching tables:', tablesError);
        throw tablesError;
      }
      
      if (!tablesData) {
        return [];
      }

      // Then, get active orders to determine table status and customer info
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .not('table_number', 'is', null)
        .in('status', ['pending', 'confirmed', 'preparing', 'ready', 'delivered'])
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
      }

      // Transform the data to include customer information
      return tablesData.map((table): Table => {
        const activeOrder = orders?.find(o => o.table_number === table.table_number);
        return {
          id: table.id,
          table_number: table.table_number,
          status: activeOrder ? 'occupied' : 'available',
          customer_name: activeOrder?.customer_name,
          order_id: activeOrder?.id,
          order_status: activeOrder?.status,
        };
      });
    },
    initialData: [] // Provide initial empty array
  });

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setIsMenuOpen(true);
  };

  const handleOrderComplete = () => {
    setIsMenuOpen(false);
    setSelectedTable(null);
    refetch();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Tables</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.isArray(tables) && tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => handleTableClick(table)}
          />
        ))}
      </div>

      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <div className="p-6 flex-1 overflow-auto">
            <MenuBrowser
              onOrderComplete={handleOrderComplete}
              selectedTable={selectedTable}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};