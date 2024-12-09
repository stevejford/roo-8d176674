import React from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
      return data;
    },
  });

  const form = useForm<StoreSettingsFormData>({
    defaultValues: {
      store_name: settings?.store_name || '',
      address: settings?.address || '',
    },
  });

  // Reset form when settings data is loaded
  React.useEffect(() => {
    if (settings) {
      form.reset({
        store_name: settings.store_name,
        address: settings.address,
      });
    }
  }, [settings, form]);

  const mutation = useMutation({
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
        description: "Store settings have been successfully updated.",
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update store settings.",
        variant: "destructive",
        duration: 3000,
      });
      console.error('Error updating store settings:', error);
    },
  });

  const onSubmit = (data: StoreSettingsFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="store_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Save Settings
            </Button>
          </form>
        </Form>
      </div>

      {settings && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Current Settings</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Store Name: </span>
              <span>{settings.store_name}</span>
            </div>
            <div>
              <span className="font-medium">Store Address: </span>
              <span>{settings.address}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};