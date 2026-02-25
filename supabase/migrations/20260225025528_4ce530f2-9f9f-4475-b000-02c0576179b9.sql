
-- Enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT, last_name TEXT, phone TEXT, avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  position INTEGER NOT NULL DEFAULT 0, is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT, materials TEXT, care TEXT,
  price_lkr NUMERIC(10,2) NOT NULL DEFAULT 0, price_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true, is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product Variants
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  size TEXT, color TEXT, stock INTEGER NOT NULL DEFAULT 0, sku TEXT
);

-- Product Images
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL, position INTEGER NOT NULL DEFAULT 0
);

-- Addresses
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label TEXT DEFAULT 'Home', first_name TEXT, last_name TEXT, phone TEXT,
  address TEXT NOT NULL, city TEXT NOT NULL, postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'Sri Lanka', is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Wishlists
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal_lkr NUMERIC(10,2) NOT NULL DEFAULT 0, subtotal_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_lkr NUMERIC(10,2) NOT NULL DEFAULT 0, shipping_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_lkr NUMERIC(10,2) NOT NULL DEFAULT 0, total_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_address JSONB, payment_method TEXT DEFAULT 'payhere',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payhere_order_id TEXT, notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order Items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  name TEXT NOT NULL, image TEXT, size TEXT, color TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_lkr NUMERIC(10,2) NOT NULL DEFAULT 0, price_usd NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- Order Status History
CREATE TABLE public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status order_status NOT NULL, note TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Discount Codes
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, type discount_type NOT NULL DEFAULT 'percentage',
  value NUMERIC(10,2) NOT NULL DEFAULT 0, min_order NUMERIC(10,2) DEFAULT 0,
  max_uses INTEGER, used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ, is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Banners
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT, subtitle TEXT, image_url TEXT, link TEXT,
  position INTEGER NOT NULL DEFAULT 0, is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Newsletter
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE, subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Store Settings
CREATE TABLE public.store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE, value TEXT
);

