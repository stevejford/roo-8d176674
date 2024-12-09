import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
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
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export const StoreHoursForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: hours, isLoading } = useQuery({
    queryKey: ['store-hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_hours')
        .select('*')
        .order('id');

      if (error) throw error;
      return data as StoreHours[];
    },
  });

  const mutation = useMutation({
    mutationFn: async (hours: StoreHours) => {
      const { error } = await supabase
        .from('store_hours')
        .upsert(hours);

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
      toast({
        title: "Error",
        description: "Failed to update store hours.",
        variant: "destructive",
      });
      console.error('Error updating store hours:', error);
    },
  });

  const handleTimeChange = (id: string, field: 'open_time' | 'close_time', value: string) => {
    const hour = hours?.find(h => h.id === id);
    if (hour) {
      mutation.mutate({ ...hour, [field]: value });
    }
  };

  const handleClosedToggle = (id: string, value: boolean) => {
    const hour = hours?.find(h => h.id === id);
    if (hour) {
      mutation.mutate({ ...hour, is_closed: value });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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