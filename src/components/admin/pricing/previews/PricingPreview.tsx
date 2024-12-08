import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PricingPreviewProps {
  strategy: {
    name: string;
    type: string;
    preview_config: any;
  };
}

export const PricingPreview = ({ strategy }: PricingPreviewProps) => {
  const renderPreview = () => {
    switch (strategy.type) {
      case 'simple':
        return <SimplePreview config={strategy.preview_config} />;
      case 'size_based':
        return <SizeBasedPreview config={strategy.preview_config} />;
      case 'portion_based':
        return <PortionBasedPreview config={strategy.preview_config} />;
      default:
        return <div>No preview available for this strategy type</div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{strategy.name} Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {renderPreview()}
      </CardContent>
    </Card>
  );
};

const SimplePreview = ({ config }: { config: any }) => {
  return (
    <div className="space-y-2">
      <p className="text-2xl font-bold">${config.price || '0.00'}</p>
    </div>
  );
};

const SizeBasedPreview = ({ config }: { config: any }) => {
  return (
    <div className="space-y-2">
      {config.sizes?.map((size: any, index: number) => (
        <div key={index} className="flex justify-between">
          <span>{size.name}</span>
          <span className="font-bold">${size.price}</span>
        </div>
      ))}
    </div>
  );
};

const PortionBasedPreview = ({ config }: { config: any }) => {
  return (
    <div className="space-y-2">
      {config.portions?.map((portion: any, index: number) => (
        <div key={index} className="flex justify-between">
          <span>{portion.name}</span>
          <span className="font-bold">${portion.price}</span>
        </div>
      ))}
    </div>
  );
};