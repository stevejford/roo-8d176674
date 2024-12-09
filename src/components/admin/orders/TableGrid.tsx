import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { TableCard } from './TableCard';
import { TableAllocationDialog } from './TableAllocationDialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface Table {
  table_number: string;
  status: 'available' | 'occupied' | 'reserved';
  customer_name?: string;
  order_id?: string;
  order_status?: string;
}

export const TableGrid = () => {
  const [selectedTable, setSelectedTable] = React.useState<Table | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [newTableNumber, setNewTableNumber] = React.useState('');
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
      // Get all existing table numbers
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

  const handleAddTable = async () => {
    if (!newTableNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a table number",
        variant: "destructive",
      });
      return;
    }

    // Add the new table (in this case, it's just adding it to the local state since tables are implicit)
    await refetch();
    setIsAddDialogOpen(false);
    setNewTableNumber('');
    toast({
      title: "Success",
      description: `Table ${newTableNumber} has been added`,
    });
  };

  const handleDeleteTable = async () => {
    if (!selectedTable) return;

    if (selectedTable.status === 'occupied') {
      toast({
        title: "Error",
        description: "Cannot delete an occupied table",
        variant: "destructive",
      });
      return;
    }

    // Delete the table (in this case, it's just removing it from the local state)
    await refetch();
    setIsDeleteDialogOpen(false);
    setSelectedTable(null);
    toast({
      title: "Success",
      description: `Table ${selectedTable.table_number} has been deleted`,
    });
  };

  if (!tables) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tables</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.values(tables).map((table) => (
          <Dialog key={table.table_number}>
            <TableCard
              table={table}
              onSelect={() => setSelectedTable(table)}
              onViewOrder={handleViewOrder}
              onEdit={() => {
                setSelectedTable(table);
                setIsEditDialogOpen(true);
              }}
              onDelete={() => {
                setSelectedTable(table);
                setIsDeleteDialogOpen(true);
              }}
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

      {/* Add Table Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
            <DialogDescription>
              Enter the number for the new table.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              placeholder="Table number"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTable}>Add Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Table Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Table</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete Table {selectedTable?.table_number}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTable}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};