import React, { useState } from 'react';
import { POSMenuBrowser } from './POSMenuBrowser';
import { OrderDashboard } from './components/OrderDashboard';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const POSDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <OrderDashboard />
      
      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DialogContent className="max-w-7xl h-[90vh]">
          <POSMenuBrowser onOrderComplete={() => setIsMenuOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};