import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/components/AuthProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StoreHours {
  id: string;
  day_of_week: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

export const StoreHoursForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAdmin } = useAuth();

  const { data: hours, isLoading } = useQuery({
    queryKey: ['store-hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_hours')
        .select('*');

      if (error) throw error;

      // Sort the days in correct order
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return data.sort((a, b) => 
        dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week)
      ) as StoreHours[];
    },
  });

  const mutation = useMutation({
    mutationFn: async (hours: StoreHours) => {
      if (!user || !isAdmin) {
        throw new Error('Unauthorized: Only admin users can modify store hours');
      }

      // If the day is closed, set times to null
      const updatedHours = hours.is_closed ? {
        ...hours,
        open_time: null,
        close_time: null
      } : {
        ...hours,
        // Only send time values if they're not empty strings
        open_time: hours.open_time || null,
        close_time: hours.close_time || null
      };

      const { error } = await supabase
        .from('store_hours')
        .upsert(updatedHours);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-hours'] });
      toast({
        title: "Hours updated",
        description: "Store hours have been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating store hours:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update store hours.",
        variant: "destructive",
      });
    },
  });

  const handleTimeChange = (id: string, field: 'open_time' | 'close_time', value: string) => {
    const hour = hours?.find(h => h.id === id);
    if (hour) {
      mutation.mutate({
        ...hour,
        [field]: value || null
      });
    }
  };

  const handleClosedToggle = (id: string, value: boolean) => {
    const hour = hours?.find(h => h.id === id);
    if (hour) {
      mutation.mutate({
        ...hour,
        is_closed: value,
        open_time: value ? null : hour.open_time,
        close_time: value ? null : hour.close_time
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="text-red-600">
        Only administrators can modify store hours.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Open Time</TableHead>
            <TableHead>Close Time</TableHead>
            <TableHead>Closed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hours?.map((hour) => (
            <TableRow key={hour.id}>
              <TableCell>{hour.day_of_week}</TableCell>
              <TableCell>
                <Input
                  type="time"
                  value={hour.open_time || ''}
                  onChange={(e) => handleTimeChange(hour.id, 'open_time', e.target.value)}
                  disabled={hour.is_closed}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="time"
                  value={hour.close_time || ''}
                  onChange={(e) => handleTimeChange(hour.id, 'close_time', e.target.value)}
                  disabled={hour.is_closed}
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={hour.is_closed}
                  onCheckedChange={(checked) => handleClosedToggle(hour.id, checked)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};