import { Json } from "@/integrations/supabase/types";

export interface PricingItem {
  name: string;
  price: number;
}

export interface PricingConfig {
  price?: number;
  sizes?: PricingItem[];
  portions?: PricingItem[];
  options?: PricingItem[];
  volumes?: PricingItem[];
}

export interface PricingStrategy {
  id: string;
  name: string;
  type: string;
  config: PricingConfig;
  created_at?: string;
  updated_at?: string;
  preview_config?: Json;
  preview_enabled?: boolean;
}

export interface BasePricing {
  id: string;
  strategy_id: string;
  config: PricingConfig;
  created_at?: string;
  updated_at?: string;
  pricing_strategies: PricingStrategy;
}

export interface CategoryPricing extends BasePricing {
  category_id: string;
}

export interface ProductPricing extends BasePricing {
  product_id: string;
  is_override?: boolean;
}