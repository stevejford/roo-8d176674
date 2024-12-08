export interface PricingConfig {
  price?: number;
  sizes?: Array<{
    name: string;
    price: number;
  }>;
  portions?: Array<{
    name: string;
    price: number;
  }>;
  options?: Array<{
    name: string;
    price: number;
  }>;
  volumes?: Array<{
    name: string;
    price: number;
  }>;
}