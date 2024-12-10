import React, { useState } from 'react';
import { TableCard } from '@/components/TableCard';
import { MenuBrowser } from '@/components/admin/orders/MenuBrowser';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const WaiterDashboard = () => {
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const { data: tables, refetch } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tables')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleTableClick = (table: any) => {
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
        {tables?.map((table) => (
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