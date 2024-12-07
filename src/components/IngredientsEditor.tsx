import React from "react";
import { X, Check } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

interface Ingredient {
  name: string;
  checked: boolean;
}

interface IngredientsEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onIngredientToggle: (ingredientName: string) => void;
  ingredients: Ingredient[];
}

export const IngredientsEditor = ({ 
  isOpen, 
  onClose,
  onIngredientToggle,
  ingredients 
}: IngredientsEditorProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#2D3648]">Edit Ingredients</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            {ingredients.map((ingredient) => (
              <div 
                key={ingredient.name}
                className="flex items-center justify-between py-3 border-b border-gray-100"
              >
                <span className="text-[#2D3648] text-lg">{ingredient.name}</span>
                <Checkbox
                  checked={ingredient.checked}
                  onCheckedChange={() => onIngredientToggle(ingredient.name)}
                  className="h-5 w-5 border-2 border-[#E86452] data-[state=checked]:bg-[#E86452] data-[state=checked]:border-[#E86452]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};