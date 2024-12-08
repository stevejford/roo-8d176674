export interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category_id: string | null;
  is_popular: boolean;
  is_complementary: boolean;
  price: number;
  position?: number | null;
}

export interface Category {
  id: string;
  title: string;
  position?: number | null;
  created_at?: string;
  updated_at?: string;
}