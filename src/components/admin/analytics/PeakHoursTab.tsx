import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export const PeakHoursTab = () => {
  const { data: hourlyData, isLoading } = useQuery({
    queryKey: ['peak-hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('created_at')
        .eq('status', 'completed');

      if (error) throw error;

      // Group by hour
      const hourlyOrders = data.reduce((acc: any, order) => {
        const hour = format(new Date(order.created_at), 'HH:00');
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(hourlyOrders).map(([hour, count]) => ({
        hour,
        orders: count,
      })).sort((a, b) => a.hour.localeCompare(b.hour));
    },
  });

  if (isLoading) {
    return <div>Loading peak hours data...</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Orders by Hour</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#82ca9d" name="Number of Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};