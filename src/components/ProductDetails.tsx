import React from "react";
import { X, Minus, Plus } from "lucide-react";

interface ProductDetailsProps {
  title: string;
  description: string;
  image: string;
  onClose: () => void;
}

export const ProductDetails = ({ title, description, image, onClose }: ProductDetailsProps) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="relative">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-semibold text-[#2D3648]">{title}</h2>
          <span className="px-3 py-1 bg-white border border-[#E86452] text-[#E86452] text-sm font-medium rounded-md">
            Gluten Free
          </span>
        </div>

        <p className="text-gray-600 mb-8">{description}</p>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-[#2D3648]">Quantity</h3>
          
          <div className="space-y-3">
            {[
              { size: "King", price: 34.00 },
              { size: "Family", price: 29.00 },
              { size: "Large", price: 24.00 },
              { size: "Medium", price: 19.00 },
              { size: "Small", price: 15.00 }
            ].map((option) => (
              <div key={option.size} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-[#2D3648] font-medium">{option.size}</span>
                  <span className="text-gray-600">${option.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-1 rounded-full border border-gray-200 hover:bg-gray-50">
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="w-8 text-center text-gray-600">0</span>
                  <button className="p-1 rounded-full border border-gray-200 hover:bg-gray-50">
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <button className="py-2.5 px-4 border border-gray-200 rounded-md text-[#2D3648] font-medium hover:bg-gray-50">
            Add Extras
          </button>
          <button className="py-2.5 px-4 border border-gray-200 rounded-md text-[#2D3648] font-medium hover:bg-gray-50">
            Edit Ingredients
          </button>
        </div>
      </div>
    </div>
  );
};