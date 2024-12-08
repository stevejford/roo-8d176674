import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from 'lucide-react';
import { ConfigItem } from '../types';

interface ConfigurableListProps {
  label: string;
  items: ConfigItem[];
  onAdd: () => void;
  onUpdate: (index: number, key: string, value: any) => void;
  onRemove: (index: number) => void;
  nameLabel?: string;
  pricePlaceholder?: string;
}

export const ConfigurableList = ({
  label,
  items,
  onAdd,
  onUpdate,
  onRemove,
  nameLabel = "Name",
  pricePlaceholder = "Price"
}: ConfigurableListProps) => {
  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      {items?.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            placeholder={`${nameLabel}`}
            value={item.name || item.size || ''}
            onChange={(e) => onUpdate(index, item.size ? 'size' : 'name', e.target.value)}
          />
          <Input
            type="number"
            step="0.01"
            placeholder={pricePlaceholder}
            value={item.price}
            onChange={(e) => onUpdate(index, 'price', parseFloat(e.target.value) || 0)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={onAdd}
      >
        <Plus className="h-4 w-4 mr-2" /> Add {label.slice(0, -1)}
      </Button>
    </div>
  );
};