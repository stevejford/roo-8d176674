import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TableManagementDialogsProps {
  showAddDialog: boolean;
  onCloseAddDialog: () => void;
  isDeleteDialogOpen?: boolean;
  setIsDeleteDialogOpen?: (open: boolean) => void;
  selectedTable?: any;
  setSelectedTable?: (table: any) => void;
}

export const TableManagementDialogs: React.FC<TableManagementDialogsProps> = ({
  showAddDialog,
  onCloseAddDialog,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedTable,
  setSelectedTable,
}) => {
  const [newTableNumber, setNewTableNumber] = useState('');
  const { toast } = useToast();

  const handleAddTable = async () => {
    if (!newTableNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a table number",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('tables')
        .insert([{ table_number: newTableNumber }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Table ${newTableNumber} has been added`,
      });
      
      setNewTableNumber('');
      onCloseAddDialog();
    } catch (error) {
      console.error('Error adding table:', error);
      toast({
        title: "Error",
        description: "Failed to add table",
        variant: "destructive",
      });
    }
  };

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
              onChange={(e) => setNewTableNumber(e.target.value)}
              placeholder="Table number"
              className="col-span-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseAddDialog}>Cancel</Button>
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