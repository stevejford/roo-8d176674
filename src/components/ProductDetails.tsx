import React, { useState } from "react";
import { X } from "lucide-react";
import { IngredientsEditor } from "./IngredientsEditor";
import { ExtrasEditor } from "./ExtrasEditor";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PricingOptions } from "./product/PricingOptions";
import { PastaTypeSelector } from "./product/PastaTypeSelector";
import type { PricingConfig } from "@/types/pricing";
import { cn } from "@/lib/utils";

interface ProductDetailsProps {
  title: string;
  description: string;
  image: string;
  price: number;
  category_id?: string;
  onClose: () => void;
}

export const ProductDetails = ({ 
  title, 
  description, 
  image, 
  price,
  category_id,
  onClose 
}: ProductDetailsProps) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showIngredientsEditor, setShowIngredientsEditor] = useState(false);
  const [showExtrasEditor, setShowExtrasEditor] = useState(false);
  const [showPastaTypes, setShowPastaTypes] = useState(false);
  const [selectedPastaType, setSelectedPastaType] = useState<string>("");

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

  // Fetch category pricing
  const { data: categoryPricing } = useQuery({
    queryKey: ['category-pricing', category_id],
    queryFn: async () => {
      if (!category_id) return null;
      
      const { data, error } = await supabase
        .from('category_pricing')
        .select(`
          *,
          pricing_strategies (
            id,
            name,
            type,
            config
          )
        `)
        .eq('category_id', category_id)
        .limit(1);

      if (error && error.code !== 'PGRST116') throw error;
      if (!data?.length) return null;
      
      return data[0];
    },
    enabled: !!category_id
  });

  // Fetch product pricing override
  const { data: productPricing } = useQuery({
    queryKey: ['product-pricing', title],
    queryFn: async () => {
      try {
        const { data: products, error: productError } = await supabase
          .from('products')
          .select('id')
          .eq('title', title)
          .limit(1);

        if (productError) throw productError;
        if (!products?.length) return null;

        const { data: pricing, error: pricingError } = await supabase
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
          .eq('product_id', products[0].id)
          .maybeSingle(); // Use maybeSingle() instead of limit(1)

        if (pricingError && pricingError.code !== 'PGRST116') throw pricingError;
        return pricing || null;
      } catch (error) {
        console.error('Error fetching product pricing:', error);
        return null;
      }
    },
    enabled: !!title
  });

  // Determine pricing strategy
  const pricingStrategy = productPricing?.is_override 
    ? productPricing.pricing_strategies
    : categoryPricing?.pricing_strategies;

  const pricingConfig = productPricing?.is_override
    ? productPricing.config
    : categoryPricing?.config;

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    if (size === "Entrée") {
      setShowPastaTypes(true);
    }
  };

  return (
    <div className="h-full flex flex-col">
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
            {pricingStrategy && pricingConfig && (
              <PricingOptions
                strategy={pricingStrategy}
                config={pricingConfig as PricingConfig}
                selectedSize={selectedSize}
                onSizeSelect={handleSizeSelect}
                defaultPrice={price}
              />
            )}
          </div>
        </div>
      </div>

      <PastaTypeSelector
        isOpen={showPastaTypes}
        selectedType={selectedPastaType}
        onSelect={setSelectedPastaType}
        onClose={() => setShowPastaTypes(false)}
      />

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
    </div>
  );
};