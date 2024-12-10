import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const TableTurnoverTab = () => {
  const { data: turnoverData, isLoading } = useQuery({
    queryKey: ['table-turnover'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('table_number, created_at, updated_at')
        .not('table_number', 'is', null)
        .eq('status', 'completed');

      if (error) throw error;

      // Calculate turnover by table
      const tableTurnover = data.reduce((acc: any, order) => {
        const tableNumber = order.table_number;
        if (!acc[tableNumber]) {
          acc[tableNumber] = {
            table: tableNumber,
            orders: 0,
            avgTimeMinutes: 0,
          };
        }
        
        const duration = new Date(order.updated_at).getTime() - new Date(order.created_at).getTime();
        const durationMinutes = duration / (1000 * 60);
        
        acc[tableNumber].orders += 1;
        acc[tableNumber].avgTimeMinutes = 
          (acc[tableNumber].avgTimeMinutes * (acc[tableNumber].orders - 1) + durationMinutes) / 
          acc[tableNumber].orders;
        
        return acc;
      }, {});

      return Object.values(tableTurnover);
    },
  });

  if (isLoading) {
    return <div>Loading table turnover data...</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Table Turnover Analysis</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={turnoverData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="table" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="Total Orders" />
            <Bar yAxisId="right" dataKey="avgTimeMinutes" fill="#82ca9d" name="Avg Time (min)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};