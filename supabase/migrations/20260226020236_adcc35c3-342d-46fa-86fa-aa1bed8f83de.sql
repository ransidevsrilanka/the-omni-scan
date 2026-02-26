
-- 1. Make sithumdev3@gmail.com admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'sithumdev3@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. RLS fix: allow users to insert initial order status history for their own orders
CREATE POLICY "Users insert own order history"
ON public.order_status_history
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_status_history.order_id
    AND orders.user_id = auth.uid()
  )
);

-- 3. Seed initial payment_config
INSERT INTO public.payment_config (mode) VALUES ('sandbox')
ON CONFLICT DO NOTHING;
