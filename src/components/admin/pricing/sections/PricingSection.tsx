import React from 'react';
import { PricingStrategySelect } from '../shared/PricingStrategySelect';
import { PricingModelConfig } from '../PricingModelConfig';

interface PricingSectionProps {
  selectedStrategyId: string;
  onStrategyChange: (id: string) => void;
  selectedStrategy: any;
  config: any;
  onConfigChange: (config: any) => void;
}

export const PricingSection = ({
  selectedStrategyId,
  onStrategyChange,
  selectedStrategy,
  config,
  onConfigChange,
}: PricingSectionProps) => {
  return (
    <div className="space-y-4">
      <PricingStrategySelect
        selectedStrategyId={selectedStrategyId}
        onStrategyChange={onStrategyChange}
      />

      {selectedStrategy && (
        <PricingModelConfig
          type={selectedStrategy.type}
          config={config}
          onChange={onConfigChange}
        />
      )}
    </div>
  );
};