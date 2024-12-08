import { Json } from "@/integrations/supabase/types";
import type { CategoryPricing } from "@/types/pricing/interfaces";

export interface DebugSectionProps {
  category: any;
  existingPricing: CategoryPricing | null;
  config: Json;
}