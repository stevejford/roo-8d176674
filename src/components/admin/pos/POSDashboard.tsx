import React, { useState } from 'react';
import { POSMenuBrowser } from './POSMenuBrowser';
import { OrderDashboard } from './components/OrderDashboard';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const POSDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Active Orders</h2>
        <Button onClick={() => {
          setSelectedOrderId(null);
          setIsMenuOpen(true);
        }} className="bg-[#10B981]">
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>
      
      <OrderDashboard 
        onAddItems={(orderId) => {
          setSelectedOrderId(orderId);
          setIsMenuOpen(true);
        }}
      />
      
      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DialogContent className="max-w-7xl h-[90vh]">
          <POSMenuBrowser 
            orderId={selectedOrderId}
            onOrderComplete={() => setIsMenuOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};