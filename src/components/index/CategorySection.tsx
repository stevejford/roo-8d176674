import React from "react";
import { MenuCard } from "@/components/MenuCard";
import type { Database } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];

interface CategorySectionProps {
  category: string;
  products: Product[];
  onProductSelect: (product: { title: string; description: string; image: string }) => void;
  ref?: React.RefObject<HTMLDivElement>;
}

export const CategorySection = React.forwardRef<HTMLDivElement, CategorySectionProps>(
  ({ category, products, onProductSelect }, ref) => {
    return (
      <div ref={ref} className="scroll-mt-24">
        <h3 className="text-2xl font-bold text-primary-title mb-6">
          {category}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <MenuCard 
              key={item.id}
              title={item.title}
              price={24.00}
              description={item.description || ''}
              image={item.image_url || '/placeholder.svg'}
              onClick={() => onProductSelect({
                title: item.title,
                description: item.description || '',
                image: item.image_url || '/placeholder.svg'
              })}
            />
          ))}
        </div>
      </div>
    );
  }
);

CategorySection.displayName = 'CategorySection';