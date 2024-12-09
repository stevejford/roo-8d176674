import React from "react";
import { CategorySection } from "./CategorySection";
import type { Database } from "@/integrations/supabase/types";
import { useIsMobile } from "@/hooks/use-mobile";

type Product = Database['public']['Tables']['products']['Row'];

interface MainContentProps {
  categories: any[];
  productsByCategory: { [key: string]: Product[] };
  categoryRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  onProductSelect: (product: { title: string; description: string; image: string; price: number; category_id?: string }) => void;
}

export const MainContent = ({ 
  categories, 
  productsByCategory, 
  categoryRefs, 
  onProductSelect 
}: MainContentProps) => {
  const isMobile = useIsMobile();
  
  // Get all products across all categories
  const allProducts = Object.values(productsByCategory).flat();
  
  // Add Popular category at the beginning if there are popular products
  const popularProducts = allProducts.filter(product => product.is_popular);
  const displayCategories = popularProducts.length > 0 
    ? [{ id: 'popular', title: 'Popular' }, ...categories]
    : categories;

  return (
    <div className="relative">
      <div className="px-4 mx-auto xl:mr-[400px]">
        <div className="space-y-12">
          {displayCategories.map((category) => (
            <CategorySection
              key={category.id}
              ref={el => categoryRefs.current[category.title] = el}
              category={category.title}
              products={category.id === 'popular' ? popularProducts : (productsByCategory[category.id] || [])}
              onProductSelect={onProductSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};