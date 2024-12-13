import React from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

interface BusinessInfoFormData {
  store_name: string;
  address: string;
  accept_preorders: boolean;
}

interface BusinessInfoFormProps {
  defaultValues: BusinessInfoFormData;
  onSubmit: (data: BusinessInfoFormData) => void;
}

export const BusinessInfoForm = ({ defaultValues, onSubmit }: BusinessInfoFormProps) => {
  const form = useForm<BusinessInfoFormData>({
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="store_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your business name" />
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
              <FormLabel>Business Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your business address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accept_preorders"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Accept Pre-orders</FormLabel>
                <FormDescription>
                  Allow customers to place orders for later delivery when the store is closed
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button 
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Save Changes
        </Button>
      </form>
    </Form>
  );
};