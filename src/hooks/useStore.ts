import { useState, useEffect } from 'react';
import { StoreData, Product, Category, Brand, Banner, Order, OrderStatus } from '../types/store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { showSuccess, showError } from '../utils/toast';

const STORAGE_KEY = 'satyam_digital_store_data_v3';

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
  ],
  orders: [
    { 
      id: 'ORD-7281', 
      customerEmail: 'admin@example.com', 
      customerName: 'John Doe', 
      date: '2024-03-15', 
      total: 129900, 
      status: 'Delivered', 
      items: 'iPhone 15 Pro' 
    },
    { 
      id: 'ORD-6542', 
      customerEmail: 'user@example.com', 
      customerName: 'Jane Smith', 
      date: '2024-02-28', 
      total: 2450, 
      status: 'Processing', 
      items: 'Samsung Case, Cable' 
    }
  ]
};

export function useStore() {
  const [data, setData] = useState<StoreData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  // Fetch data from Supabase on mount if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchAllData = async () => {
      try {
        const [
          { data: productsData, error: pErr },
          { data: categoriesData, error: cErr },
          { data: brandsData, error: bErr },
          { data: bannersData, error: banErr },
          { data: ordersData, error: oErr }
        ] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('categories').select('*'),
          supabase.from('brands').select('*'),
          supabase.from('banners').select('*'),
          supabase.from('orders').select('*')
        ]);

        // If tables don't exist yet, we'll gracefully fall back to local storage
        if (pErr || cErr || bErr || banErr || oErr) {
          console.warn("Supabase tables might not be created yet. Falling back to local storage.");
          return;
        }

        setData({
          products: productsData || [],
          categories: categoriesData || [],
          brands: brandsData || [],
          banners: bannersData || [],
          orders: ordersData || []
        });
      } catch (err) {
        console.error("Error fetching from Supabase:", err);
      }
    };

    fetchAllData();
  }, []);

  // Save to local storage as a secondary backup
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    
    // Optimistic update
    setData(prev => ({ ...prev, products: [...prev.products, newProduct] }));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase insert error:", err);
        showError("Failed to sync product to cloud database.");
      }
    }
  };

  const deleteProduct = async (id: string) => {
    // Optimistic update
    setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase delete error:", err);
        showError("Failed to delete product from cloud database.");
      }
    }
  };

  const addCategory = async (name: string) => {
    const newCategory = { id: name.toLowerCase().replace(/\s+/g, '-'), name };
    
    // Optimistic update
    setData(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('categories').insert([newCategory]);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase category insert error:", err);
      }
    }
  };

  const addBrand = async (name: string) => {
    const newBrand = { id: name.toLowerCase().replace(/\s+/g, '-'), name };
    
    // Optimistic update
    setData(prev => ({ ...prev, brands: [...prev.brands, newBrand] }));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('brands').insert([newBrand]);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase brand insert error:", err);
      }
    }
  };

  const addBanner = async (banner: Omit<Banner, 'id'>) => {
    const newBanner = { ...banner, id: Date.now().toString() };
    
    // Optimistic update
    setData(prev => ({ ...prev, banners: [...prev.banners, newBanner] }));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('banners').insert([newBanner]);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase banner insert error:", err);
      }
    }
  };

  const deleteBanner = async (id: string) => {
    // Optimistic update
    setData(prev => ({ ...prev, banners: prev.banners.filter(b => b.id !== id) }));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('banners').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase banner delete error:", err);
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Optimistic update
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase order update error:", err);
      }
    }
  };

  return {
    ...data,
    addProduct,
    deleteProduct,
    addCategory,
    addBrand,
    addBanner,
    deleteBanner,
    updateOrderStatus
  };
}