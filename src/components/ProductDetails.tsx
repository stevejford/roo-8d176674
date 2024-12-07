import React, { useState } from "react";
import { X, Minus, Plus } from "lucide-react";

interface Size {
  name: string;
  price: number;
}

interface ProductDetailsProps {
  title: string;
  description: string;
  image: string;
  onClose: () => void;
}

export const ProductDetails = ({ title, description, image, onClose }: ProductDetailsProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    King: 0,
    Family: 0,
    Large: 0,
    Medium: 0,
    Small: 0
  });

  const sizes: Size[] = [
    { name: "King", price: 34.00 },
    { name: "Family", price: 29.00 },
    { name: "Large", price: 24.00 },
    { name: "Medium", price: 19.00 },
    { name: "Small", price: 15.00 }
  ];

  const handleQuantityChange = (size: string, increment: boolean) => {
    setQuantities(prev => ({
      ...prev,
      [size]: Math.max(0, prev[size] + (increment ? 1 : -1))
    }));
  };

  return (
    <div className="animate-slide-in-right h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
          <div className="aspect-square w-full">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-semibold text-[#2D3648]">{title}</h2>
            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
              Gluten Free
            </span>
          </div>
          <p className="text-gray-600 mb-6">{description}</p>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-[#2D3648]">Quantity</h3>
            {sizes.map((size) => (
              <div key={size.name} className="flex items-center justify-between">
                <span className="text-[#2D3648]">{size.name}</span>
                <div className="flex items-center gap-6">
                  <span className="text-[#2D3648] min-w-[60px]">${size.price.toFixed(2)}</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(size.name, false)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="h-5 w-5 text-gray-400" />
                    </button>
                    <span className="w-4 text-center">{quantities[size.name]}</span>
                    <button
                      onClick={() => handleQuantityChange(size.name, true)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="h-5 w-5 text-[#E86452]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 mt-auto">
        <div className="grid grid-cols-2 gap-4">
          <button className="py-3 px-4 text-[#2D3648] border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            Add Extras
          </button>
          <button className="py-3 px-4 text-[#2D3648] border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            Edit Ingredients
          </button>
        </div>
      </div>
    </div>
  );
};