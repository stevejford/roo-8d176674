import React from 'react';
import { ConfigurableList } from './shared/ConfigurableList';
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
    <ConfigurableList
      label="Options"
      items={config.options || []}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      nameLabel="Option name"
      pricePlaceholder="Additional price"
    />
  );
};