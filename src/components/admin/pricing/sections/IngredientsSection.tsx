import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Ingredient {
  name: string;
  checked: boolean;
}

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  onIngredientToggle: (name: string) => void;
  onEditClick: () => void;
}

export const IngredientsSection = ({ 
  ingredients, 
  onIngredientToggle,
  onEditClick 
}: IngredientsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#2D3648]">Ingredients</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onEditClick}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Ingredients
          </Button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ingredient) => (
            <div 
              key={ingredient.name}
              className="flex items-center justify-between py-2"
            >
              <span className="text-[#2D3648]">{ingredient.name}</span>
              <input
                type="checkbox"
                checked={ingredient.checked}
                onChange={() => onIngredientToggle(ingredient.name)}
                className="h-5 w-5 border-2 border-[#E86452] rounded text-[#E86452] focus:ring-[#E86452]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};