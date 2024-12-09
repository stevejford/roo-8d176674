import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TableManagementDialogsProps {
  showAddDialog: boolean;  // Add this line
  onCloseAddDialog: () => void;  // Add this line
  isAddDialogOpen?: boolean;
  setIsAddDialogOpen?: (open: boolean) => void;
  isDeleteDialogOpen?: boolean;
  setIsDeleteDialogOpen?: (open: boolean) => void;
  selectedTable?: any;
  setSelectedTable?: (table: any) => void;
  newTableNumber?: string;
  setNewTableNumber?: (number: string) => void;
  handleAddTable?: () => void;
}

export const TableManagementDialogs: React.FC<TableManagementDialogsProps> = ({
  showAddDialog,
  onCloseAddDialog,
  isAddDialogOpen,
  setIsAddDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedTable,
  setSelectedTable,
  newTableNumber,
  setNewTableNumber,
  handleAddTable,
}) => {
  return (
    <>
      {/* Add Table Dialog */}
      <Dialog open={showAddDialog} onOpenChange={onCloseAddDialog}>
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
              onChange={(e) => setNewTableNumber?.(e.target.value)}
              placeholder="Table number"
              className="col-span-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onCloseAddDialog()}>Cancel</Button>
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
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen?.(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              setIsDeleteDialogOpen?.(false);
              setSelectedTable?.(null);
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};