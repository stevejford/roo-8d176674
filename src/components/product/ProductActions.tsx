import React from 'react';

interface ProductActionsProps {
  onShowExtras: () => void;
  onShowIngredients: () => void;
}

export const ProductActions = ({ onShowExtras, onShowIngredients }: ProductActionsProps) => {
  return (
    <div className="border-t border-gray-200 p-4 mt-auto">
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onShowExtras}
          className="py-3 px-4 text-[#2D3648] border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          Add Extras
        </button>
        <button 
          onClick={onShowIngredients}
          className="py-3 px-4 text-[#2D3648] border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          Edit Ingredients
        </button>
      </div>
    </div>
  );
};