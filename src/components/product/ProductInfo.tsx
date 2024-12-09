import React from 'react';
import type { PricingConfig } from "@/types/pricing";
import { PricingOptions } from "./PricingOptions";

interface ProductInfoProps {
  title: string;
  description: string;
  pricingStrategy: any;
  pricingConfig: PricingConfig | null;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  defaultPrice: number;
}

export const ProductInfo = ({ 
  title, 
  description, 
  pricingStrategy,
  pricingConfig,
  selectedSize,
  onSizeSelect,
  defaultPrice 
}: ProductInfoProps) => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-2xl font-semibold text-[#2D3648]">{title}</h2>
        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
          Gluten Free
        </span>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-[#2D3648]">Options</h3>
        {pricingStrategy && pricingConfig && (
          <PricingOptions
            strategy={pricingStrategy}
            config={pricingConfig}
            selectedSize={selectedSize}
            onSizeSelect={onSizeSelect}
            defaultPrice={defaultPrice}
          />
        )}
      </div>
    </div>
  );
};