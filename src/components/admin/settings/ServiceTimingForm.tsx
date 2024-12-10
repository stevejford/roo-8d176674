import React from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ServiceTimingFormData {
  take_order_minutes: number;
  check_table_minutes: number;
  suggest_drinks_minutes: number;
  suggest_dessert_minutes: number;
  cleanup_after_minutes: number;
  clear_appetizer_minutes: number;
  clear_main_minutes: number;
  clear_dessert_minutes: number;
}

export const ServiceTimingForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('service_timings')
        .single();

      if (error) throw error;
      return data?.service_timings;
    },
  });

  const form = useForm<ServiceTimingFormData>({
    defaultValues: settings || {
      take_order_minutes: 5,
      check_table_minutes: 10,
      suggest_drinks_minutes: 15,
      suggest_dessert_minutes: 30,
      cleanup_after_minutes: 5,
      clear_appetizer_minutes: 3,
      clear_main_minutes: 5,
      clear_dessert_minutes: 3,
    },
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="take_order_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Take Order Time (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormDescription>
                  Time allowed to take initial order after seating
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="check_table_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check Table Interval (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormDescription>
                  How often staff should check on tables
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="suggest_drinks_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suggest Drinks Time (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormDescription>
                  When to suggest drinks after seating
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="suggest_dessert_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suggest Dessert Time (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormDescription>
                  When to suggest dessert after seating
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cleanup_after_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cleanup Time (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormDescription>
                  Time allowed for table cleanup after meal
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clear_appetizer_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clear Appetizer Time (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormDescription>
                  Time to clear appetizer plates
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clear_main_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clear Main Course Time (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormDescription>
                  Time to clear main course plates
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clear_dessert_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clear Dessert Time (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormDescription>
                  Time to clear dessert plates
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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