import React from 'react';
import { MenuBrowser } from '../MenuBrowser';

interface MenuBrowserDialogProps {
  onSelectItem: (product: any) => Promise<void>;
}

export const MenuBrowserDialog = ({ onSelectItem }: MenuBrowserDialogProps) => {
  return (
    <div className="h-screen">
      <MenuBrowser 
        onSelect={onSelectItem}
      />
    </div>
  );
};