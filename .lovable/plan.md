

# Fix Build Errors, Make Admin, Add PayHere Edge Functions, Seed Demo Data

## 1. Fix Build Errors

### CartContext — add `totalLKR` and `totalUSD`
Add computed properties to `CartContext`:
```typescript
const totalLKR = items.reduce((sum, i) => sum + i.priceLKR * i.quantity, 0);
const totalUSD = items.reduce((sum, i) => sum + i.priceUSD * i.quantity, 0);
```
Add these to the `CartContextType` interface and the provider value.

### AdminOrders — type-safe status casting
Cast `newStatus` to the proper `order_status` enum type using `as Database['public']['Enums']['order_status']` for both the `orders.update` and `order_status_history.insert` calls. Also cast the filter value.

## 2. Make sithumdev3@gmail.com Admin

Run a migration that inserts an admin role for this user:
```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'sithumdev3@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

## 3. PayHere Edge Functions

### `payhere-checkout`
- Reads `payment_config` from database using service role client
- Based on active mode (sandbox/live), uses the corresponding merchant_id and merchant_secret
- Generates MD5 hash per PayHere spec: `merchant_id + order_id + amount + currency + md5(merchant_secret)`
- Returns the hash, merchant_id, and payment URL (sandbox.payhere.lk vs www.payhere.lk)
- Frontend builds a form and submits to PayHere

### `payhere-notify`
- Handles PayHere IPN (server notification callback)
- Verifies the payment hash using merchant_secret
- Updates the order's `payment_status` and `status` in the database
- Inserts into `order_status_history`

### Config
Add to `supabase/config.toml`:
```toml
[functions.payhere-checkout]
verify_jwt = false

[functions.payhere-notify]
verify_jwt = false
```

### Frontend Checkout Update
Update `Checkout.tsx` to:
1. Create the order first
2. Call `payhere-checkout` edge function to get hash + payment URL
3. Build a hidden form and auto-submit to PayHere
4. Add return URL handling for success/cancel pages

## 4. Seed Demo Products with Placeholder Images

Run a migration that inserts:
- 5 categories (T-Shirts, Hoodies, Shorts, Accessories, Footwear)
- 10 demo products with realistic names and LKR/USD prices
- Product variants (sizes S/M/L/XL, colors Black/White/Navy)
- Product images using placeholder URLs (via `https://placehold.co/600x800/1a1a1a/c5932a?text=Product+Name`)
- Initial `payment_config` row with sandbox mode defaults

## 5. Additional Fixes

### Order Status History RLS
The `order_status_history` insert policy only allows admins. But Checkout tries to insert as a regular user. Fix: add an RLS policy allowing users to insert status history for their own orders (specifically the initial "pending" status on order creation).

### Profiles foreign key for orders
The admin Orders page queries `profiles!orders_user_id_fkey` but there's no explicit foreign key between orders.user_id and profiles.user_id. This join may fail. Will adjust the query to use a subquery or add appropriate relationship handling.

---

## Execution Order
1. Database migration: admin role + demo seed data + RLS fix
2. Fix CartContext (add totalLKR/totalUSD)
3. Fix AdminOrders type casting
4. Create PayHere edge functions
5. Update Checkout.tsx for PayHere flow
6. Update config.toml for edge functions

