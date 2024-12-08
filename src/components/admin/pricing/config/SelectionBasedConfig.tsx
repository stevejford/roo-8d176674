import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from 'lucide-react';
import { ConfigItem } from './types';

interface SelectionBasedConfigProps {
  config: { options: ConfigItem[] };
  onChange: (config: { options: ConfigItem[] }) => void;
}

export const SelectionBasedConfig = ({ config, onChange }: SelectionBasedConfigProps) => {
  const handleAdd = () => {
    onChange({
      options: [...(config.options || []), { name: '', price: 0 }]
    });
  };

  const handleUpdate = (index: number, key: string, value: any) => {
    const newOptions = config.options?.map((item, i) => 
      i === index ? { ...item, [key]: value } : item
    ) || [];
    onChange({ options: newOptions });
  };

  const handleRemove = (index: number) => {
    onChange({
      options: config.options?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="space-y-4">
      <Label>Options</Label>
      {config.options?.map((option, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            placeholder="Option name"
            value={option.name}
            onChange={(e) => handleUpdate(index, 'name', e.target.value)}
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Additional price"
            value={option.price}
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
        <Plus className="h-4 w-4 mr-2" /> Add Option
      </Button>
    </div>
  );
};