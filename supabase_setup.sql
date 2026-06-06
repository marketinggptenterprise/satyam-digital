-- SQL Setup Script for Satyam Digital Store
-- Run this in your Supabase SQL Editor (https://supabase.com -> Project -> SQL Editor)

-- 1. Create Categories Table if not exists
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Brands Table if not exists
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Products Table if not exists
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  "categoryId" TEXT REFERENCES categories(id) ON DELETE SET NULL,
  "brandId" TEXT REFERENCES brands(id) ON DELETE SET NULL,
  image TEXT,
  images TEXT[] DEFAULT '{}'::TEXT[],
  "inStock" BOOLEAN DEFAULT TRUE,
  "isFeatured" BOOLEAN DEFAULT FALSE,
  "discountPercent" NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Banners Table if not exists
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  badge TEXT,
  image TEXT NOT NULL,
  link TEXT DEFAULT '#',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Safe Migration: Add columns to existing products table if they don't exist
DO $$ 
BEGIN
  -- Add images column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='images') THEN
    ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT '{}'::TEXT[];
  END IF;

  -- Add inStock column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='inStock') THEN
    ALTER TABLE products ADD COLUMN "inStock" BOOLEAN DEFAULT TRUE;
  END IF;

  -- Add isFeatured column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='isFeatured') THEN
    ALTER TABLE products ADD COLUMN "isFeatured" BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add discountPercent column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='discountPercent') THEN
    ALTER TABLE products ADD COLUMN "discountPercent" NUMERIC DEFAULT 0;
  END IF;
END $$;

-- Enable Row Level Security (RLS) - Optional but recommended
-- For simplicity in this demo, we can allow public read/write, or you can configure policies.
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Create simple public access policies (Allow everyone to read and write for demo purposes)
-- Note: In production, restrict write access to authenticated admin users only.
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public write categories" ON categories FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Allow public write brands" ON brands FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public write products" ON products FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Allow public write banners" ON banners FOR ALL USING (true) WITH CHECK (true);