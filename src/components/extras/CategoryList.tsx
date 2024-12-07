import React from "react";
import { Plus, Minus } from "lucide-react";

interface Extra {
  name: string;
  price: number;
}

interface CategoryListProps {
  name: string;
  items: Extra[];
  quantities: Record<string, number>;
  onQuantityChange: (itemName: string, increment: boolean) => void;
}

export const CategoryList = ({ name, items, quantities, onQuantityChange }: CategoryListProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#2D3648] mb-3 capitalize">
        {name}
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.name}
            className="flex items-center justify-between py-2 border-b border-gray-100"
          >
            <div>
              <span className="text-[#2D3648]">{item.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                ${item.price.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onQuantityChange(item.name, false)}
                className="p-1 rounded-full hover:bg-gray-100"
                type="button"
              >
                <Minus className="h-5 w-5 text-gray-400" />
              </button>
              <span className="w-4 text-center">
                {quantities[item.name] || 0}
              </span>
              <button
                onClick={() => onQuantityChange(item.name, true)}
                className="p-1 rounded-full hover:bg-gray-100"
                type="button"
              >
                <Plus className="h-5 w-5 text-[#E86452]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};