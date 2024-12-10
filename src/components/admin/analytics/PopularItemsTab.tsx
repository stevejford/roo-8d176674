import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const PopularItemsTab = () => {
  const { data: popularItems, isLoading } = useQuery({
    queryKey: ['popular-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          quantity,
          product:products (
            title
          )
        `);

      if (error) throw error;

      // Group by product
      const itemCounts = data.reduce((acc: any, item) => {
        const title = item.product?.title || 'Unknown';
        acc[title] = (acc[title] || 0) + (item.quantity || 0);
        return acc;
      }, {});

      return Object.entries(itemCounts)
        .map(([title, count]) => ({
          title,
          count,
        }))
        .sort((a, b) => (b.count as number) - (a.count as number))
        .slice(0, 10); // Top 10 items
    },
  });

  if (isLoading) {
    return <div>Loading popular items data...</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Top 10 Popular Items</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={popularItems} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="title" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};