import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceTimingFormData, StoreSettingsResponse } from "./types";
import { ServiceTimingFormFields } from "./ServiceTimingFormFields";

const DEFAULT_TIMINGS: ServiceTimingFormData = {
  take_order_minutes: 5,
  check_table_minutes: 10,
  suggest_drinks_minutes: 15,
  suggest_dessert_minutes: 30,
  cleanup_after_minutes: 5,
  clear_appetizer_minutes: 3,
  clear_main_minutes: 5,
  clear_dessert_minutes: 3,
};

export const ServiceTimingForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();

      if (error) throw error;
      
      return {
        ...data,
        service_timings: data.service_timings as ServiceTimingFormData,
        bill_splitting_config: data.bill_splitting_config as StoreSettingsResponse['bill_splitting_config']
      } as StoreSettingsResponse;
    },
  });

  const form = useForm<ServiceTimingFormData>({
    defaultValues: settings?.service_timings || DEFAULT_TIMINGS,
  });

  const mutation = useMutation({
    mutationFn: async (data: ServiceTimingFormData) => {
      const { error } = await supabase
        .from('store_settings')
        .update({ service_timings: data })
        .eq('id', settings?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      toast({
        title: "Settings updated",
        description: "Service timing settings have been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating service timings:', error);
      toast({
        title: "Error",
        description: "Failed to update service timing settings.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ServiceTimingFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ServiceTimingFormFields form={form} />
        <Button 
          type="submit" 
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};