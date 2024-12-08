export interface Product {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category_id: string | null;
  sizes: any | null;
  active: boolean | null;
  position: number | null;
  created_at: string | null;
  updated_at: string | null;
  is_popular: boolean | null;
  is_complementary: boolean | null;
  price: number | null;
  price_override: boolean | null;
}

export interface Category {
  id: string;
  title: string;
}