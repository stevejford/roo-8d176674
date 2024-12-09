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
  
  const { tables, addTable, updateTable, updateTablePositions, refetch } = useTableManagement();

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

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const tableArray = Object.values(tables);
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Create a new array with the updated positions
    const reorderedTables = [...tableArray];
    const [movedTable] = reorderedTables.splice(sourceIndex, 1);
    reorderedTables.splice(destinationIndex, 0, movedTable);

    // Update positions in the database using the table IDs in their new order
    const tableIds = reorderedTables.map(table => table.id);
    await updateTablePositions(tableIds);
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tables" direction="horizontal">
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {tableArray.map((table, index) => (
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