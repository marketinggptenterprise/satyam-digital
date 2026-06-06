export interface Category {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Original Price (MRP)
  categoryId: string;
  brandId: string;
  image: string;
  images?: string[]; // Support up to 5 images
  inStock?: boolean;
  isFeatured?: boolean;
  discountPercent?: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  link: string;
}

export interface StoreData {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  banners: Banner[];
}