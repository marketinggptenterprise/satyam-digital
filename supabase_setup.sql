-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  "categoryId" TEXT REFERENCES categories(id) ON DELETE SET NULL,
  "brandId" TEXT REFERENCES brands(id) ON DELETE SET NULL,
  image TEXT
);

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  badge TEXT,
  image TEXT,
  link TEXT
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  "customerEmail" TEXT,
  "customerName" TEXT,
  date TEXT,
  total NUMERIC,
  status TEXT,
  items TEXT
);

-- Disable Row Level Security (RLS) for easy public access
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Insert initial categories
INSERT INTO categories (id, name) VALUES
('mobiles', 'Mobiles'),
('electronics', 'Electronics'),
('appliances', 'Home Appliances')
ON CONFLICT (id) DO NOTHING;

-- Insert initial brands
INSERT INTO brands (id, name) VALUES
('apple', 'Apple'),
('samsung', 'Samsung'),
('lg', 'LG'),
('sony', 'Sony')
ON CONFLICT (id) DO NOTHING;

-- Insert initial products
INSERT INTO products (id, name, description, price, "categoryId", "brandId", image) VALUES
('1', 'iPhone 15 Pro', 'The latest flagship from Apple with Titanium design.', 129900, 'mobiles', 'apple', 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800'),
('2', 'Samsung Neo QLED 4K', 'Experience stunning 4K resolution with Quantum Mini LEDs.', 85000, 'electronics', 'samsung', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (id) DO NOTHING;

-- Insert initial banners
INSERT INTO banners (id, title, subtitle, badge, image, link) VALUES
('1', 'Upgrade Your Digital Life', 'Get up to 40% off on latest smartphones and home appliances.', 'FESTIVAL SALE IS LIVE', 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800', '#'),
('2', 'Smart TV Revolution', 'Cinematic experience at your home with Neo QLED technology.', 'NEW ARRIVAL', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800', '#')
ON CONFLICT (id) DO NOTHING;

-- Insert initial orders
INSERT INTO orders (id, "customerEmail", "customerName", date, total, status, items) VALUES
('ORD-7281', 'admin@example.com', 'John Doe', '2024-03-15', 129900, 'Delivered', 'iPhone 15 Pro'),
('ORD-6542', 'user@example.com', 'Jane Smith', '2024-02-28', 2450, 'Processing', 'Samsung Case, Cable')
ON CONFLICT (id) DO NOTHING;