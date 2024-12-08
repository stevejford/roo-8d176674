import React, { useEffect, useRef } from "react";
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
    const resizeRef = useRef<ResizeObserver>();

    useEffect(() => {
      // Cleanup previous observer
      return () => {
        if (resizeRef.current) {
          resizeRef.current.disconnect();
        }
      };
    }, []);

    // Add more detailed debug logs
    console.log('CategorySection Render:', {
      category,
      isPopularCategory,
      totalProducts: products.length,
      productsData: products,
      popularProducts: products.filter(product => product.is_popular)
    });

    // Filter products for Popular category
    const displayProducts = isPopularCategory 
      ? products.filter(product => {
          console.log('Checking product for popular:', product.title, 'is_popular:', product.is_popular);
          return product.is_popular === true;
        })
      : products;

    console.log('Final display products:', displayProducts);

    // Don't render the section if it's the Popular category and there are no popular products
    if (isPopularCategory && displayProducts.length === 0) {
      console.log('Skipping Popular category render - no popular products');
      return null;
    }

    return (
      <div ref={ref} className="scroll-mt-24">
        <h3 className="text-2xl font-bold text-primary-title mb-6">
          {category}
        </h3>
        <div className={`grid gap-6 ${
          isSpecialsCategory 
            ? isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }`}>
          {displayProducts.map((item) => (
            isSpecialsCategory ? (
              <SpecialCard
                key={item.id}
                title={item.title}
                price={item.price || 24.00}
                description={item.description || ''}
                image={item.image_url || '/placeholder.svg'}
                onClick={() => onProductSelect({
                  title: item.title,
                  description: item.description || '',
                  image: item.image_url || '/placeholder.svg'
                })}
              />
            ) : (
              <MenuCard 
                key={item.id}
                title={item.title}
                price={item.price || 24.00}
                description={item.description || ''}
                image={item.image_url || '/placeholder.svg'}
                onClick={() => onProductSelect({
                  title: item.title,
                  description: item.description || '',
                  image: item.image_url || '/placeholder.svg'
                })}
              />
            )
          ))}
        </div>
      </div>
    );
  }
);

CategorySection.displayName = 'CategorySection';