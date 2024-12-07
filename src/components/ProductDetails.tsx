import React from "react";
import { X } from "lucide-react";

interface ProductDetailsProps {
  title: string;
  description: string;
  image: string;
  onClose: () => void;
}

export const ProductDetails = ({ title, description, image, onClose }: ProductDetailsProps) => {
  return (
    <div className="animate-slide-in-right h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#2D3648]">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="aspect-square w-full overflow-hidden rounded-lg">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#2D3648] mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};