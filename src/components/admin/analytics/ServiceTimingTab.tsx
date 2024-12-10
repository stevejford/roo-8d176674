import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ServiceTimingTab = () => {
  const { data: timingData, isLoading } = useQuery({
    queryKey: ['service-timing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .not('food_ready_at', 'is', null)
        .not('food_delivered_at', 'is', null);

      if (error) throw error;

      // Calculate average preparation and service times
      const timings = data.map(order => {
        const prepTime = new Date(order.food_ready_at!).getTime() - new Date(order.created_at).getTime();
        const serviceTime = new Date(order.food_delivered_at!).getTime() - new Date(order.food_ready_at!).getTime();
        
        return {
          orderId: order.id,
          prepTimeMinutes: Math.round(prepTime / (1000 * 60)),
          serviceTimeMinutes: Math.round(serviceTime / (1000 * 60)),
        };
      });

      return timings;
    },
  });

  if (isLoading) {
    return <div>Loading service timing data...</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Service Timing Analysis</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="orderId" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="prepTimeMinutes" stroke="#8884d8" name="Prep Time (min)" />
            <Line type="monotone" dataKey="serviceTimeMinutes" stroke="#82ca9d" name="Service Time (min)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};