import React from "react";
import { MenuCard } from "@/components/MenuCard";
import { SpecialCard } from "./SpecialCard";
import type { Database } from "@/integrations/supabase/types";
import { useIsMobile } from "@/hooks/use-mobile";

type Product = Database['public']['Tables']['products']['Row'];

interface CategorySectionProps {
  category: string;
  products: Product[];
  onProductSelect: (product: { title: string; description: string; image: string }) => void;
  ref?: React.RefObject<HTMLDivElement>;
}

export const CategorySection = React.forwardRef<HTMLDivElement, CategorySectionProps>(
  ({ category, products, onProductSelect }, ref) => {
    const isSpecialsCategory = category.toLowerCase() === "specials";
    const isPopularCategory = category.toLowerCase() === "popular";
    const isMobile = useIsMobile();

    const displayProducts = isPopularCategory 
      ? products.filter(product => product.is_popular)
      : products;

    if (isPopularCategory && displayProducts.length === 0) {
      return null;
    }

    const gridClassName = `grid gap-6 ${
      isSpecialsCategory 
        ? isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }`;

    return (
      <div ref={ref} className="scroll-mt-24">
        <h3 className="text-2xl font-bold text-primary-title mb-6">
          {category}
        </h3>
        <div 
          className={gridClassName}
          style={{ 
            contain: 'content',
            contentVisibility: 'auto'
          }}
        >
          {displayProducts.map((product) => (
            <div key={product.id} style={{ contain: 'layout' }}>
              {isSpecialsCategory ? (
                <SpecialCard
                  title={product.title}
                  price={product.price || 24.00}
                  description={product.description || ''}
                  image={product.image_url || '/placeholder.svg'}
                  onClick={() => onProductSelect({
                    title: product.title,
                    description: product.description || '',
                    image: product.image_url || '/placeholder.svg'
                  })}
                />
              ) : (
                <MenuCard 
                  product={product}
                  onClick={() => onProductSelect({
                    title: product.title,
                    description: product.description || '',
                    image: product.image_url || '/placeholder.svg'
                  })}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CategorySection.displayName = 'CategorySection';