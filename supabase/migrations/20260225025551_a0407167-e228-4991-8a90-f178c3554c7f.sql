
-- Fix search_path on generate_order_number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  NEW.order_number := 'IC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(NEW.id::TEXT, 1, 8);
  RETURN NEW;
END;
$$;

-- Fix permissive INSERT on profiles (trigger-based, restrict to service role context)
DROP POLICY "System inserts profiles" ON public.profiles;
CREATE POLICY "Service inserts profiles" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- Fix permissive INSERT on newsletter
DROP POLICY "Anyone subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
