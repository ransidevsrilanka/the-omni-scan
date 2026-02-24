

# Island Couture — Premium E-Commerce Platform

## Brand Identity & Design System
- **Brand Name**: Island Couture
- **Aesthetic**: Dark, bold, premium feel — deep blacks, sharp contrasts, subtle textures
- **Typography**: Premium display fonts (e.g., Bebas Neue / Oswald for headings, Inter or similar clean sans-serif for body) — no default system fonts
- **Color Palette**: Deep charcoal/black backgrounds, crisp white text, gold or warm accent color for CTAs and highlights
- **Currencies**: LKR (Sri Lankan Rupees) as primary, USD as secondary — with a currency switcher

---

## 1. Storefront (Customer-Facing)

### Homepage
- Full-screen hero section with bold imagery and tagline
- Featured collections / new arrivals carousel
- Category showcase grid
- "Shop the Look" lifestyle section
- Newsletter signup with bold CTA
- Footer with links to policies, social media, and quick navigation

### Navigation
- Sticky top navbar with brand logo, search, cart icon, user account icon, currency switcher
- Mega-menu dropdown for product categories (categories pulled dynamically from the database)
- Mobile hamburger menu with smooth slide-in animation

### Product Catalog
- Category pages with grid/list view toggle
- Filters (size, color, price range, category)
- Sort options (newest, price low-high, price high-low, popularity)
- Quick-view modal on hover/click

### Product Detail Page
- Large image gallery with zoom capability
- Size selector, color selector, quantity picker
- "Add to Cart" and "Buy Now" buttons
- Product description, materials, care instructions tabs
- Related products section
- Customer reviews section

### Shopping Cart
- Slide-out cart drawer
- Quantity adjustment, item removal
- Order summary with subtotal, shipping estimate
- "Proceed to Checkout" CTA

### Checkout Flow
- Multi-step checkout: Shipping info → Shipping method → Payment → Confirmation
- PayHere payment gateway integration (sandbox first, then live)
- Order confirmation page with order number and summary
- Confirmation email trigger

### Customer Accounts
- Registration and login pages (email/password)
- Customer dashboard: order history, order tracking status
- Saved addresses management
- Wishlist functionality
- Profile editing (name, email, password change)
- Password reset flow with email verification

### Search
- Search bar with instant results dropdown
- Full search results page with filters

---

## 2. Admin Panel (`/admin`)

### Dashboard
- Overview cards: total revenue, orders today, pending orders, total customers
- Sales chart (daily/weekly/monthly)
- Recent orders list
- Low stock alerts

### Product Management
- Product list with search, filter, and pagination
- Add/edit product form: name, description, images (multiple), price (LKR & USD), sizes, colors, stock quantity, category assignment, visibility toggle
- Bulk actions (activate, deactivate, delete)

### Category Management
- Create, edit, reorder, and delete categories
- Category image upload
- Toggle category visibility on storefront
- Nested subcategories support

### Order Management
- Orders list with status filters (pending, processing, shipped, delivered, cancelled)
- Order detail view with customer info, items, payment status, shipping info
- Update order status workflow
- Order notes

### Customer Management
- Customer list with search
- Customer detail view with order history
- Account status management

### Team Management
- Invite team members by email
- Role assignment (admin, manager, viewer)
- Activity log

### Marketing
- Discount codes / coupon management (percentage or fixed amount, expiry date, usage limits)
- Banner management for homepage hero section
- Newsletter subscriber list

### Budget & Billing
- Revenue reports with date range filters
- Expense tracking
- PayHere transaction history
- Export reports (CSV)

### Settings
- Store settings (name, logo, contact info)
- Shipping rates configuration
- Tax settings
- Payment gateway settings (PayHere credentials)

---

## 3. Legal / Policy Pages
- **Privacy Policy** — data collection, usage, cookies, third-party sharing
- **Terms & Conditions** — user responsibilities, intellectual property, limitations
- **Return Policy** — return window, conditions, refund process
- **Shipping Policy** — shipping methods, timelines, costs, international shipping info

All styled consistently with the dark premium theme.

---

## 4. Technical Foundation

### Database (Supabase)
- Products, categories, product images, product variants (size/color/stock)
- Customers (linked to Supabase auth), addresses, wishlists
- Orders, order items, order status history
- Discount codes, newsletter subscribers
- Team members with role-based access (admin roles in separate `user_roles` table)
- Store settings, banners

### Authentication
- Supabase Auth for both customers and admin users
- Role-based access control — admin panel protected by role check
- Full password reset flow

### Payment
- PayHere integration for LKR/USD payments
- Checkout API via Supabase Edge Function for secure payment processing

### Key UX Details
- Fully responsive — mobile-first design
- Smooth page transitions and micro-animations
- Loading skeletons for all data-heavy pages
- Toast notifications for cart actions, order updates
- Dark mode by default (matching the premium aesthetic)

