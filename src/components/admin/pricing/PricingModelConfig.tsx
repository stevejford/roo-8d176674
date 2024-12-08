import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from 'lucide-react';

interface PricingModelConfigProps {
  type: string;
  config: any;
  onChange: (config: any) => void;
}

export const PricingModelConfig = ({ type, config, onChange }: PricingModelConfigProps) => {
  const handleSimpleConfig = (price: string) => {
    onChange({ price: parseFloat(price) || 0 });
  };

  const handleSizeConfig = (sizes: any[]) => {
    onChange({ sizes });
  };

  const handlePortionConfig = (portions: any[]) => {
    onChange({ portions });
  };

  const handleSelectionConfig = (options: any[]) => {
    onChange({ options });
  };

  const handleVolumeConfig = (volumes: any[]) => {
    onChange({ volumes });
  };

  const addItem = (array: any[], template: any) => {
    return [...array, template];
  };

  const updateItem = (array: any[], index: number, key: string, value: any) => {
    return array.map((item, i) => 
      i === index ? { ...item, [key]: value } : item
    );
  };

  const removeItem = (array: any[], index: number) => {
    return array.filter((_, i) => i !== index);
  };

  switch (type) {
    case 'simple':
      return (
        <div className="grid gap-2">
          <Label>Price ($)</Label>
          <Input
            type="number"
            step="0.01"
            value={config.price || ''}
            onChange={(e) => handleSimpleConfig(e.target.value)}
            placeholder="0.00"
          />
        </div>
      );

    case 'size_based':
      return (
        <div className="space-y-4">
          <Label>Sizes</Label>
          {config.sizes?.map((size: any, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Size name"
                value={size.name}
                onChange={(e) => handleSizeConfig(updateItem(config.sizes || [], index, 'name', e.target.value))}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Price"
                value={size.price}
                onChange={(e) => handleSizeConfig(updateItem(config.sizes || [], index, 'price', parseFloat(e.target.value) || 0))}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSizeConfig(removeItem(config.sizes || [], index))}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => handleSizeConfig(addItem(config.sizes || [], { name: '', price: 0 }))}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Size
          </Button>
        </div>
      );

    case 'portion_based':
      return (
        <div className="space-y-4">
          <Label>Portions</Label>
          {config.portions?.map((portion: any, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Portion name"
                value={portion.name}
                onChange={(e) => handlePortionConfig(updateItem(config.portions || [], index, 'name', e.target.value))}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Price"
                value={portion.price}
                onChange={(e) => handlePortionConfig(updateItem(config.portions || [], index, 'price', parseFloat(e.target.value) || 0))}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePortionConfig(removeItem(config.portions || [], index))}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => handlePortionConfig(addItem(config.portions || [], { name: '', price: 0 }))}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Portion
          </Button>
        </div>
      );

    case 'selection_based':
      return (
        <div className="space-y-4">
          <Label>Options</Label>
          {config.options?.map((option: any, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Option name"
                value={option.name}
                onChange={(e) => handleSelectionConfig(updateItem(config.options || [], index, 'name', e.target.value))}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Additional price"
                value={option.price}
                onChange={(e) => handleSelectionConfig(updateItem(config.options || [], index, 'price', parseFloat(e.target.value) || 0))}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSelectionConfig(removeItem(config.options || [], index))}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => handleSelectionConfig(addItem(config.options || [], { name: '', price: 0 }))}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Option
          </Button>
        </div>
      );

    case 'volume_based':
      return (
        <div className="space-y-4">
          <Label>Volumes</Label>
          {config.volumes?.map((volume: any, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Volume size"
                value={volume.size}
                onChange={(e) => handleVolumeConfig(updateItem(config.volumes || [], index, 'size', e.target.value))}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Price"
                value={volume.price}
                onChange={(e) => handleVolumeConfig(updateItem(config.volumes || [], index, 'price', parseFloat(e.target.value) || 0))}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVolumeConfig(removeItem(config.volumes || [], index))}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => handleVolumeConfig(addItem(config.volumes || [], { size: '', price: 0 }))}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Volume
          </Button>
        </div>
      );

    default:
      return null;
  }
};