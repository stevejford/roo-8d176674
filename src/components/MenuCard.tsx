import React from "react";
import { Plus } from "lucide-react";

interface MenuItemProps {
  title: string;
  price: number;
  description: string;
  image: string;
}

export const MenuCard = ({ title, price, description, image }: MenuItemProps) => {
  return (
    <div className="relative group cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100">
          <Plus className="h-5 w-5 text-primary" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex justify-between items-end">
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            <span className="text-white font-bold">L {price.toFixed(2)}</span>
          </div>
          <p className="text-white/90 text-sm mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
};