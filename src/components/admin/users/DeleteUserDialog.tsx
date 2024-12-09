import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onDeleted: () => void;
}

export const DeleteUserDialog = ({ 
  isOpen, 
  onClose, 
  userId, 
  userName,
  onDeleted 
}: DeleteUserDialogProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      // First delete from profiles (this will cascade to user_actions)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      toast({
        title: "User deleted",
        description: "The user has been successfully deleted",
      });
      
      onDeleted();
      onClose();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {userName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};