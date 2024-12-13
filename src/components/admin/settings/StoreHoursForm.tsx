import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { PreOrderSettings } from "./store-hours/PreOrderSettings";
import { HoursTable } from "./store-hours/HoursTable";
import { SettingsSectionHeader } from "./SettingsSectionHeader";

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
      <SettingsSectionHeader
        title="Store Hours"
        description="Set your restaurant's operating hours for each day of the week. Toggle days as closed when needed, and configure specific opening and closing times."
      />
      <PreOrderSettings
        acceptPreorders={settings?.accept_preorders ?? true}
        onPreorderToggle={(checked) => settingsMutation.mutate(checked)}
      />
      <HoursTable
        hours={hours || []}
        onTimeChange={handleTimeChange}
        onClosedToggle={handleClosedToggle}
      />
    </div>
  );
};