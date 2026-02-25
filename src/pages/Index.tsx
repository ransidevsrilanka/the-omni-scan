import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const Index = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const { formatPrice } = useCurrency();

  useEffect(() => {
    supabase.from('categories').select('*').eq('is_visible', true).order('position').then(({ data }) => setCategories(data || []));
    supabase.from('products').select('*, product_images(url, position)').eq('is_visible', true).eq('is_featured', true).order('created_at', { ascending: false }).limit(8).then(({ data }) => setFeatured(data || []));
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const { error } = await supabase.from('newsletter_subscribers').insert({ email });
    if (error?.code === '23505') toast.info('Already subscribed!');
    else if (error) toast.error(error.message);
    else { toast.success('Welcome to the movement!'); setEmail(''); }
  };

  const getImage = (p: any) => p.product_images?.sort((a: any, b: any) => a.position - b.position)?.[0]?.url;

  return (
    <StorefrontLayout>
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background z-10" />
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="relative z-20 text-center px-6">
          <motion.h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] mb-6 leading-[0.95]"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            DARE TO<br /><span className="text-primary">STAND OUT</span>
          </motion.h1>
          <motion.p className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase mb-10 max-w-lg mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Premium fashion with uncompromising attitude
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Link to="/shop" className="bg-primary text-primary-foreground px-10 py-4 font-display text-sm tracking-[0.3em] hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2">
              SHOP NOW <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/shop?collection=featured" className="border border-foreground/30 text-foreground px-10 py-4 font-display text-sm tracking-[0.3em] hover:border-foreground hover:bg-foreground/5 transition-all hover:scale-105">
              VIEW COLLECTIONS
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <motion.div {...fadeUp}>
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em]">SHOP BY CATEGORY</h2>
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground tracking-wider flex items-center gap-1 transition-colors">VIEW ALL <ChevronRight className="h-4 w-4" /></Link>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <Link to={`/shop?category=${cat.slug}`} className="block group relative aspect-[3/4] bg-surface overflow-hidden">
                  {cat.image_url && <img src={cat.image_url} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="font-display text-xl tracking-[0.15em] group-hover:text-primary transition-colors">{cat.name}</h3>
                    <span className="text-xs text-muted-foreground tracking-wider mt-1 flex items-center gap-1 group-hover:text-foreground transition-colors">EXPLORE <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <motion.div {...fadeUp}>
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em]">FEATURED</h2>
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground tracking-wider flex items-center gap-1 transition-colors">VIEW ALL <ChevronRight className="h-4 w-4" /></Link>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <Link to={`/product/${product.slug}`} className="block group">
                  <div className="aspect-[3/4] bg-surface mb-3 overflow-hidden">
                    {getImage(product) ? (
                      <img src={getImage(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-surface-hover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <h3 className="text-sm tracking-wider group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{formatPrice(product.price_lkr, product.price_usd)}</p>
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
                <h2 className="font-display text-4xl md:text-5xl tracking-[0.1em] mb-6 leading-tight">REDEFINE YOUR EDGE</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">Crafted for those who refuse to blend in. Every piece is designed with raw intention and premium quality.</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 font-display text-sm tracking-[0.2em] hover:bg-primary/90 transition-colors">
                    SHOP THE LOOK <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
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
            <p className="text-muted-foreground text-sm tracking-wider mb-8">Be the first to know about exclusive drops, limited releases, and insider offers.</p>
            <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 bg-surface border border-border px-5 py-3.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
              <motion.button whileTap={{ scale: 0.97 }} type="submit" className="bg-primary text-primary-foreground px-8 py-3.5 font-display text-sm tracking-[0.2em] hover:bg-primary/90 transition-colors">
                SUBSCRIBE
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </StorefrontLayout>
  );
};

export default Index;
