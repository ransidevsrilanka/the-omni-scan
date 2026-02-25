

# Implementation Plan — Island Couture Phase 2

This is a large scope covering authentication, database, payments, emails, animations, and admin functionality. Here is the full breakdown.

---

## 1. Database Schema (Migration)

Create all core tables in one migration:

```text
Tables to create:
─────────────────────────────────────────────────
profiles          → user_id, first_name, last_name, phone, avatar_url
user_roles        → user_id, role (admin/moderator/user enum)
categories        → id, name, slug, image_url, parent_id, position, is_visible
products          → id, name, slug, description, materials, care, price_lkr, price_usd, is_visible, is_featured, created_at
product_variants  → id, product_id, size, color, stock, sku
product_images    → id, product_id, url, position
addresses         → id, user_id, label, first_name, last_name, phone, address, city, postal_code, country, is_default
wishlists         → id, user_id, product_id
orders            → id, user_id, order_number, status, subtotal_lkr, subtotal_usd, shipping_lkr, shipping_usd, total_lkr, total_usd, shipping_address (jsonb), payment_method, payment_status, payhere_order_id, notes, created_at
order_items       → id, order_id, product_id, variant_id, name, image, size, color, quantity, price_lkr, price_usd
order_status_history → id, order_id, status, note, created_by, created_at
discount_codes    → id, code, type (percentage/fixed), value, min_order, max_uses, used_count, expires_at, is_active
banners           → id, title, subtitle, image_url, link, position, is_active
newsletter_subscribers → id, email, subscribed_at
store_settings    → id, key, value
team_invites      → id, email, role, invited_by, accepted_at, created_at
payment_config    → id, mode (sandbox/live), sandbox_merchant_id, sandbox_merchant_secret, sandbox_app_id, sandbox_app_secret, live_merchant_id, live_merchant_secret, live_app_id, live_app_secret
```

RLS policies on all tables. `has_role()` security definer function for admin checks. Auto-create profile trigger on signup.

Seed with **demo products** (8-12 items across categories with realistic names/prices).

---

## 2. Authentication

- Wire Login page to backend auth (email/password signup + login)
- Email verification required (no auto-confirm)
- Password reset flow with `/reset-password` page
- Auth context provider wrapping the app
- Protected routes: `/account/*` requires login, `/admin/*` requires admin role
- Account page shows real order history, addresses, wishlist
- Logout functionality

---

## 3. Marquee Banner

Replace the static "FREE SHIPPING ON ORDERS OVER LKR 15,000" text in the Navbar top bar with a CSS marquee animation — gold text on black background, continuously scrolling.

---

## 4. Hero Background Video

Generate a short looping video/animation using AI image generation for the hero section. The hero will have a dark, moody fashion-themed background with overlay gradients.

---

## 5. Glassmorphism + God-Level Animations

### Admin Panel
- All stat cards and content cards get glassmorphism: `backdrop-blur-xl`, semi-transparent backgrounds, subtle borders with gradient highlights
- Staggered entrance animations on dashboard cards
- Smooth page transitions between admin sections
- Hover effects with scale and glow on interactive elements

### Storefront
- Page transition animations (framer-motion `AnimatePresence` on route changes)
- Product card hover: image zoom + overlay with quick-view
- Parallax scrolling on hero and lifestyle sections
- Staggered grid reveals on scroll
- Smooth skeleton loading states
- Cart drawer spring animation
- Button press micro-interactions (scale down on click)
- Cursor-following subtle effects on hero

---

## 6. Resend Email Integration

### Setup
- Request `RESEND_API_KEY` secret from user
- Create an edge function `send-order-email` that uses Resend API

### Email Template (matching the uploaded reference exactly)
- Header with Island Couture branding + nav links
- "Hooray! Your order has been confirmed." headline
- Order status tracker (Confirmed → Shipped → Delivered) with icons
- "View Your Order" CTA button
- Order details section: confirmation number, product image, item details, price
- Shipping address + payment method + cost breakdown
- Contact section (Chat, Call, Email, Text)
- FAQ/promo section
- Free shipping upsell section
- Footer with social icons + unsubscribe

### Trigger points
- Order confirmation email on successful payment
- Shipping notification when admin updates status to "Shipped"
- Delivery confirmation when status changes to "Delivered"

---

## 7. PayHere Integration

### Architecture
- Edge function `payhere-checkout` generates the payment hash and returns form data
- Edge function `payhere-notify` handles PayHere server callback (IPN)
- Frontend redirects to PayHere hosted payment page

### Live vs Demo Toggle (Admin Settings)
- `payment_config` table stores both sets of credentials
- Admin Settings page has a toggle switch: **SANDBOX** / **LIVE**
- 8 secrets total stored in the database (not edge function secrets):
  - Sandbox: merchant_id, merchant_secret, app_id, app_secret
  - Live: merchant_id, merchant_secret, app_id, app_secret
- The edge function reads the active mode from `payment_config` and uses the corresponding credentials
- Clear visual indicator in admin showing current mode

---

## 8. Admin Panel — Full Functionality

### Dashboard
- Real stats from database (revenue, orders, customers)
- Sales chart using Recharts (already installed)
- Recent orders list with status badges
- Low stock alerts from product_variants

### Products
- CRUD with image upload to storage bucket
- Variant management (size/color/stock)
- Bulk visibility toggle

### Categories
- CRUD with drag-to-reorder
- Image upload, visibility toggle

### Orders
- List with status filters
- Order detail modal with timeline
- Status update workflow (triggers email notifications)

### Customers
- List from profiles table
- View customer order history

### Team
- Invite by email (inserts to team_invites + user_roles)
- Role management (admin/moderator/user)

### Marketing
- Discount code CRUD
- Banner management
- Newsletter subscriber count

### Budget
- Revenue chart by date range
- Order totals aggregation

### Settings
- Store info fields (persisted to store_settings)
- PayHere credentials with Live/Demo toggle
- Shipping rates config

---

## 9. Storage Bucket

Create a `product-images` storage bucket for product and category images with public read access.

---

## Technical Notes

- **Resend**: Requires the user to provide a `RESEND_API_KEY`. Will be stored as an edge function secret.
- **PayHere credentials**: Stored in the `payment_config` database table (encrypted at rest), not as edge function secrets. The edge function reads them via service role.
- **8 credential fields** for PayHere: sandbox (merchant_id, merchant_secret, app_id, app_secret) + live (merchant_id, merchant_secret, app_id, app_secret). All managed from admin Settings page.
- Dark theme is always on — the `:root` variables will be updated to match the `.dark` theme as default.

---

## Execution Order

1. Database migration (all tables + seed data + RLS + functions)
2. Storage bucket creation
3. Auth context + protected routes + login/register/reset-password
4. Marquee banner + hero video + glassmorphism CSS
5. God-level animations across all components
6. Admin panel wired to real data (all CRUD operations)
7. Storefront wired to real data (products, cart, checkout)
8. Request Resend API key → email edge function
9. PayHere edge functions + checkout flow
10. Final polish and integration testing

