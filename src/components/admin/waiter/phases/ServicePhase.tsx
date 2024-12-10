import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { differenceInMinutes } from 'date-fns';

export const ServicePhase = () => {
  const { data: serviceTasks } = useQuery({
    queryKey: ['service-tasks'],
    queryFn: async () => {
      const { data: settings } = await supabase
        .from('store_settings')
        .select('service_timings')
        .single();

      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['pending', 'confirmed', 'preparing', 'ready', 'delivered'])
        .is('deleted_at', null);

      if (!orders) return [];

      const tasks = orders.flatMap(order => {
        const tasks = [];
        const now = new Date();

        // Check for drink suggestions
        if (!order.drinks_suggested_at && 
            differenceInMinutes(now, new Date(order.seated_at)) >= settings?.service_timings.suggest_drinks_minutes) {
          tasks.push({
            id: `${order.id}-drinks`,
            table: order.table_number,
            type: 'suggest_drinks',
            priority: 'high'
          });
        }

        // Check for dessert suggestions
        if (!order.dessert_suggested_at && order.main_served_at &&
            differenceInMinutes(now, new Date(order.main_served_at)) >= settings?.service_timings.suggest_dessert_minutes) {
          tasks.push({
            id: `${order.id}-dessert`,
            table: order.table_number,
            type: 'suggest_dessert',
            priority: 'medium'
          });
        }

        return tasks;
      });

      return tasks;
    }
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Service Tasks</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceTasks?.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Table {task.table}</h3>
                <p className="text-sm text-gray-500">
                  {task.type === 'suggest_drinks' ? 'Suggest Drinks' : 'Suggest Dessert'}
                </p>
              </div>
              <Badge variant={task.priority === 'high' ? 'destructive' : 'default'}>
                {task.priority}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};