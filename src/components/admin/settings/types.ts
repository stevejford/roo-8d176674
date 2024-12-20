import { Json } from "@/integrations/supabase/types";

export interface ServiceTimingFormData {
  take_order_minutes: number;
  check_table_minutes: number;
  suggest_drinks_minutes: number;
  suggest_dessert_minutes: number;
  cleanup_after_minutes: number;
  clear_appetizer_minutes: number;
  clear_main_minutes: number;
  clear_dessert_minutes: number;
}

export interface BillSplittingConfig {
  enabled: boolean;
  max_splits: number;
  min_amount_per_split: number;
  allow_uneven_splits: boolean;
}

export interface StoreSettingsResponse {
  id: string;
  service_timings: ServiceTimingFormData;
  store_name: string;
  address: string;
  created_at?: string;
  updated_at?: string;
  bill_splitting_config: BillSplittingConfig;
}