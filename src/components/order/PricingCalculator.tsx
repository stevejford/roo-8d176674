import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PricingConfig } from "@/types/pricing";

interface PricingCalculatorProps {
  product: {
    title: string;
    price: number;
    category_id?: string;
  } | null;
}

export const usePricingCalculator = ({ product }: PricingCalculatorProps) => {
  // Fetch category pricing if product has a category
  const { data: categoryPricing } = useQuery({
    queryKey: ['category-pricing', product?.category_id],
    queryFn: async () => {
      if (!product?.category_id) return null;
      
      console.log("Fetching category pricing for category:", product.category_id);
      
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
        .eq('category_id', product.category_id)
        .single();
      
      if (error) {
        console.error("Error fetching category pricing:", error);
        throw error;
      }
      
      console.log("Category pricing data:", data);
      return data;
    },
    enabled: !!product?.category_id
  });

  // Fetch product pricing override if it exists
  const { data: productPricing } = useQuery({
    queryKey: ['product-pricing', product?.title],
    queryFn: async () => {
      if (!product?.title) return null;
      
      console.log("Fetching product pricing for:", product.title);
      
      // First get the product ID
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('id')
        .eq('title', product.title)
        .limit(1);

      if (productError) {
        console.error("Error fetching product:", productError);
        throw productError;
      }
      
      if (!products?.length) return null;

      // Then get the pricing data
      const { data: pricing, error: pricingError } = await supabase
        .from('product_pricing')
        .select(`
          *,
          pricing_strategies (*)
        `)
        .eq('product_id', products[0].id)
        .limit(1);

      if (pricingError) {
        console.error("Error fetching product pricing:", pricingError);
        throw pricingError;
      }
      
      console.log("Product pricing data:", pricing?.[0]);
      return pricing?.[0] || null;
    },
    enabled: !!product?.title
  });

  const calculatePrice = () => {
    if (!product) return 0;
    
    console.log("Calculating price for:", product.title);
    console.log("Product base price:", product.price);
    console.log("Product pricing override:", productPricing);
    console.log("Category pricing:", categoryPricing);

    // Check for product-specific pricing override
    if (productPricing?.is_override) {
      const strategy = productPricing.pricing_strategies;
      const config = productPricing.config as PricingConfig;
      
      console.log("Using product pricing override with strategy:", strategy?.type);

      switch (strategy?.type) {
        case 'simple':
          return config.price || product.price;
        case 'size_based':
          return config.sizes?.[0]?.price || product.price;
        case 'portion_based':
          return config.portions?.[0]?.price || product.price;
        case 'selection_based':
          return config.options?.[0]?.price || product.price;
        case 'volume_based':
          return config.volumes?.[0]?.price || product.price;
        default:
          return product.price;
      }
    }

    // Use category pricing if available
    if (categoryPricing?.pricing_strategies) {
      const strategy = categoryPricing.pricing_strategies;
      const config = categoryPricing.config as PricingConfig;
      
      console.log("Using category pricing with strategy:", strategy.type);

      switch (strategy.type) {
        case 'simple':
          return config.price || product.price;
        case 'size_based':
          return config.sizes?.[0]?.price || product.price;
        case 'portion_based':
          return config.portions?.[0]?.price || product.price;
        case 'selection_based':
          return config.options?.[0]?.price || product.price;
        case 'volume_based':
          return config.volumes?.[0]?.price || product.price;
        default:
          return product.price;
      }
    }

    // Fallback to product's default price
    console.log("Using product default price:", product.price);
    return product.price;
  };

  return {
    calculatedPrice: calculatePrice(),
    categoryPricing,
    productPricing
  };
};