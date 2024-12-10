export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: string
          position: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          position?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          position?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      category_pricing: {
        Row: {
          category_id: string
          config: Json
          created_at: string | null
          id: string
          ingredients: Json | null
          strategy_id: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          config?: Json
          created_at?: string | null
          id?: string
          ingredients?: Json | null
          strategy_id: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          config?: Json
          created_at?: string | null
          id?: string
          ingredients?: Json | null
          strategy_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_pricing_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: true
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_pricing_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "pricing_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          customizations: Json | null
          id: string
          notes: string | null
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
          size: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customizations?: Json | null
          id?: string
          notes?: string | null
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity?: number
          size?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customizations?: Json | null
          id?: string
          notes?: string | null
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
          size?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          order_id: string | null
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          appetizer_cleared_at: string | null
          appetizer_ordered_at: string | null
          appetizer_served_at: string | null
          created_at: string | null
          created_by: string | null
          customer_name: string | null
          deleted_at: string | null
          dessert_cleared_at: string | null
          dessert_ordered_at: string | null
          dessert_served_at: string | null
          dessert_suggested_at: string | null
          drinks_suggested_at: string | null
          food_delivered_at: string | null
          food_ready_at: string | null
          id: string
          last_check_at: string | null
          main_cleared_at: string | null
          main_ordered_at: string | null
          main_served_at: string | null
          notes: string | null
          order_taken_at: string | null
          paid_amount: number | null
          payment_method: string | null
          payment_status: string | null
          seated_at: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          table_number: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          appetizer_cleared_at?: string | null
          appetizer_ordered_at?: string | null
          appetizer_served_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_name?: string | null
          deleted_at?: string | null
          dessert_cleared_at?: string | null
          dessert_ordered_at?: string | null
          dessert_served_at?: string | null
          dessert_suggested_at?: string | null
          drinks_suggested_at?: string | null
          food_delivered_at?: string | null
          food_ready_at?: string | null
          id?: string
          last_check_at?: string | null
          main_cleared_at?: string | null
          main_ordered_at?: string | null
          main_served_at?: string | null
          notes?: string | null
          order_taken_at?: string | null
          paid_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          seated_at?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          table_number?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          appetizer_cleared_at?: string | null
          appetizer_ordered_at?: string | null
          appetizer_served_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_name?: string | null
          deleted_at?: string | null
          dessert_cleared_at?: string | null
          dessert_ordered_at?: string | null
          dessert_served_at?: string | null
          dessert_suggested_at?: string | null
          drinks_suggested_at?: string | null
          food_delivered_at?: string | null
          food_ready_at?: string | null
          id?: string
          last_check_at?: string | null
          main_cleared_at?: string | null
          main_ordered_at?: string | null
          main_served_at?: string | null
          notes?: string | null
          order_taken_at?: string | null
          paid_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          seated_at?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          table_number?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_strategies: {
        Row: {
          config: Json
          created_at: string | null
          id: string
          name: string
          preview_config: Json | null
          preview_enabled: boolean | null
          type: Database["public"]["Enums"]["pricing_strategy_type"]
          updated_at: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          id?: string
          name: string
          preview_config?: Json | null
          preview_enabled?: boolean | null
          type: Database["public"]["Enums"]["pricing_strategy_type"]
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: string
          name?: string
          preview_config?: Json | null
          preview_enabled?: boolean | null
          type?: Database["public"]["Enums"]["pricing_strategy_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      product_pricing: {
        Row: {
          config: Json
          created_at: string | null
          id: string
          is_override: boolean | null
          product_id: string
          strategy_id: string
          updated_at: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          id?: string
          is_override?: boolean | null
          product_id: string
          strategy_id: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: string
          is_override?: boolean | null
          product_id?: string
          strategy_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_pricing_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_pricing_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "pricing_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_complementary: boolean | null
          is_popular: boolean | null
          position: number | null
          price: number | null
          price_override: boolean | null
          sizes: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_complementary?: boolean | null
          is_popular?: boolean | null
          position?: number | null
          price?: number | null
          price_override?: boolean | null
          sizes?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_complementary?: boolean | null
          is_popular?: boolean | null
          position?: number | null
          price?: number | null
          price_override?: boolean | null
          sizes?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          id: string
          last_name: string | null
          last_sign_in_at: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: string | null
        }
        Insert: {
          avatar_url?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          last_sign_in_at?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
        }
        Update: {
          avatar_url?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_sign_in_at?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
        }
        Relationships: []
      }
      store_hours: {
        Row: {
          close_time: string | null
          created_at: string | null
          day_of_week: string
          id: string
          is_closed: boolean | null
          open_time: string | null
          updated_at: string | null
        }
        Insert: {
          close_time?: string | null
          created_at?: string | null
          day_of_week: string
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
          updated_at?: string | null
        }
        Update: {
          close_time?: string | null
          created_at?: string | null
          day_of_week?: string
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          address: string
          bill_splitting_config: Json | null
          created_at: string | null
          id: string
          service_timings: Json | null
          store_name: string
          stripe_secret_key: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          bill_splitting_config?: Json | null
          created_at?: string | null
          id?: string
          service_timings?: Json | null
          store_name: string
          stripe_secret_key?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          bill_splitting_config?: Json | null
          created_at?: string | null
          id?: string
          service_timings?: Json | null
          store_name?: string
          stripe_secret_key?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tables: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          table_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          table_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          table_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_actions: {
        Row: {
          action_details: Json | null
          action_type: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vouchers: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          discount_type: string
          discount_value: number
          id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          discount_type: string
          discount_value: number
          id?: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "delivered"
        | "completed"
        | "cancelled"
      pricing_strategy_type:
        | "simple"
        | "size_based"
        | "portion_based"
        | "selection_based"
        | "volume_based"
      user_role:
        | "admin"
        | "user"
        | "staff"
        | "kitchen"
        | "delivery"
        | "manager"
        | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
