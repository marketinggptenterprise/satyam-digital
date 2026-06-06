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
  price: number;
  categoryId: string;
  brandId: string;
  image: string;
}

export interface StoreData {
  products: Product[];
  categories: Category[];
  brands: Brand[];
}