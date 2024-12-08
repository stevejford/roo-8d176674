import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PricingConfigEditor } from './PricingConfigEditor';

interface PricingStrategyFormProps {
  name: string;
  type: string;
  config: string;
  onNameChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onConfigChange: (value: string) => void;
}

export const PricingStrategyForm = ({
  name,
  type,
  config,
  onNameChange,
  onTypeChange,
  onConfigChange,
}: PricingStrategyFormProps) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="size_based">Size Based</SelectItem>
            <SelectItem value="portion_based">Portion Based</SelectItem>
            <SelectItem value="selection_based">Selection Based</SelectItem>
            <SelectItem value="volume_based">Volume Based</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PricingConfigEditor config={config} onChange={onConfigChange} />
    </div>
  );
};