import React from 'react';
import { SimplePricingConfig } from './config/SimplePricingConfig';
import { SizeBasedConfig } from './config/SizeBasedConfig';
import { PortionBasedConfig } from './config/PortionBasedConfig';
import { SelectionBasedConfig } from './config/SelectionBasedConfig';
import { VolumeBasedConfig } from './config/VolumeBasedConfig';

interface PricingModelConfigProps {
  type: string;
  config: any;
  onChange: (config: any) => void;
}

export const PricingModelConfig = ({ type, config, onChange }: PricingModelConfigProps) => {
  switch (type) {
    case 'simple':
      return <SimplePricingConfig config={config} onChange={onChange} />;

    case 'size_based':
      return <SizeBasedConfig config={config} onChange={onChange} />;

    case 'portion_based':
      return <PortionBasedConfig config={config} onChange={onChange} />;

    case 'selection_based':
      return <SelectionBasedConfig config={config} onChange={onChange} />;

    case 'volume_based':
      return <VolumeBasedConfig config={config} onChange={onChange} />;

    default:
      return null;
  }
};