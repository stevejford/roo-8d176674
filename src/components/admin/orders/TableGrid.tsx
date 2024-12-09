import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from "@/components/ui/dialog";
import { TableCard } from './TableCard';
import { TableAllocationDialog } from './TableAllocationDialog';
import { TableManagementDialogs } from './TableManagementDialogs';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTableManagement } from '@/hooks/useTableManagement';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export const TableGrid = () => {
  const [selectedTable, setSelectedTable] = React.useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [newTableNumber, setNewTableNumber] = React.useState('');
  const navigate = useNavigate();
  
  const { tables, addTable, updateTable, refetch, updateTablePositions } = useTableManagement();

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

  const handleDragEnd = (result: any) => {
    if (!result.destination || !tables) return;

    const items = Array.from(Object.values(tables));
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Create updates array with new positions while preserving table data
    const updates = items.map((table: any, index: number) => ({
      id: table.id,
      table_number: table.table_number,
      position: index + 1,
      status: table.status
    }));

    // Update positions in the database
    updateTablePositions(updates);
  };

  if (!tables) return null;

  const sortedTables = Object.values(tables).sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tables</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tables" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {sortedTables.map((table, index) => (
                <Draggable 
                  key={table.id} 
                  draggableId={table.id} 
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Dialog>
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
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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