import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

const mockCategories = [
  { id: '1', name: 'Menswear', image: '', slug: 'menswear' },
  { id: '2', name: 'Womenswear', image: '', slug: 'womenswear' },
  { id: '3', name: 'Accessories', image: '', slug: 'accessories' },
  { id: '4', name: 'Footwear', image: '', slug: 'footwear' },
];

const mockProducts = [
  { id: '1', name: 'Midnight Oversized Tee', priceLKR: 4500, priceUSD: 15, image: '' },
  { id: '2', name: 'Shadow Cargo Pants', priceLKR: 7900, priceUSD: 26, image: '' },
  { id: '3', name: 'Obsidian Hoodie', priceLKR: 8500, priceUSD: 28, image: '' },
  { id: '4', name: 'Phantom Track Jacket', priceLKR: 9200, priceUSD: 30, image: '' },
  { id: '5', name: 'Eclipse Crop Top', priceLKR: 3800, priceUSD: 12, image: '' },
  { id: '6', name: 'Noir Joggers', priceLKR: 6200, priceUSD: 20, image: '' },
  { id: '7', name: 'Vanguard Cap', priceLKR: 2500, priceUSD: 8, image: '' },
  { id: '8', name: 'Stealth Crossbody Bag', priceLKR: 5400, priceUSD: 18, image: '' },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const Index = () => {
  return (
    <StorefrontLayout>
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background z-10" />
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 text-center px-6"
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] mb-6 leading-[0.95]">
            DARE TO<br />
            <span className="text-primary">STAND OUT</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase mb-10 max-w-lg mx-auto">
            Premium fashion with uncompromising attitude
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="bg-primary text-primary-foreground px-10 py-4 font-display text-sm tracking-[0.3em] hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              SHOP NOW <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/shop?collection=featured"
              className="border border-foreground/30 text-foreground px-10 py-4 font-display text-sm tracking-[0.3em] hover:border-foreground hover:bg-foreground/5 transition-colors"
            >
              VIEW COLLECTIONS
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <motion.div {...fadeUp}>
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em]">SHOP BY CATEGORY</h2>
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground tracking-wider flex items-center gap-1 transition-colors">
                VIEW ALL <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="block group relative aspect-[3/4] bg-surface overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="font-display text-xl tracking-[0.15em] group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-xs text-muted-foreground tracking-wider mt-1 flex items-center gap-1 group-hover:text-foreground transition-colors">
                      EXPLORE <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <motion.div {...fadeUp}>
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em]">NEW ARRIVALS</h2>
              <Link to="/shop?sort=newest" className="text-sm text-muted-foreground hover:text-foreground tracking-wider flex items-center gap-1 transition-colors">
                VIEW ALL <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {mockProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link to={`/product/${product.id}`} className="block group">
                  <div className="aspect-[3/4] bg-surface mb-3 overflow-hidden">
                    <div className="w-full h-full bg-surface-hover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="text-sm tracking-wider group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">LKR {product.priceLKR.toLocaleString()}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle banner */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <motion.div {...fadeUp}>
            <div className="relative h-[60vh] bg-surface overflow-hidden flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent z-10" />
              <div className="relative z-20 p-8 md:p-16 max-w-lg">
                <span className="text-xs tracking-[0.4em] text-primary mb-4 block">THE COLLECTION</span>
                <h2 className="font-display text-4xl md:text-5xl tracking-[0.1em] mb-6 leading-tight">
                  REDEFINE YOUR EDGE
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  Crafted for those who refuse to blend in. Every piece is designed with raw intention and premium quality.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 font-display text-sm tracking-[0.2em] hover:bg-primary/90 transition-colors"
                >
                  SHOP THE LOOK <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em] mb-4">JOIN THE MOVEMENT</h2>
            <p className="text-muted-foreground text-sm tracking-wider mb-8">
              Be the first to know about exclusive drops, limited releases, and insider offers.
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-surface border border-border px-5 py-3.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
              />
              <button className="bg-primary text-primary-foreground px-8 py-3.5 font-display text-sm tracking-[0.2em] hover:bg-primary/90 transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </StorefrontLayout>
  );
};

export default Index;
