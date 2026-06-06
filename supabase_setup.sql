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
  images TEXT[] -- Array of additional image URLs
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

-- Optional: Insert initial data (uncomment if you want to re-populate with starter data after clearing)
-- INSERT INTO categories (id, name) VALUES
-- ('mobiles', 'Mobiles'),
-- ('electronics', 'Electronics'),
-- ('appliances', 'Home Appliances');

-- INSERT INTO brands (id, name) VALUES
-- ('apple', 'Apple'),
-- ('samsung', 'Samsung'),
-- ('lg', 'LG'),
-- ('sony', 'Sony');

-- INSERT INTO products (id, name, description, price, "categoryId", "brandId", image, images) VALUES
-- ('1', 'iPhone 15 Pro', 'The latest flagship from Apple with Titanium design.', 129900, 'mobiles', 'apple', 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800']),
-- ('2', 'Samsung Neo QLED 4K', 'Experience stunning 4K resolution with Quantum Mini LEDs.', 85000, 'electronics', 'samsung', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800']);

-- INSERT INTO banners (id, title, subtitle, badge, image, link) VALUES
-- ('1', 'Upgrade Your Digital Life', 'Get up to 40% off on latest smartphones and home appliances.', 'FESTIVAL SALE IS LIVE', 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800', '#'),
-- ('2', 'Smart TV Revolution', 'Cinematic experience at your home with Neo QLED technology.', 'NEW ARRIVAL', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800', '#');