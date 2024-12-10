import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export const SalesTrendsTab = () => {
  const { data: salesData, isLoading } = useQuery({
    queryKey: ['sales-trends'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(startOfDay(new Date()), 30);
      
      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total_amount')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .lte('created_at', endOfDay(new Date()).toISOString())
        .eq('status', 'completed');

      if (error) throw error;

      // Group by day
      const dailySales = data.reduce((acc: any, order) => {
        const day = format(new Date(order.created_at), 'MMM dd');
        acc[day] = (acc[day] || 0) + (order.total_amount || 0);
        return acc;
      }, {});

      return Object.entries(dailySales).map(([date, amount]) => ({
        date,
        amount,
      }));
    },
  });

  if (isLoading) {
    return <div>Loading sales data...</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Daily Sales Trend (Last 30 Days)</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Sales ($)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};