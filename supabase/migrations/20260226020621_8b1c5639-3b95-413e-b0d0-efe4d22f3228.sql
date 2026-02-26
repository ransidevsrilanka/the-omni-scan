
INSERT INTO public.product_images (product_id, url, position)
SELECT id, 'https://placehold.co/600x800/1a1a1a/c5932a?text=' || REPLACE(name, ' ', '+'), 0
FROM public.products
WHERE id NOT IN (SELECT DISTINCT product_id FROM public.product_images);
