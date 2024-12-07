import React from "react";
import { Plus } from "lucide-react";

interface ComplementaryItemProps {
  name: string;
  price: number;
  image: string;
}

export const ComplementaryItem = ({ name, price, image }: ComplementaryItemProps) => {
  return (
    <div className="flex-none w-[120px] snap-start">
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-[120px] object-cover rounded-lg"
        />
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-full flex justify-center">
          <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-full shadow-md">
            <Plus className="w-3.5 h-3.5 text-[#E86452]" />
            <span className="text-xs font-semibold tracking-tight">
              ${price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm font-normal text-[#2D3648] text-center truncate">
        {name}
      </p>
    </div>
  );
};