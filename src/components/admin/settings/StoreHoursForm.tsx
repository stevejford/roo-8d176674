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
  const { session, isAdmin } = useAuth();

  const { data: hours, isLoading: hoursLoading } = useQuery({
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

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
  });

  const settingsMutation = useMutation({
    mutationFn: async (accept_preorders: boolean) => {
      if (!session || !isAdmin) {
        throw new Error('Unauthorized: Only admin users can modify store settings');
      }

      const { error } = await supabase
        .from('store_settings')
        .update({ accept_preorders })
        .eq('id', settings?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      toast({
        title: "Settings updated",
        description: "Pre-order settings have been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating store settings:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update store settings.",
        variant: "destructive",
      });
    },
  });

  const hoursMutation = useMutation({
    mutationFn: async (hours: StoreHours) => {
      if (!session || !isAdmin) {
        throw new Error('Unauthorized: Only admin users can modify store hours');
      }

      const updatedHours = hours.is_closed ? {
        ...hours,
        open_time: null,
        close_time: null
      } : {
        ...hours,
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
      hoursMutation.mutate({
        ...hour,
        [field]: value || null
      });
    }
  };

  const handleClosedToggle = (id: string, value: boolean) => {
    const hour = hours?.find(h => h.id === id);
    if (hour) {
      hoursMutation.mutate({
        ...hour,
        is_closed: value,
        open_time: value ? null : hour.open_time,
        close_time: value ? null : hour.close_time
      });
    }
  };

  const handlePreorderToggle = (checked: boolean) => {
    settingsMutation.mutate(checked);
  };

  if (hoursLoading || settingsLoading) {
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
      <div className="flex flex-row items-center justify-between rounded-lg border p-4 mb-6">
        <div className="space-y-0.5">
          <h3 className="text-base font-medium">Accept Pre-orders</h3>
          <p className="text-sm text-muted-foreground">
            Allow customers to place orders for later delivery when the store is closed
          </p>
        </div>
        <Switch
          checked={settings?.accept_preorders ?? true}
          onCheckedChange={handlePreorderToggle}
        />
      </div>

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