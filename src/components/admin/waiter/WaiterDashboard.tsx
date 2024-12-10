import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TablePhase } from './phases/TablePhase';
import { OrderPhase } from './phases/OrderPhase';
import { ServicePhase } from './phases/ServicePhase';
import { PaymentPhase } from './phases/PaymentPhase';

export const WaiterDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="service">Service</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables">
          <TablePhase />
        </TabsContent>
        
        <TabsContent value="orders">
          <OrderPhase />
        </TabsContent>
        
        <TabsContent value="service">
          <ServicePhase />
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentPhase />
        </TabsContent>
      </Tabs>
    </div>
  );
};