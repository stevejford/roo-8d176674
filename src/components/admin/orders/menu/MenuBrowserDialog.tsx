import React from 'react';
import { MenuBrowser } from '../MenuBrowser';

interface MenuBrowserDialogProps {
  onSelectItem: (product: any) => Promise<void>;
}

export const MenuBrowserDialog = ({ onSelectItem }: MenuBrowserDialogProps) => {
  return (
    <div className="fixed inset-0 bg-white">
      <MenuBrowser 
        onOrderComplete={() => onSelectItem}
        selectedTable={null}
      />
    </div>
  );
};