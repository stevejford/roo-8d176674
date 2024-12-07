export interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category_id: string | null;
}

export interface Category {
  id: string;
  title: string;
}