-- Team Invites
CREATE TABLE public.team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL, role app_role NOT NULL DEFAULT 'user',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payment Config
CREATE TABLE public.payment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode TEXT NOT NULL DEFAULT 'sandbox',
  sandbox_merchant_id TEXT, sandbox_merchant_secret TEXT, sandbox_app_id TEXT, sandbox_app_secret TEXT,
  live_merchant_id TEXT, live_merchant_secret TEXT, live_app_id TEXT, live_app_secret TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'first_name', ''), COALESCE(NEW.raw_user_meta_data->>'last_name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.order_number := 'IC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(NEW.id::TEXT, 1, 8);
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_order_number BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_config ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "System inserts profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- User Roles policies
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users read own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Categories: public read + admin manage
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins read all categories" ON public.categories FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update categories" ON public.categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete categories" ON public.categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Products
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins read all products" ON public.products FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Product Variants
CREATE POLICY "Public read variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admins insert variants" ON public.product_variants FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update variants" ON public.product_variants FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete variants" ON public.product_variants FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Product Images
CREATE POLICY "Public read images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins insert images" ON public.product_images FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update images" ON public.product_images FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete images" ON public.product_images FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Addresses
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL TO authenticated USING (user_id = auth.uid());

-- Wishlists
CREATE POLICY "Users manage own wishlist" ON public.wishlists FOR ALL TO authenticated USING (user_id = auth.uid());

-- Orders
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Order Items
CREATE POLICY "Read own order items" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Insert order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Order Status History
CREATE POLICY "Read order history" ON public.order_status_history FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_status_history.order_id AND (orders.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Admins insert history" ON public.order_status_history FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Discount Codes
CREATE POLICY "Public read active codes" ON public.discount_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins insert codes" ON public.discount_codes FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update codes" ON public.discount_codes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete codes" ON public.discount_codes FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Banners
CREATE POLICY "Public read active banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Admins insert banners" ON public.banners FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update banners" ON public.banners FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete banners" ON public.banners FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Newsletter
CREATE POLICY "Anyone subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Store Settings
CREATE POLICY "Public read settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admins insert settings" ON public.store_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update settings" ON public.store_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Team Invites
CREATE POLICY "Admins manage invites" ON public.team_invites FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Payment Config
CREATE POLICY "Admins manage payment" ON public.payment_config FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- Seed Categories (using gen_random_uuid via DO block to get valid UUIDs)
DO $$
DECLARE
  cat_menswear UUID := gen_random_uuid();
  cat_womenswear UUID := gen_random_uuid();
  cat_accessories UUID := gen_random_uuid();
  cat_footwear UUID := gen_random_uuid();
  p1 UUID; p2 UUID; p3 UUID; p4 UUID; p5 UUID; p6 UUID;
  p7 UUID; p8 UUID; p9 UUID; p10 UUID; p11 UUID; p12 UUID;
BEGIN
  INSERT INTO public.categories (id, name, slug, position, is_visible) VALUES
    (cat_menswear, 'Menswear', 'menswear', 1, true),
    (cat_womenswear, 'Womenswear', 'womenswear', 2, true),
    (cat_accessories, 'Accessories', 'accessories', 3, true),
    (cat_footwear, 'Footwear', 'footwear', 4, true);

  p1 := gen_random_uuid(); p2 := gen_random_uuid(); p3 := gen_random_uuid();
  p4 := gen_random_uuid(); p5 := gen_random_uuid(); p6 := gen_random_uuid();
  p7 := gen_random_uuid(); p8 := gen_random_uuid(); p9 := gen_random_uuid();
  p10 := gen_random_uuid(); p11 := gen_random_uuid(); p12 := gen_random_uuid();

  INSERT INTO public.products (id, name, slug, description, materials, care, price_lkr, price_usd, category_id, is_visible, is_featured) VALUES
    (p1, 'Midnight Oversized Tee', 'midnight-oversized-tee', 'Premium heavyweight cotton oversized tee with dropped shoulders and raw-edge finish.', '100% Premium Heavyweight Cotton, 280 GSM.', 'Machine wash cold. Tumble dry low.', 4500, 15, cat_menswear, true, true),
    (p2, 'Shadow Cargo Pants', 'shadow-cargo-pants', 'Tactical-inspired cargo pants with multiple utility pockets.', 'Cotton-Nylon blend, 240 GSM ripstop.', 'Machine wash cold. Hang dry.', 7900, 26, cat_menswear, true, true),
    (p3, 'Obsidian Hoodie', 'obsidian-hoodie', 'Ultra-soft fleece hoodie with kangaroo pocket and triple-stitched seams.', '80% Cotton, 20% Polyester, 380 GSM.', 'Machine wash cold inside out.', 8500, 28, cat_menswear, true, true),
    (p4, 'Phantom Track Jacket', 'phantom-track-jacket', 'Retro-inspired track jacket with contrast piping.', '100% Recycled Polyester tricot.', 'Machine wash warm.', 9200, 30, cat_menswear, true, false),
    (p5, 'Eclipse Crop Top', 'eclipse-crop-top', 'Cropped boxy tee with contemporary edge.', '100% Organic Cotton, 180 GSM.', 'Machine wash cold.', 3800, 12, cat_womenswear, true, true),
    (p6, 'Noir Joggers', 'noir-joggers', 'Tapered joggers with luxury feel.', 'French Terry Cotton, 320 GSM.', 'Machine wash cold.', 6200, 20, cat_womenswear, true, false),
    (p7, 'Vanguard Cap', 'vanguard-cap', 'Unstructured 6-panel cap with curved brim.', 'Washed cotton twill.', 'Spot clean only.', 2500, 8, cat_accessories, true, true),
    (p8, 'Stealth Crossbody Bag', 'stealth-crossbody-bag', 'Waterproof crossbody with hidden zipper compartment.', '1000D Cordura Nylon.', 'Wipe clean.', 5400, 18, cat_accessories, true, true),
    (p9, 'Abyss Linen Shirt', 'abyss-linen-shirt', 'Relaxed-fit linen shirt with mother-of-pearl buttons.', '100% European Linen.', 'Machine wash cold.', 6800, 22, cat_womenswear, true, true),
    (p10, 'Urban Stepper Sneakers', 'urban-stepper-sneakers', 'Minimalist leather sneakers with cushioned insole.', 'Full-grain leather, rubber sole.', 'Wipe with leather cleaner.', 12500, 42, cat_footwear, true, true),
    (p11, 'Onyx Slide Sandals', 'onyx-slide-sandals', 'Contoured footbed slides with textured grip sole.', 'EVA upper and sole.', 'Rinse with water.', 3200, 10, cat_footwear, true, false),
    (p12, 'Void Oversized Blazer', 'void-oversized-blazer', 'Deconstructed oversized blazer with raw hem details.', 'Wool-blend suiting, fully lined.', 'Dry clean only.', 14800, 48, cat_womenswear, true, true);

  -- Variants
  INSERT INTO public.product_variants (product_id, size, color, stock, sku) VALUES
    (p1, 'S', 'Black', 25, 'MOT-BLK-S'), (p1, 'M', 'Black', 40, 'MOT-BLK-M'), (p1, 'L', 'Black', 30, 'MOT-BLK-L'), (p1, 'XL', 'Black', 15, 'MOT-BLK-XL'), (p1, 'M', 'Charcoal', 20, 'MOT-CHL-M'), (p1, 'L', 'Off-White', 10, 'MOT-OWH-L'),
    (p2, 'S', 'Black', 15, 'SCP-BLK-S'), (p2, 'M', 'Black', 30, 'SCP-BLK-M'), (p2, 'L', 'Black', 25, 'SCP-BLK-L'), (p2, 'M', 'Olive', 20, 'SCP-OLV-M'),
    (p3, 'S', 'Black', 20, 'OBH-BLK-S'), (p3, 'M', 'Black', 35, 'OBH-BLK-M'), (p3, 'L', 'Black', 25, 'OBH-BLK-L'), (p3, 'XL', 'Black', 10, 'OBH-BLK-XL'),
    (p4, 'M', 'Black', 20, 'PTJ-BLK-M'), (p4, 'L', 'Black', 15, 'PTJ-BLK-L'),
    (p5, 'XS', 'Black', 30, 'ECT-BLK-XS'), (p5, 'S', 'Black', 40, 'ECT-BLK-S'), (p5, 'M', 'Black', 35, 'ECT-BLK-M'), (p5, 'S', 'White', 25, 'ECT-WHT-S'),
    (p6, 'S', 'Black', 20, 'NJG-BLK-S'), (p6, 'M', 'Black', 30, 'NJG-BLK-M'), (p6, 'L', 'Black', 20, 'NJG-BLK-L'),
    (p7, 'One Size', 'Black', 50, 'VGC-BLK-OS'), (p7, 'One Size', 'Navy', 30, 'VGC-NVY-OS'),
    (p8, 'One Size', 'Black', 40, 'SCB-BLK-OS'),
    (p9, 'S', 'Black', 15, 'ALS-BLK-S'), (p9, 'M', 'Black', 25, 'ALS-BLK-M'), (p9, 'L', 'Black', 20, 'ALS-BLK-L'), (p9, 'M', 'Ivory', 15, 'ALS-IVY-M'),
    (p10, '40', 'Black', 10, 'USS-BLK-40'), (p10, '41', 'Black', 15, 'USS-BLK-41'), (p10, '42', 'Black', 20, 'USS-BLK-42'), (p10, '43', 'Black', 15, 'USS-BLK-43'), (p10, '42', 'White', 10, 'USS-WHT-42'),
    (p11, '40', 'Black', 25, 'OSS-BLK-40'), (p11, '41', 'Black', 30, 'OSS-BLK-41'), (p11, '42', 'Black', 25, 'OSS-BLK-42'),
    (p12, 'S', 'Black', 8, 'VOB-BLK-S'), (p12, 'M', 'Black', 12, 'VOB-BLK-M'), (p12, 'L', 'Black', 10, 'VOB-BLK-L');
END;
$$;

-- Default payment config
INSERT INTO public.payment_config (mode) VALUES ('sandbox');

-- Default store settings
INSERT INTO public.store_settings (key, value) VALUES
  ('store_name', 'Island Couture'),
  ('contact_email', 'hello@islandcouture.com'),
  ('phone', '+94 XX XXX XXXX'),
  ('standard_shipping_lkr', '350'),
  ('free_shipping_threshold_lkr', '15000'),
  ('tax_rate', '0');
