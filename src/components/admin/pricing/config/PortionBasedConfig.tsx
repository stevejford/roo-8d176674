import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from 'lucide-react';
import { ConfigItem } from './types';

interface PortionBasedConfigProps {
  config: { portions: ConfigItem[] };
  onChange: (config: { portions: ConfigItem[] }) => void;
}

export const PortionBasedConfig = ({ config, onChange }: PortionBasedConfigProps) => {
  const handleAdd = () => {
    onChange({
      portions: [...(config.portions || []), { name: '', price: 0 }]
    });
  };

  const handleUpdate = (index: number, key: string, value: any) => {
    const newPortions = config.portions?.map((item, i) => 
      i === index ? { ...item, [key]: value } : item
    ) || [];
    onChange({ portions: newPortions });
  };

  const handleRemove = (index: number) => {
    onChange({
      portions: config.portions?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="space-y-4">
      <Label>Portions</Label>
      {config.portions?.map((portion, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            placeholder="Portion name"
            value={portion.name}
            onChange={(e) => handleUpdate(index, 'name', e.target.value)}
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Price"
            value={portion.price}
            onChange={(e) => handleUpdate(index, 'price', parseFloat(e.target.value) || 0)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={handleAdd}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Portion
      </Button>
    </div>
  );
};