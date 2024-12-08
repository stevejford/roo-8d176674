import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PricingStrategySelectProps {
  selectedStrategyId: string;
  onStrategyChange: (id: string) => void;
}

export const PricingStrategySelect = ({ selectedStrategyId, onStrategyChange }: PricingStrategySelectProps) => {
  const { data: strategies } = useQuery({
    queryKey: ['pricing-strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_strategies')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="grid gap-2">
      <Label>Pricing Strategy</Label>
      <Select 
        value={selectedStrategyId} 
        onValueChange={onStrategyChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a pricing strategy" />
        </SelectTrigger>
        <SelectContent>
          {strategies?.map((strategy) => (
            <SelectItem key={strategy.id} value={strategy.id}>
              {strategy.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};