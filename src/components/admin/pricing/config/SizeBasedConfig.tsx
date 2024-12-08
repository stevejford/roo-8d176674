import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from 'lucide-react';
import { ConfigItem } from './types';

interface SizeBasedConfigProps {
  config: { sizes: ConfigItem[] };
  onChange: (config: { sizes: ConfigItem[] }) => void;
}

export const SizeBasedConfig = ({ config, onChange }: SizeBasedConfigProps) => {
  const handleAdd = () => {
    onChange({
      sizes: [...(config.sizes || []), { name: '', price: 0 }]
    });
  };

  const handleUpdate = (index: number, key: string, value: any) => {
    const newSizes = config.sizes?.map((item, i) => 
      i === index ? { ...item, [key]: value } : item
    ) || [];
    onChange({ sizes: newSizes });
  };

  const handleRemove = (index: number) => {
    onChange({
      sizes: config.sizes?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="space-y-4">
      <Label>Sizes</Label>
      {config.sizes?.map((size, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            placeholder="Size name"
            value={size.name}
            onChange={(e) => handleUpdate(index, 'name', e.target.value)}
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Price"
            value={size.price}
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
        <Plus className="h-4 w-4 mr-2" /> Add Size
      </Button>
    </div>
  );
};