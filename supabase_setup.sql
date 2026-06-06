-- Drop tables if they exist to ensure a clean setup (WARNING: This will delete all existing data!)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS banners CASCADE;

-- Create Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Create Brands table
CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Create Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  "categoryId" TEXT REFERENCES categories(id),
  "brandId" TEXT REFERENCES brands(id),
  image TEXT NOT NULL, -- Primary image URL
  images TEXT[], -- Array of additional image URLs
  "inStock" BOOLEAN DEFAULT TRUE,
  "isFeatured" BOOLEAN DEFAULT FALSE,
  "discountPercent" NUMERIC DEFAULT 0
);

-- Create Banners table
CREATE TABLE banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  badge TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT NOT NULL
);

-- Insert initial data
INSERT INTO categories (id, name) VALUES
('mobiles', 'Mobiles'),
('laptops', 'Laptops'),
('smart-tv', 'Smart TV'),
('appliances', 'Appliances'),
('watches', 'Watches'),
('accessories', 'Accessories');

INSERT INTO brands (id, name) VALUES
('apple', 'Apple'),
('samsung', 'Samsung'),
('lg', 'LG'),
('sony', 'Sony');

INSERT INTO products (id, name, description, price, "categoryId", "brandId", image, images, "inStock", "isFeatured", "discountPercent") VALUES
('1', 'iPhone 15 Pro', 'The latest flagship from Apple with Titanium design.', 129900, 'mobiles', 'apple', 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800'], TRUE, TRUE, 10),
('2', 'Samsung Neo QLED 4K', 'Experience stunning 4K resolution with Quantum Mini LEDs.', 85000, 'smart-tv', 'samsung', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800'], TRUE, TRUE, 15),
('3', 'MacBook Air M3', 'Incredibly thin and fast laptop from Apple.', 119000, 'laptops', 'apple', 'https://images.unsplash.com/photo-1694709841893-9c8827725514?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1694709841893-9c8827725514?auto=format&fit=crop&q=80&w=800'], TRUE, FALSE, 0),
('4', 'Sony WH-1000XM5', 'Industry-leading noise canceling headphones.', 28000, 'accessories', 'sony', 'https://images.unsplash.com/photo-1621370729790-2e3d3e6c3f0b?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1621370729790-2e3d3e6c3f0b?auto=format&fit=crop&q=80&w=800'], TRUE, FALSE, 5),
('5', 'LG Smart Refrigerator', 'Large capacity smart refrigerator with InstaView Door-in-Door.', 95000, 'appliances', 'lg', 'https://images.unsplash.com/photo-1563229977-3e1b7f0c1c4f?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1563229977-3e1b7f0c1c4f?auto=format&fit=crop&q=80&w=800'], TRUE, FALSE, 0),
('6', 'Apple Watch Series 9', 'Advanced health and fitness features in a sleek design.', 41900, 'watches', 'apple', 'https://images.unsplash.com/photo-1698299292864-d922a901e188?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1698299292864-d922a901e188?auto=format&fit=crop&q=80&w=800'], TRUE, TRUE, 8);

INSERT INTO banners (id, title, subtitle, badge, image, link) VALUES
('1', 'Upgrade Your Digital Life', 'Get up to 40% off on latest smartphones and home appliances.', 'FESTIVAL SALE IS LIVE', 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800', '#'),
('2', 'Smart TV Revolution', 'Cinematic experience at your home with Neo QLED technology.', 'NEW ARRIVAL', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800', '#'),
('3', 'Powerful Laptops', 'Unleash your productivity with the latest generation of laptops.', 'PERFORMANCE BOOST', 'https://images.unsplash.com/photo-1694709841893-9c8827725514?auto=format&fit=crop&q=80&w=800', '#');