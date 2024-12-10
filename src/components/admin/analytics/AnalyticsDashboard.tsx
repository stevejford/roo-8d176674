import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesTrendsTab } from './SalesTrendsTab';
import { PeakHoursTab } from './PeakHoursTab';
import { PopularItemsTab } from './PopularItemsTab';
import { ServiceTimingTab } from './ServiceTimingTab';
import { TableTurnoverTab } from './TableTurnoverTab';

export const AnalyticsDashboard = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Comprehensive analytics and insights for your restaurant
        </p>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Trends</TabsTrigger>
          <TabsTrigger value="peak-hours">Peak Hours</TabsTrigger>
          <TabsTrigger value="popular-items">Popular Items</TabsTrigger>
          <TabsTrigger value="service-timing">Service Timing</TabsTrigger>
          <TabsTrigger value="table-turnover">Table Turnover</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <SalesTrendsTab />
        </TabsContent>

        <TabsContent value="peak-hours" className="space-y-4">
          <PeakHoursTab />
        </TabsContent>

        <TabsContent value="popular-items" className="space-y-4">
          <PopularItemsTab />
        </TabsContent>

        <TabsContent value="service-timing" className="space-y-4">
          <ServiceTimingTab />
        </TabsContent>

        <TabsContent value="table-turnover" className="space-y-4">
          <TableTurnoverTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};