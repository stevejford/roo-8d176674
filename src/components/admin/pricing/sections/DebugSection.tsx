import React from 'react';
import { CategoryPricingRow } from '../types';

interface DebugSectionProps {
  category: any;
  existingPricing: CategoryPricingRow | null;
  config: any;
}

export const DebugSection = ({ category, existingPricing, config }: DebugSectionProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-sm font-medium mb-2">Debug Information</h3>
      <div className="space-y-2">
        <div>
          <h4 className="text-xs font-medium text-gray-500">Category ID:</h4>
          <pre className="text-xs bg-white p-2 rounded">{category?.id}</pre>
        </div>
        <div>
          <h4 className="text-xs font-medium text-gray-500">Current Pricing Data:</h4>
          <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(existingPricing, null, 2)}
          </pre>
        </div>
        <div>
          <h4 className="text-xs font-medium text-gray-500">Current Config:</h4>
          <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};