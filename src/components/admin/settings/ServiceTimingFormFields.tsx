import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ServiceTimingFormData } from "./types";

interface ServiceTimingFormFieldsProps {
  form: UseFormReturn<ServiceTimingFormData>;
}

export const ServiceTimingFormFields = ({ form }: ServiceTimingFormFieldsProps) => {
  return (
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
  );
};