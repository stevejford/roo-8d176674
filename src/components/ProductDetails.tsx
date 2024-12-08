import React, { useState } from "react";
import { X } from "lucide-react";
import { IngredientsEditor } from "./IngredientsEditor";
import { ExtrasEditor } from "./ExtrasEditor";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PricingOptions } from "./product/PricingOptions";
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
  
  const pastaTypes = [
    { name: "Gnocchi", price: 0 },
    { name: "Spaghetti", price: 0 },
    { name: "Spiral", price: 0 },
    { name: "Gluten Free Penne", price: 2.00 },
    { name: "Fettuccine", price: 0 },
  ];

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

  // First get category pricing
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

  // Then get product pricing override if it exists
  const { data: productPricing } = useQuery({
    queryKey: ['product-pricing', title],
    queryFn: async () => {
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
        .limit(1);

      if (pricingError) throw pricingError;
      return pricing?.[0] || null;
    },
    enabled: !!title
  });

  // Determine which pricing strategy to use
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

      {/* Pasta Types Selection */}
      <div className={cn(
        "fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 transform transition-transform duration-300 ease-in-out",
        showPastaTypes ? "translate-y-0" : "translate-y-full"
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
                    setSelectedPastaType(pasta.name);
                    setShowPastaTypes(false);
                  }}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                    selectedPastaType === pasta.name
                      ? "border-[#E86452] bg-[#E86452]"
                      : "border-gray-300"
                  )}
                >
                  {selectedPastaType === pasta.name && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </button>
              </div>
            ))}
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