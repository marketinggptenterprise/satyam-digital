"use client";

import { useState, useEffect } from 'react';
import { StoreData, Product, Category, Brand, Banner } from '../types/store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { showError } from '../utils/toast';

const STORAGE_KEY = 'satyam_digital_store_data_v4';

const initialData: StoreData = {
  products: [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      description: 'The latest flagship from Apple with Titanium design.',
      price: 129900,
      categoryId: 'mobiles',
      brandId: 'apple',
      image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800'],
      inStock: true,
      isFeatured: true,
      discountPercent: 10
    },
    {
      id: '2',
      name: 'Samsung Neo QLED 4K',
      description: 'Experience stunning 4K resolution with Quantum Mini LEDs.',
      price: 85000,
      categoryId: 'smart-tv',
      brandId: 'samsung',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800'],
      inStock: true,
      isFeatured: true,
      discountPercent: 15
    },
    {
      id: '3',
      name: 'MacBook Air M3',
      description: 'Incredibly thin and fast laptop from Apple.',
      price: 119000,
      categoryId: 'laptops',
      brandId: 'apple',
      image: 'https://images.unsplash.com/photo-1694709841893-9c8827725514?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1694709841893-9c8827725514?auto=format&fit=crop&q=80&w=800'],
      inStock: true,
      isFeatured: false
    },
    {
      id: '4',
      name: 'Sony WH-1000XM5',
      description: 'Industry-leading noise canceling headphones.',
      price: 28000,
      categoryId: 'accessories',
      brandId: 'sony',
      image: 'https://images.unsplash.com/photo-1621370729790-2e3d3e6c3f0b?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1621370729790-2e3d3e6c3f0b?auto=format&fit=crop&q=80&w=800'],
      inStock: true,
      isFeatured: false
    },
    {
      id: '5',
      name: 'LG Smart Refrigerator',
      description: 'Large capacity smart refrigerator with InstaView Door-in-Door.',
      price: 95000,
      categoryId: 'appliances',
      brandId: 'lg',
      image: 'https://images.unsplash.com/photo-1563229977-3e1b7f0c1c4f?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1563229977-3e1b7f0c1c4f?auto=format&fit=crop&q=80&w=800'],
      inStock: true,
      isFeatured: false
    },
    {
      id: '6',
      name: 'Apple Watch Series 9',
      description: 'Advanced health and fitness features in a sleek design.',
      price: 41900,
      categoryId: 'watches',
      brandId: 'apple',
      image: 'https://images.unsplash.com/photo-1698299292864-d922a901e188?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1698299292864-d922a901e188?auto=format&fit=crop&q=80&w=800'],
      inStock: true,
      isFeatured: false
    }
  ],
  categories: [
    { id: 'mobiles', name: 'Mobiles' },
    { id: 'laptops', name: 'Laptops' },
    { id: 'smart-tv', name: 'Smart TV' },
    { id: 'appliances', name: 'Appliances' },
    { id: 'watches', name: 'Watches' },
    { id: 'accessories', name: 'Accessories' }
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
      link: '/?q=offer'
    },
    {
      id: '2',
      title: 'Smart TV Revolution',
      subtitle: 'Cinematic experience at your home with Neo QLED technology.',
      badge: 'NEW ARRIVAL',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
      link: '/?cat=smart-tv'
    }
  ]
};

export function useStore() {
  const [data, setData] = useState<StoreData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchAllData = async () => {
      try {
        const [
          { data: productsData, error: pErr },
          { data: categoriesData, error: cErr },
          { data: brandsData, error: bErr },
          { data: bannersData, error: banErr }
        ] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('categories').select('*'),
          supabase.from('brands').select('*'),
          supabase.from('banners').select('*')
        ]);

        if (pErr || cErr || bErr || banErr) return;

        setData({
          products: productsData ? productsData.map(p => ({ ...p, images: p.images || [] })) : [],
          categories: categoriesData || [],
          brands: brandsData || [],
          banners: bannersData || []
        });
      } catch (err) {
        console.error("Error fetching from Supabase:", err);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setData(prev => ({ ...prev, products: [...prev.products, newProduct] }));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').insert([newProduct]);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    }));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').update(updatedProduct).eq('id', updatedProduct.id);
    }
  };

  const deleteProduct = async (id: string) => {
    setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').delete().eq('id', id);
    }
  };

  const addCategory = async (name: string) => {
    const newCategory = { id: name.toLowerCase().replace(/\s+/g, '-'), name };
    setData(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').insert([newCategory]);
    }
  };

  const updateCategory = async (updatedCategory: Category) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === updatedCategory.id ? updatedCategory : c)
    }));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').update(updatedCategory).eq('id', updatedCategory.id);
    }
  };

  const deleteCategory = async (id: string) => {
    setData(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== id) }));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').delete().eq('id', id);
    }
  };

  const addBrand = async (name: string) => {
    const newBrand = { id: name.toLowerCase().replace(/\s+/g, '-'), name };
    setData(prev => ({ ...prev, brands: [...prev.brands, newBrand] }));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('brands').insert([newBrand]);
    }
  };

  const updateBrand = async (updatedBrand: Brand) => {
    setData(prev => ({
      ...prev,
      brands: prev.brands.map(b => b.id === updatedBrand.id ? updatedBrand : b)
    }));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('brands').update(updatedBrand).eq('id', updatedBrand.id);
    }
  };

  const deleteBrand = async (id: string) => {
    setData(prev => ({ ...prev, brands: prev.brands.filter(b => b.id !== id) }));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('brands').delete().eq('id', id);
    }
  };

  const addBanner = async (banner: Omit<Banner, 'id'>) => {
    const newBanner = { ...banner, id: Date.now().toString() };
    setData(prev => ({ ...prev, banners: [...prev.banners, newBanner] }));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('banners').insert([newBanner]);
    }
  };

  const updateBanner = async (updatedBanner: Banner) => {
    setData(prev => ({
      ...prev,
      banners: prev.banners.map(b => b.id === updatedBanner.id ? updatedBanner : b)
    }));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('banners').update(updatedBanner).eq('id', updatedBanner.id);
    }
  };

  const deleteBanner = async (id: string) => {
    setData(prev => ({ ...prev, banners: prev.banners.filter(b => b.id !== id) }));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('banners').delete().eq('id', id);
    }
  };

  return {
    ...data,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addBrand,
    updateBrand,
    deleteBrand,
    addBanner,
    updateBanner,
    deleteBanner
  };
}