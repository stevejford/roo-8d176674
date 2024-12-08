import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SimplePricingConfigProps {
  config: { price: number };
  onChange: (config: { price: number }) => void;
}

export const SimplePricingConfig = ({ config, onChange }: SimplePricingConfigProps) => {
  return (
    <div className="grid gap-2">
      <Label>Price ($)</Label>
      <Input
        type="number"
        step="0.01"
        value={config.price || ''}
        onChange={(e) => onChange({ price: parseFloat(e.target.value) || 0 })}
        placeholder="0.00"
      />
    </div>
  );
};