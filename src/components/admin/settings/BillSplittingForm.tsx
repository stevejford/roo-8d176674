import React from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { BillSplittingConfig } from './types';

interface BillSplittingFormProps {
  defaultValues: BillSplittingConfig;
  onSubmit: (data: BillSplittingConfig) => void;
}

export const BillSplittingForm = ({ defaultValues, onSubmit }: BillSplittingFormProps) => {
  const form = useForm<BillSplittingConfig>({
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Bill Splitting</FormLabel>
                <FormDescription>
                  Allow customers to split their bills
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

        <FormField
          control={form.control}
          name="max_splits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Number of Splits</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Maximum number of ways a bill can be split
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="min_amount_per_split"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Amount per Split</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Minimum amount required for each split portion
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allow_uneven_splits"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Allow Uneven Splits</FormLabel>
                <FormDescription>
                  Allow bills to be split into different amounts
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