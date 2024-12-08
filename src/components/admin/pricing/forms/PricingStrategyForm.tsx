import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PricingConfigEditor } from '../editors/PricingConfigEditor';

interface PricingStrategyFormProps {
  strategies: any[];
  selectedStrategyId: string;
  config: string;
  onStrategyChange: (value: string) => void;
  onConfigChange: (value: string) => void;
}

export const PricingStrategyForm = ({
  strategies,
  selectedStrategyId,
  config,
  onStrategyChange,
  onConfigChange,
}: PricingStrategyFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="strategy">Pricing Strategy</Label>
        <Select
          value={selectedStrategyId}
          onValueChange={onStrategyChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a strategy" />
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

      <PricingConfigEditor config={config} onChange={onConfigChange} />
    </div>
  );
};