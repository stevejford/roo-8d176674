import React, { useState } from "react";
import { X } from "lucide-react";
import { IngredientsEditor } from "./IngredientsEditor";
import { ExtrasEditor } from "./ExtrasEditor";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PricingOptions } from "./product/PricingOptions";
import type { PricingConfig } from "@/types/pricing";

interface ProductDetailsProps {
  title: string;
  description: string;
  image: string;
  price: number;
  onClose: () => void;
}

export const ProductDetails = ({ 
  title, 
  description, 
  image, 
  price, 
  onClose 
}: ProductDetailsProps) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showIngredientsEditor, setShowIngredientsEditor] = useState(false);
  const [showExtrasEditor, setShowExtrasEditor] = useState(false);
  const [ingredients, setIngredients] = useState([
    { name: "Tomato Sauce Base", checked: true },
    { name: "Hot Honey ( Spicy)", checked: true },
    { name: "Parmesan Cheese", checked: true },
    { name: "Cheese (Pizza Type)", checked: true },
    { name: "Pepperoni ( Spicy)", checked: true }
  ]);

  const handleIngredientToggle = (ingredientName: string) => {
    setIngredients(ingredients.map(ingredient => 
      ingredient.name === ingredientName 
        ? { ...ingredient, checked: !ingredient.checked }
        : ingredient
    ));
  };

  const { data: productPricing } = useQuery({
    queryKey: ['product-pricing', title],
    queryFn: async () => {
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('title', title)
        .single();

      if (!products?.id) return null;

      const { data: pricing } = await supabase
        .from('product_pricing')
        .select(`
          *,
          pricing_strategies (
            id,
            name,
            type,
            config
          )
        `)
        .eq('product_id', products.id)
        .single();

      return pricing;
    },
    enabled: !!title
  });

  return (
    <>
      <div className="animate-slide-in-right h-full flex flex-col">
        <div className="flex-1 overflow-auto">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
            <div className="aspect-square w-full">
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-[#2D3648]">{title}</h2>
              <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                Gluten Free
              </span>
            </div>
            <p className="text-gray-600 mb-6">{description}</p>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-[#2D3648]">Options</h3>
              {productPricing?.pricing_strategies && (
                <PricingOptions
                  strategy={productPricing.pricing_strategies}
                  config={productPricing.config as PricingConfig}
                  selectedSize={selectedSize}
                  onSizeSelect={setSelectedSize}
                  defaultPrice={price}
                />
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 mt-auto">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowExtrasEditor(true)}
              className="py-3 px-4 text-[#2D3648] border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              Add Extras
            </button>
            <button 
              onClick={() => setShowIngredientsEditor(true)}
              className="py-3 px-4 text-[#2D3648] border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              Edit Ingredients
            </button>
          </div>
        </div>
      </div>

      <IngredientsEditor
        isOpen={showIngredientsEditor}
        onClose={() => setShowIngredientsEditor(false)}
        onIngredientToggle={handleIngredientToggle}
        ingredients={ingredients}
      />

      <ExtrasEditor
        isOpen={showExtrasEditor}
        onClose={() => setShowExtrasEditor(false)}
      />
    </>
  );
};