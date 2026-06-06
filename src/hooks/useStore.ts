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
      images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800']
    },
    {
      id: '2',
      name: 'Samsung Neo QLED 4K',
      description: 'Experience stunning 4K resolution with Quantum Mini LEDs.',
      price: 85000,
      categoryId: 'electronics',
      brandId: 'samsung',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800']
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

  // Fetch data from Supabase on mount if configured
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

        if (pErr || cErr || bErr || banErr) {
          console.warn("Supabase tables might not be created yet. Falling back to local storage.");
          return;
        }

        setData({
          products: productsData || [],
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

  const updateProduct = async (updatedProduct: Product) => {
    // Optimistic update
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('products').update(updatedProduct).eq('id', updatedProduct.id);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase update error:", err);
        showError("Failed to update product in cloud database.");
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

  const deleteCategory = async (id: string) => {
    // Optimistic update
    setData(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== id) }));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase category delete error:", err);
        showError("Failed to delete category from cloud database.");
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

  const deleteBrand = async (id: string) => {
    // Optimistic update
    setData(prev => ({ ...prev, brands: prev.brands.filter(b => b.id !== id) }));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('brands').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase brand delete error:", err);
        showError("Failed to delete brand from cloud database.");
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

  const updateBanner = async (updatedBanner: Banner) => {
    // Optimistic update
    setData(prev => ({
      ...prev,
      banners: prev.banners.map(b => b.id === updatedBanner.id ? updatedBanner : b)
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('banners').update(updatedBanner).eq('id', updatedBanner.id);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase banner update error:", err);
        showError("Failed to update banner in cloud database.");
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

  return {
    ...data,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    addBrand,
    deleteBrand,
    addBanner,
    updateBanner,
    deleteBanner
  };
}