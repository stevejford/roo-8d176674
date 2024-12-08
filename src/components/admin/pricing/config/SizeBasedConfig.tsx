import React from 'react';
import { ConfigurableList } from './shared/ConfigurableList';
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
    <ConfigurableList
      label="Sizes"
      items={config.sizes || []}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      nameLabel="Size name"
    />
  );
};