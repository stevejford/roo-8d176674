import React from "react";
import { CategorySection } from "./CategorySection";
import type { Database } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];

interface MainContentProps {
  categories: any[];
  productsByCategory: { [key: string]: Product[] };
  categoryRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  onProductSelect: (product: { title: string; description: string; image: string }) => void;
}

export const MainContent = ({ 
  categories, 
  productsByCategory, 
  categoryRefs, 
  onProductSelect 
}: MainContentProps) => {
  return (
    <div className="space-y-12 px-4">
      {categories.map((category) => (
        <CategorySection
          key={category.id}
          ref={el => categoryRefs.current[category.title] = el}
          category={category.title}
          products={productsByCategory[category.id] || []}
          onProductSelect={onProductSelect}
        />
      ))}
    </div>
  );
};