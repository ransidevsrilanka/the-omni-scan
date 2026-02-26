
INSERT INTO public.categories (id, name, slug, position, is_visible) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'T-Shirts', 't-shirts', 5, true),
  ('a1000000-0000-0000-0000-000000000002', 'Hoodies', 'hoodies', 6, true),
  ('a1000000-0000-0000-0000-000000000003', 'Shorts', 'shorts', 7, true)
ON CONFLICT (slug) DO NOTHING;
