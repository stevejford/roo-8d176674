import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { BusinessInfoForm } from './BusinessInfoForm';
import { ServiceTimingForm } from './ServiceTimingForm';
import { StoreHoursForm } from './StoreHoursForm';
import { BillSplittingForm } from './BillSplittingForm';
import { StripeConfigForm } from './StripeConfigForm';
import { DeliveryZonesForm } from './DeliveryZonesForm';
import { SettingsSectionHeader } from './SettingsSectionHeader';
import { StoreSettingsResponse } from './types';

interface StoreSettings {
  id: string;
  store_name: string;
  address: string;
  accept_preorders: boolean;
  bill_splitting_config: {
    enabled: boolean;
    max_splits: number;
    min_amount_per_split: number;
    allow_uneven_splits: boolean;
  };
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
        bill_splitting_config: data.bill_splitting_config as StoreSettings['bill_splitting_config']
      } as StoreSettings;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: Partial<StoreSettings>) => {
      const { error } = await supabase
        .from('store_settings')
        .update(data)
        .eq('id', settings?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      toast({
        title: "Settings updated",
        description: "Store settings have been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating store settings:', error);
      toast({
        title: "Error",
        description: "Failed to update store settings.",
        variant: "destructive",
      });
    },
  });

  const handleBusinessInfoSubmit = (data: { store_name: string; address: string; accept_preorders: boolean }) => {
    mutation.mutate(data);
  };

  const handleBillSplittingSubmit = (data: StoreSettings['bill_splitting_config']) => {
    mutation.mutate({ bill_splitting_config: data });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-12">
      <BusinessInfoForm
        defaultValues={{
          store_name: settings?.store_name || '',
          address: settings?.address || '',
          accept_preorders: settings?.accept_preorders ?? true,
        }}
        onSubmit={handleBusinessInfoSubmit}
      />

      <ServiceTimingForm />
      <StoreHoursForm />
      <DeliveryZonesForm />

      <div>
        <SettingsSectionHeader
          title="Bill Splitting"
          description="Configure how customers can split their bills"
        />
        <BillSplittingForm
          defaultValues={settings?.bill_splitting_config || {
            enabled: true,
            max_splits: 4,
            min_amount_per_split: 5,
            allow_uneven_splits: true,
          }}
          onSubmit={handleBillSplittingSubmit}
        />
      </div>

      <StripeConfigForm />
    </div>
  );
};