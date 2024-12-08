import React from 'react';
import { PricingConfig } from '@/types/pricing';

interface PricingOptionsProps {
  strategy: {
    type: string;
    name: string;
  };
  config: PricingConfig;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  defaultPrice: number;
}

export const PricingOptions = ({ 
  strategy, 
  config, 
  selectedSize, 
  onSizeSelect,
  defaultPrice 
}: PricingOptionsProps) => {
  console.log('PricingOptions - Strategy:', strategy);
  console.log('PricingOptions - Config:', config);

  switch (strategy.type) {
    case 'simple':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[#2D3648]">Regular</span>
            <div className="flex items-center gap-6">
              <span className="text-[#2D3648] min-w-[60px]">
                ${config.price?.toFixed(2) || defaultPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      );

    case 'size_based':
      return (
        <div className="space-y-4">
          {config.sizes?.map((size) => (
            <div key={size.name} className="flex items-center justify-between">
              <span className="text-[#2D3648]">{size.name}</span>
              <div className="flex items-center gap-6">
                <span className="text-[#2D3648] min-w-[60px]">${size.price.toFixed(2)}</span>
                <button
                  onClick={() => onSizeSelect(size.name)}
                  className={`px-4 py-2 rounded-full ${
                    selectedSize === size.name 
                      ? 'bg-[#10B981] text-white' 
                      : 'bg-gray-100'
                  }`}
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      );

    case 'portion_based':
      return (
        <div className="space-y-4">
          {config.portions?.map((portion) => (
            <div key={portion.name} className="flex items-center justify-between">
              <span className="text-[#2D3648]">{portion.name}</span>
              <div className="flex items-center gap-6">
                <span className="text-[#2D3648] min-w-[60px]">${portion.price.toFixed(2)}</span>
                <button
                  onClick={() => onSizeSelect(portion.name)}
                  className={`px-4 py-2 rounded-full ${
                    selectedSize === portion.name 
                      ? 'bg-[#10B981] text-white' 
                      : 'bg-gray-100'
                  }`}
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      );

    case 'selection_based':
      return (
        <div className="space-y-4">
          {config.options?.map((option) => (
            <div key={option.name} className="flex items-center justify-between">
              <span className="text-[#2D3648]">{option.name}</span>
              <div className="flex items-center gap-6">
                <span className="text-[#2D3648] min-w-[60px]">${option.price.toFixed(2)}</span>
                <button
                  onClick={() => onSizeSelect(option.name)}
                  className={`px-4 py-2 rounded-full ${
                    selectedSize === option.name 
                      ? 'bg-[#10B981] text-white' 
                      : 'bg-gray-100'
                  }`}
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[#2D3648]">Regular</span>
            <div className="flex items-center gap-6">
              <span className="text-[#2D3648] min-w-[60px]">${defaultPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      );
  }
};