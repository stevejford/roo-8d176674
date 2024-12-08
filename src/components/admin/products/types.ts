export interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category_id: string | null;
  is_popular: boolean;
  is_complementary: boolean;
  price: number;
  price_override: boolean;
}

export interface Category {
  id: string;
  title: string;
}