import React, { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

interface SizeOption {
  name: string;
  price: number;
}

interface ProductDetails {
  name: string;
  description: string;
  image: string;
  sizes: SizeOption[];
  tags?: string[];
}

export const OrderSidebar = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails>({
    name: "The Stewart",
    description: "Tomato, Cheese, Pepperoni And A Sprinkle Of Parmesan. Topped With A Generous Amount Of Hot Honey!",
    image: "/lovable-uploads/287b3edb-5299-4697-9d86-3416a2b1dc86.png",
    tags: ["Gluten Free"],
    sizes: [
      { name: "King", price: 34.00 },
      { name: "Family", price: 29.00 },
      { name: "Large", price: 24.00 },
      { name: "Medium", price: 19.00 },
      { name: "Small", price: 15.00 }
    ]
  });

  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(selectedProduct.sizes.map(size => [size.name, 0]))
  );

  const handleQuantityChange = (sizeName: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [sizeName]: Math.max(0, (prev[sizeName] || 0) + change)
    }));
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-lg flex flex-col">
      <div className="relative p-4 border-b border-gray-100">
        <button className="absolute right-4 top-4">
          <X className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="aspect-square w-full relative">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-semibold text-gray-900">{selectedProduct.name}</h2>
            {selectedProduct.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm font-medium text-red-500 border border-red-500 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Quantity</h3>
            {selectedProduct.sizes.map((size) => (
              <div key={size.name} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 min-w-[80px]">{size.name}</span>
                  <span className="text-gray-700">${size.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(size.name, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
                  >
                    <Minus className="h-4 w-4 text-gray-500" />
                  </button>
                  <span className="w-8 text-center">{quantities[size.name]}</span>
                  <button
                    onClick={() => handleQuantityChange(size.name, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
                  >
                    <Plus className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 font-medium">
            Add Extras
          </button>
          <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 font-medium">
            Edit Ingredients
          </button>
        </div>
      </div>
    </div>
  );
};