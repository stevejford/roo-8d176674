import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from "@/components/ui/dialog";
import { TableCard } from './TableCard';
import { TableAllocationDialog } from './TableAllocationDialog';
import { TableManagementDialogs } from './TableManagementDialogs';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTableManagement } from '@/hooks/useTableManagement';

export const TableGrid = () => {
  const [selectedTable, setSelectedTable] = React.useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [newTableNumber, setNewTableNumber] = React.useState('');
  const navigate = useNavigate();
  
  const { tables, addTable, updateTable, refetch } = useTableManagement();

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

  const handleEditTable = async (table: any, newTableNumber: string) => {
    const success = await updateTable(table.id, newTableNumber);
    if (success) {
      refetch();
    }
  };

  if (!tables) return null;

  const tableArray = Object.values(tables);

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
        {tableArray.map((table) => (
          <Dialog key={table.table_number}>
            <TableCard
              table={table}
              onSelect={() => setSelectedTable(table)}
              onViewOrder={handleViewOrder}
              onEdit={(newTableNumber) => handleEditTable(table, newTableNumber)}
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

      <TableManagementDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        newTableNumber={newTableNumber}
        setNewTableNumber={setNewTableNumber}
        handleAddTable={handleAddTable}
      />
    </div>
  );
};