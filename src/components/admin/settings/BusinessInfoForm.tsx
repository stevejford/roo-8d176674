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