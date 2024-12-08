import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from 'lucide-react';
import { ConfigItem } from './types';

interface VolumeBasedConfigProps {
  config: { volumes: ConfigItem[] };
  onChange: (config: { volumes: ConfigItem[] }) => void;
}

export const VolumeBasedConfig = ({ config, onChange }: VolumeBasedConfigProps) => {
  const handleAdd = () => {
    onChange({
      volumes: [...(config.volumes || []), { size: '', price: 0 }]
    });
  };

  const handleUpdate = (index: number, key: string, value: any) => {
    const newVolumes = config.volumes?.map((item, i) => 
      i === index ? { ...item, [key]: value } : item
    ) || [];
    onChange({ volumes: newVolumes });
  };

  const handleRemove = (index: number) => {
    onChange({
      volumes: config.volumes?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="space-y-4">
      <Label>Volumes</Label>
      {config.volumes?.map((volume, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            placeholder="Volume size"
            value={volume.size}
            onChange={(e) => handleUpdate(index, 'size', e.target.value)}
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Price"
            value={volume.price}
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
        <Plus className="h-4 w-4 mr-2" /> Add Volume
      </Button>
    </div>
  );
};