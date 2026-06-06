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

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  link: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: string;
}

export interface StoreData {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  banners: Banner[];
  orders: Order[];
}