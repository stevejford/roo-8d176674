import React from "react";
import { MenuCard } from "@/components/MenuCard";
import { SpecialCard } from "./SpecialCard";
import type { Database } from "@/integrations/supabase/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Product = Database['public']['Tables']['products']['Row'];

interface PricingConfig {
  price?: number;
  sizes?: Array<{ price: number }>;
  portions?: Array<{ price: number }>;
  options?: Array<{ price: number }>;
  volumes?: Array<{ price: number }>;
}

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

    // Fetch category pricing
    const { data: categoryPricing } = useQuery({
      queryKey: ['category-pricing', products[0]?.category_id],
      queryFn: async () => {
        if (!products[0]?.category_id) return null;
        
        const { data, error } = await supabase
          .from('category_pricing')
          .select(`
            *,
            pricing_strategies (*)
          `)
          .eq('category_id', products[0].category_id);
        
        if (error) throw error;
        return data?.[0] || null;
      },
      enabled: !!products[0]?.category_id,
    });

    // Fetch product pricing overrides
    const { data: productPricingMap } = useQuery({
      queryKey: ['product-pricing', products.map(p => p.id)],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('product_pricing')
          .select(`
            *,
            pricing_strategies (*)
          `)
          .in('product_id', products.map(p => p.id));
        
        if (error) throw error;
        
        // Convert to map for easier lookup
        return data.reduce((acc, pricing) => {
          acc[pricing.product_id] = pricing;
          return acc;
        }, {} as Record<string, any>);
      },
      enabled: products.length > 0,
    });

    const calculatePrice = (product: Product) => {
      // Check for product-specific pricing override
      const productPricing = productPricingMap?.[product.id];
      if (productPricing?.is_override) {
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

      // Use category pricing if available
      if (categoryPricing?.pricing_strategies) {
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
      return product.price || 0;
    };

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
                price={calculatePrice(item)}
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
                price={calculatePrice(item)}
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