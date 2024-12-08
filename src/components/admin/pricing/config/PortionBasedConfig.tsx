import React from 'react';
import { ConfigurableList } from './shared/ConfigurableList';
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
    <ConfigurableList
      label="Portions"
      items={config.portions || []}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      nameLabel="Portion name"
    />
  );
};