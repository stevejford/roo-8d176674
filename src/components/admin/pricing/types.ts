import { Json } from "@/integrations/supabase/types";
import type { CategoryPricing, PricingConfig } from "@/types/pricing/interfaces";
import { Database } from '@/integrations/supabase/types';

export type CategoryPricingRow = Database['public']['Tables']['category_pricing']['Row'] & {
  pricing_strategies: Database['public']['Tables']['pricing_strategies']['Row']
};

export interface DebugSectionProps {
  category: any;
  existingPricing: CategoryPricingRow | null;
  config: PricingConfig;
}

export interface IngredientsState {
  name: string;
  checked: boolean;
}