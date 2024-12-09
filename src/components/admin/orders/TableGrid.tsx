import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { TableCard } from './TableCard';
import { TableAllocationDialog } from './TableAllocationDialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useTableManagement } from '@/hooks/useTableManagement';

export const TableGrid = () => {
  const [selectedTable, setSelectedTable] = React.useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [newTableNumber, setNewTableNumber] = React.useState('');
  const navigate = useNavigate();
  
  const { tables, addTable, refetch } = useTableManagement();

  const handleViewOrder = (orderId: string) => {
    navigate(`/admin/waiter/order/${orderId}`);
  };

  const handleAddTable = async () => {
    const success = await addTable(newTableNumber);
    if (success) {
      setIsAddDialogOpen(false);
      setNewTableNumber('');
    }
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
              className="col-span-2"
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
            <Button variant="destructive" onClick={async () => {
              // For now, we'll just close the dialog as delete functionality will be implemented later
              setIsDeleteDialogOpen(false);
              setSelectedTable(null);
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
