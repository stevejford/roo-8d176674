import React from 'react';
import { TableGrid } from '@/components/TableGrid';
import { MenuBrowser } from '@/components/admin/orders/MenuBrowser';
import { useTableManagement } from '@/hooks/useTableManagement';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const WaiterDashboard = () => {
  const [selectedTable, setSelectedTable] = React.useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { tables, refetch } = useTableManagement();
  const { toast } = useToast();

  const handleTableClick = (table: any) => {
    if (table.status === 'occupied') {
      toast({
        title: "Table is occupied",
        description: "This table already has an active order.",
      });
      return;
    }
    setSelectedTable(table);
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    setSelectedTable(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Tables</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.values(tables || {}).map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => handleTableClick(table)}
          />
        ))}
      </div>

      <Dialog open={isMenuOpen} onOpenChange={handleMenuClose}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <div className="p-6 flex-1 overflow-auto">
            <MenuBrowser
              onOrderComplete={() => {
                handleMenuClose();
                refetch();
              }}
              selectedTable={selectedTable}
            />
          </div>
          <div className="p-4 border-t">
            <Button variant="outline" onClick={handleMenuClose}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};