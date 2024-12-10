import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BusinessInfoForm } from "./BusinessInfoForm";
import { ServiceTimingForm } from "./ServiceTimingForm";
import { BillSplittingForm } from "./BillSplittingForm";
import { SettingsSectionHeader } from "./SettingsSectionHeader";
import { Separator } from "@/components/ui/separator";
import { BillSplittingConfig } from "./types";

interface StoreSettingsFormData {
  store_name: string;
  address: string;
}

export const StoreSettingsForm = () => {
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
        bill_splitting_config: data.bill_splitting_config as BillSplittingConfig
      };
    },
  });

  const businessInfoMutation = useMutation({
    mutationFn: async (data: StoreSettingsFormData) => {
      const { error } = await supabase
        .from('store_settings')
        .upsert({ 
          id: settings?.id,
          ...data 
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      toast({
        title: "Settings updated",
        description: "Business information has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update business information.",
        variant: "destructive",
      });
      console.error('Error updating store settings:', error);
    },
  });

  const billSplittingMutation = useMutation({
    mutationFn: async (data: BillSplittingConfig) => {
      const { error } = await supabase
        .from('store_settings')
        .update({ 
          bill_splitting_config: data as any // Type assertion needed due to Supabase's Json type
        })
        .eq('id', settings?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      toast({
        title: "Settings updated",
        description: "Bill splitting settings have been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update bill splitting settings.",
        variant: "destructive",
      });
      console.error('Error updating bill splitting settings:', error);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <SettingsSectionHeader
          title="Business Information"
          description="Update your business details and contact information."
        />
        <BusinessInfoForm
          defaultValues={{
            store_name: settings?.store_name || '',
            address: settings?.address || '',
          }}
          onSubmit={businessInfoMutation.mutate}
        />
      </div>

      <Separator />

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <SettingsSectionHeader
          title="Service Timing Settings"
          description="Configure timing thresholds for various service alerts and notifications."
        />
        <ServiceTimingForm />
      </div>

      <Separator />

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <SettingsSectionHeader
          title="Bill Splitting Settings"
          description="Configure how customers can split their bills."
        />
        <BillSplittingForm
          defaultValues={settings?.bill_splitting_config || {
            enabled: true,
            max_splits: 4,
            min_amount_per_split: 5.00,
            allow_uneven_splits: true,
          }}
          onSubmit={billSplittingMutation.mutate}
        />
      </div>
    </div>
  );
};