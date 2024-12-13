import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TableGrid } from '../orders/TableGrid';
import { TakeoutOrderDialog } from '../orders/takeout/TakeoutOrderDialog';
import { PhoneOrderDialog } from '../orders/phone/PhoneOrderDialog';
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export const POSDashboard = () => {
  const [showTakeoutDialog, setShowTakeoutDialog] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const navigate = useNavigate();

  const handleOrderSuccess = () => {
    navigate('/admin/waiter/menu');
  };

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="tables">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="m-0">
            <div className="flex gap-2">
              <Button onClick={() => setTakeoutDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Takeout Order
              </Button>
              <Button onClick={() => setPhoneDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Phone Order
              </Button>
            </div>
          </TabsContent>
        </div>

        <TabsContent value="tables" className="mt-0">
          <TableGrid />
        </TabsContent>

        <TabsContent value="orders">
          {/* Order list component will go here */}
        </TabsContent>
      </Tabs>

      <Dialog open={showTakeoutDialog} onOpenChange={setShowTakeoutDialog}>
        <TakeoutOrderDialog
          onClose={() => setShowTakeoutDialog(false)}
          onSuccess={handleOrderSuccess}
        />
      </Dialog>

      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <PhoneOrderDialog
          onClose={() => setShowPhoneDialog(false)}
          onSuccess={handleOrderSuccess}
        />
      </Dialog>
    </div>
  );
};
