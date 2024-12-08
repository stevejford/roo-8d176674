import React from "react";
import { cn } from "@/lib/utils";

interface PastaType {
  name: string;
  price: number;
}

interface PastaTypeSelectorProps {
  isOpen: boolean;
  selectedType: string;
  onSelect: (type: string) => void;
  onClose: () => void;
}

export const PastaTypeSelector = ({
  isOpen,
  selectedType,
  onSelect,
  onClose
}: PastaTypeSelectorProps) => {
  const pastaTypes = [
    { name: "Gnocchi", price: 0 },
    { name: "Spaghetti", price: 0 },
    { name: "Spiral", price: 0 },
    { name: "Gluten Free Penne", price: 2.00 },
    { name: "Fettuccine", price: 0 },
  ];

  return (
    <div className={cn(
      "fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 transform transition-transform duration-300 ease-in-out",
      isOpen ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#2D3648] mb-4">Select Pasta Type</h3>
        <div className="space-y-3">
          {pastaTypes.map((pasta) => (
            <div
              key={pasta.name}
              className="flex items-center justify-between py-3 border-b border-gray-100"
            >
              <div>
                <span className="text-[#2D3648]">{pasta.name}</span>
                {pasta.price > 0 && (
                  <span className="ml-2 text-sm text-gray-500">
                    +${pasta.price.toFixed(2)}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  onSelect(pasta.name);
                  onClose();
                }}
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                  selectedType === pasta.name
                    ? "border-[#E86452] bg-[#E86452]"
                    : "border-gray-300"
                )}
              >
                {selectedType === pasta.name && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};