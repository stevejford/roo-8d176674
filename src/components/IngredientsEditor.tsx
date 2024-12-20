import React from "react";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#2D3648]">Edit Ingredients</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
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
      </DialogContent>
    </Dialog>
  );
};