import { useState, useEffect } from 'react';
import { StoreData, Product, Category, Brand, Banner } from '../types/store';

const STORAGE_KEY = 'satyam_digital_store_data_v2';

const initialData: StoreData = {
  products: [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      description: 'The latest flagship from Apple with Titanium design.',
      price: 129900,
      categoryId: 'mobiles',
      brandId: 'apple',
      image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: '2',
      name: 'Samsung Neo QLED 4K',
      description: 'Experience stunning 4K resolution with Quantum Mini LEDs.',
      price: 85000,
      categoryId: 'electronics',
      brandId: 'samsung',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800'
    }
  ],
  categories: [
    { id: 'mobiles', name: 'Mobiles' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'appliances', name: 'Home Appliances' }
  ],
  brands: [
    { id: 'apple', name: 'Apple' },
    { id: 'samsung', name: 'Samsung' },
    { id: 'lg', name: 'LG' },
    { id: 'sony', name: 'Sony' }
  ],
  banners: [
    {
      id: '1',
      title: 'Upgrade Your Digital Life',
      subtitle: 'Get up to 40% off on latest smartphones and home appliances.',
      badge: 'FESTIVAL SALE IS LIVE',
      image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800',
      link: '#'
    },
    {
      id: '2',
      title: 'Smart TV Revolution',
      subtitle: 'Cinematic experience at your home with Neo QLED technology.',
      badge: 'NEW ARRIVAL',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
      link: '#'
    }
  ]
};

export function useStore() {
  const [data, setData] = useState<StoreData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setData(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  };

  const deleteProduct = (id: string) => {
    setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
  };

  const addCategory = (name: string) => {
    const newCategory = { id: name.toLowerCase().replace(/\s+/g, '-'), name };
    setData(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
  };

  const addBrand = (name: string) => {
    const newBrand = { id: name.toLowerCase().replace(/\s+/g, '-'), name };
    setData(prev => ({ ...prev, brands: [...prev.brands, newBrand] }));
  };

  const addBanner = (banner: Omit<Banner, 'id'>) => {
    const newBanner = { ...banner, id: Date.now().toString() };
    setData(prev => ({ ...prev, banners: [...prev.banners, newBanner] }));
  };

  const deleteBanner = (id: string) => {
    setData(prev => ({ ...prev, banners: prev.banners.filter(b => b.id !== id) }));
  };

  return {
    ...data,
    addProduct,
    deleteProduct,
    addCategory,
    addBrand,
    addBanner,
    deleteBanner
  };
}