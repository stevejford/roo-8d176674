import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TableStatusOverview = () => {
  const { data: tableStats } = useQuery({
    queryKey: ['table-stats'],
    queryFn: async () => {
      const { data: tables, error } = await supabase
        .from('tables')
        .select('status');

      if (error) throw error;

      const stats = {
        total: tables.length,
        available: tables.filter(t => t.status === 'available').length,
        occupied: tables.filter(t => t.status === 'occupied').length,
        reserved: tables.filter(t => t.status === 'reserved').length,
      };

      return stats;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tableStats?.total || 0}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Available</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{tableStats?.available || 0}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Occupied</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{tableStats?.occupied || 0}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Reserved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{tableStats?.reserved || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
};