import React, { useState } from "react";
import { IngredientsEditor } from "./IngredientsEditor";
import { ExtrasEditor } from "./ExtrasEditor";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PastaTypeSelector } from "./product/PastaTypeSelector";
import { ProductHeader } from "./product/ProductHeader";
import { ProductInfo } from "./product/ProductInfo";
import { ProductActions } from "./product/ProductActions";
import type { CategoryPricing, ProductPricing, PricingConfig } from "@/types/pricing/interfaces";

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
  const { data: categoryPricing } = useQuery<CategoryPricing | null>({
    queryKey: ['category-pricing', category_id],
    queryFn: async () => {
      if (!category_id) return null;
      
      const { data, error } = await supabase
        .from('category_pricing')
        .select(`
          *,
          pricing_strategies (*)
        `)
        .eq('category_id', category_id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data as CategoryPricing;
    },
    enabled: !!category_id
  });

  // Fetch product pricing override
  const { data: productPricing } = useQuery<ProductPricing | null>({
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
            pricing_strategies (*)
          `)
          .eq('product_id', products[0].id)
          .maybeSingle();

        if (pricingError && pricingError.code !== 'PGRST116') throw pricingError;
        return pricing as ProductPricing;
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
        <ProductHeader 
          title={title}
          image={image}
          onClose={onClose}
        />

        <ProductInfo
          title={title}
          description={description}
          pricingStrategy={pricingStrategy}
          pricingConfig={pricingConfig}
          selectedSize={selectedSize}
          onSizeSelect={handleSizeSelect}
          defaultPrice={price}
        />
      </div>

      <PastaTypeSelector
        isOpen={showPastaTypes}
        selectedType={selectedPastaType}
        onSelect={setSelectedPastaType}
        onClose={() => setShowPastaTypes(false)}
      />

      <ProductActions
        onShowExtras={() => setShowExtrasEditor(true)}
        onShowIngredients={() => setShowIngredientsEditor(true)}
      />

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