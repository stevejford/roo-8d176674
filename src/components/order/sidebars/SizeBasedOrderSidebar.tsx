import React, { useState } from "react";
import { X } from "lucide-react";
import type { PricingConfig } from "@/types/pricing/interfaces";

interface SizeBasedOrderSidebarProps {
  product: {
    title: string;
    description: string;
    image: string;
    price: number;
    category_id?: string;
  };
  pricing: PricingConfig;
  onClose: () => void;
}

export const SizeBasedOrderSidebar = ({ product, pricing, onClose }: SizeBasedOrderSidebarProps) => {
  const [selectedSize, setSelectedSize] = useState(pricing.sizes?.[0]?.name || '');

  const getCurrentPrice = () => {
    const size = pricing.sizes?.find(s => s.name === selectedSize);
    return size?.price || product.price;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full aspect-square object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Size Options</h3>
            <div className="grid gap-2">
              {pricing.sizes?.map((size) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size.name)}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    selectedSize === size.name
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                >
                  <span>{size.name}</span>
                  <span className="font-semibold">${size.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <button className="w-full py-3 px-4 bg-primary text-white rounded-md flex items-center justify-between">
          <span>Add to Order</span>
          <span>${getCurrentPrice().toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};