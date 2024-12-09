import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MenuBrowser } from '../MenuBrowser';

interface MenuBrowserDialogProps {
  onSelectItem: (product: any) => Promise<void>;
}

export const MenuBrowserDialog = ({ onSelectItem }: MenuBrowserDialogProps) => {
  return (
    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Items to Order</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <MenuBrowser onSelectItem={onSelectItem} />
      </div>
    </DialogContent>
  );
};