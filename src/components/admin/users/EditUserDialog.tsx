import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: Profile;
  onSave: (updates: Partial<Profile>) => void;
}

export const EditUserDialog = ({ 
  isOpen, 
  onClose, 
  user, 
  onSave 
}: EditUserDialogProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      phone: formData.get('phone') as string,
    };
    onSave(updates);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="text-sm font-medium">
              First Name
            </label>
            <Input
              id="first_name"
              name="first_name"
              defaultValue={user.first_name || ''}
            />
          </div>
          <div>
            <label htmlFor="last_name" className="text-sm font-medium">
              Last Name
            </label>
            <Input
              id="last_name"
              name="last_name"
              defaultValue={user.last_name || ''}
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <Input
              id="phone"
              name="phone"
              defaultValue={user.phone || ''}
            />
          </div>
          <Button type="submit">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};