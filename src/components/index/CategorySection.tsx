import React from "react";
import { MenuCard } from "@/components/MenuCard";
import { SpecialCard } from "./SpecialCard";
import type { Database } from "@/integrations/supabase/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCategoryPricing } from "@/hooks/useCategoryPricing";
import { useProductPricing } from "@/hooks/useProductPricing";

type Product = Database['public']['Tables']['products']['Row'];

interface CategorySectionProps {
  category: string;
  products: Product[];
  onProductSelect: (product: { title: string; description: string; image: string; price: number }) => void;
  ref?: React.RefObject<HTMLDivElement>;
}

export const CategorySection = React.forwardRef<HTMLDivElement, CategorySectionProps>(
  ({ category, products, onProductSelect }, ref) => {
    const isSpecialsCategory = category.toLowerCase() === "specials";
    const isPopularCategory = category.toLowerCase() === "popular";
    const isMobile = useIsMobile();

    // Fetch category pricing only if not in Popular category
    const { data: categoryPricing } = useCategoryPricing(
      !isPopularCategory ? products[0]?.category_id : null
    );

    // Fetch product pricing overrides
    const { data: productPricingMap } = useProductPricing(products);

    const calculatePrice = (product: Product) => {
      console.log('Calculating price for product:', product.title);
      
      // First check for product-specific pricing override
      const productPricing = productPricingMap?.[product.id];
      if (productPricing?.is_override) {
        console.log('Using product pricing override');
        const strategy = productPricing.pricing_strategies;
        const config = productPricing.config as PricingConfig;

        switch (strategy?.type) {
          case 'simple':
            return config.price || product.price || 0;
          case 'size_based':
            return config.sizes?.[0]?.price || product.price || 0;
          case 'portion_based':
            return config.portions?.[0]?.price || product.price || 0;
          case 'selection_based':
            return config.options?.[0]?.price || product.price || 0;
          case 'volume_based':
            return config.volumes?.[0]?.price || product.price || 0;
          default:
            return product.price || 0;
        }
      }

      // For popular items, use their default price if no override exists
      if (isPopularCategory) {
        console.log('Using default price for popular item');
        return product.price || 0;
      }

      // Use category pricing if available
      if (categoryPricing?.pricing_strategies) {
        console.log('Using category pricing');
        const strategy = categoryPricing.pricing_strategies;
        const config = categoryPricing.config as PricingConfig;

        switch (strategy.type) {
          case 'simple':
            return config.price || product.price || 0;
          case 'size_based':
            return config.sizes?.[0]?.price || product.price || 0;
          case 'portion_based':
            return config.portions?.[0]?.price || product.price || 0;
          case 'selection_based':
            return config.options?.[0]?.price || product.price || 0;
          case 'volume_based':
            return config.volumes?.[0]?.price || product.price || 0;
          default:
            return product.price || 0;
        }
      }

      // Fallback to product's default price
      console.log('Using product default price');
      return product.price || 0;
    };

    // Filter products for Popular category
    const displayProducts = isPopularCategory 
      ? products.filter(product => product.is_popular)
      : products;

    // Don't render the section if it's the Popular category and there are no popular products
    if (isPopularCategory && displayProducts.length === 0) {
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
          {displayProducts.map((item) => {
            const price = calculatePrice(item);
            console.log('Final price for', item.title, ':', price); // Debug log
            return isSpecialsCategory ? (
              <SpecialCard
                key={item.id}
                title={item.title}
                price={price}
                description={item.description || ''}
                image={item.image_url || '/placeholder.svg'}
                onClick={() => onProductSelect({
                  title: item.title,
                  description: item.description || '',
                  image: item.image_url || '/placeholder.svg',
                  price
                })}
              />
            ) : (
              <MenuCard 
                key={item.id}
                title={item.title}
                price={price}
                description={item.description || ''}
                image={item.image_url || '/placeholder.svg'}
                onClick={() => onProductSelect({
                  title: item.title,
                  description: item.description || '',
                  image: item.image_url || '/placeholder.svg',
                  price
                })}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

CategorySection.displayName = 'CategorySection';