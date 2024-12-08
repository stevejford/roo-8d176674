import React from 'react';
import { ConfigurableList } from './shared/ConfigurableList';
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
    <ConfigurableList
      label="Volumes"
      items={config.volumes || []}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      nameLabel="Volume size"
    />
  );
};