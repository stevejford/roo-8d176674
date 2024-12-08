import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PricingConfigEditorProps {
  config: string;
  onChange: (value: string) => void;
}

export const PricingConfigEditor = ({ config, onChange }: PricingConfigEditorProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="config">Configuration (JSON)</Label>
      <Textarea
        id="config"
        value={config}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono"
        rows={8}
      />
    </div>
  );
};