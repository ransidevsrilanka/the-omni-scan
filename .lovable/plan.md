

# Fix Plan: Edge Function Errors, Responsive Design, Trigger, and PayHere

## Issues Identified

1. **Blank screen / edge function error**: The `payhere-checkout` edge function has incorrect CORS headers (missing `x-supabase-client-platform`, etc.) and `supabase/config.toml` is missing `verify_jwt = false` for both edge functions, causing deployment/invocation failures.

2. **`handle_new_user` trigger not attached**: The function exists but the trigger on `auth.users` was never created. New signups won't get profiles or roles. This must be fixed via a migration.

3. **Dashboard query uses invalid join**: `profiles!orders_user_id_fkey` — no foreign key exists. This crashes the admin dashboard.

4. **Not mobile responsive**: Multiple pages have layout issues on small screens — Navbar controls cramped, Shop filter bar overflows, Checkout grid doesn't stack, Admin tables not scrollable, Product detail grid doesn't reflow.

5. **PayHere integration**: The hash generation and form submission logic is correct per PayHere docs (confirmed: `md5(merchant_id + order_id + amount_formatted + currency + md5(merchant_secret).toUpperCase())`). But credentials need to be entered by the user in Admin Settings — this is by design, not a bug. The edge function just needs CORS + config fixes.

6. **Placeholder images**: Already seeded with `placehold.co` URLs (12 products, 12 images). They should be rendering. The issue may be that the category_id foreign keys point to categories that all share a single category — need to verify category distribution.

---

## Execution Plan

### 1. Database Migration — Attach trigger + fix join
- Create trigger `on_auth_user_created` on `auth.users AFTER INSERT` calling `handle_new_user()`
- This fixes signup flow (profiles + user_roles auto-created)

### 2. Fix Edge Function CORS Headers
Both `payhere-checkout/index.ts` and `payhere-notify/index.ts`:
- Update `Access-Control-Allow-Headers` to include all required Supabase client headers: `authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version`

### 3. Fix Admin Dashboard Query
- `Dashboard.tsx` line 41: Remove `profiles!orders_user_id_fkey` join. Use `shipping_address` jsonb field instead (same fix already applied to Orders page).

### 4. Make Everything Mobile Responsive

**Navbar.tsx:**
- Brand name: `text-lg sm:text-2xl md:text-3xl` 
- Ensure icon spacing works on small screens

**Shop.tsx:**
- Filter/sort bar: wrap on mobile, stack vertically
- Grid: `grid-cols-2` on mobile is fine but ensure gap is smaller

**ProductDetail.tsx:**
- Image grid: single column on mobile
- Sticky sidebar: disable on mobile

**Checkout.tsx:**
- Grid: stack on mobile (already `grid-cols-1 lg:grid-cols-5` but order summary should come first on mobile for context)

**Admin pages (all tables):**
- Wrap tables in `overflow-x-auto` divs
- Admin stat cards: `grid-cols-2` on mobile instead of `grid-cols-1`
- Admin layout: already has mobile sidebar — just need padding adjustments

**Footer.tsx:**
- Already responsive with `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

**CartDrawer.tsx:**
- Already `w-full max-w-md` — fine on mobile

### 5. Fix StorefrontLayout padding
- The `pt-[105px]` is too much on mobile with the marquee. Make it responsive: `pt-[90px] sm:pt-[105px]`

### 6. Ensure all product images render
- Verify `getImage()` functions handle the data correctly. The images exist in DB. Products and images should be displaying.

---

## Technical Details

### Edge Function CORS Fix (both functions)
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}
```

### Trigger Migration SQL
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Dashboard Fix
Replace line 41's `profiles!orders_user_id_fkey(first_name, last_name)` join with just `order_items(*)` and extract customer name from `shipping_address` jsonb.

### Responsive Changes Summary
- Add `overflow-x-auto` to all admin table containers
- Adjust text sizes with responsive prefixes throughout
- Fix grid breakpoints where they're missing mobile-first classes
- Add proper padding and spacing for mobile viewports

