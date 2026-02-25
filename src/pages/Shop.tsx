import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase.from('products').select('*, categories(name), product_images(url, position)').eq('is_visible', true);
      if (selectedCategory) query = query.eq('category_id', selectedCategory);
      if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
      else if (sortBy === 'price_low') query = query.order('price_lkr', { ascending: true });
      else if (sortBy === 'price_high') query = query.order('price_lkr', { ascending: false });
      const { data } = await query;
      setProducts(data || []);
    };
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').eq('is_visible', true).order('position');
      setCategories(data || []);
    };
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, sortBy]);

  const getImage = (p: any) => p.product_images?.[0]?.url;

  return (
    <StorefrontLayout>
      <div className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.15em]">SHOP ALL</h1>
            <div className="flex items-center gap-3">
              <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground tracking-wider transition-colors">
                <SlidersHorizontal className="h-4 w-4" /> FILTERS
              </button>
              <div className="flex border border-border">
                <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-surface' : ''}`}><Grid className="h-4 w-4" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-surface' : ''}`}><List className="h-4 w-4" /></button>
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-surface border border-border px-3 py-2 text-xs tracking-wider outline-none">
                <option value="newest">NEWEST</option>
                <option value="price_low">PRICE: LOW → HIGH</option>
                <option value="price_high">PRICE: HIGH → LOW</option>
              </select>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {filtersOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="border border-border p-6 mb-8">
                <h4 className="text-xs tracking-[0.2em] text-muted-foreground mb-3">CATEGORY</h4>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelectedCategory(null)} className={`px-3 py-1.5 text-xs border ${!selectedCategory ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>ALL</button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`px-3 py-1.5 text-xs border ${selectedCategory === c.id ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>{c.name.toUpperCase()}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6' : 'space-y-4'}>
          {products.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              {viewMode === 'grid' ? (
                <Link to={`/product/${product.slug}`} className="block group">
                  <div className="aspect-[3/4] bg-surface mb-3 overflow-hidden">
                    {getImage(product) ? (
                      <img src={getImage(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-surface-hover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <h3 className="text-sm tracking-wider group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.categories?.name}</p>
                  <p className="text-sm mt-1">{formatPrice(product.price_lkr, product.price_usd)}</p>
                </Link>
              ) : (
                <Link to={`/product/${product.slug}`} className="flex gap-6 group border border-border p-4 hover:border-primary/30 transition-colors">
                  <div className="w-24 h-32 bg-surface flex-shrink-0 overflow-hidden">
                    {getImage(product) && <img src={getImage(product)} alt={product.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm tracking-wider group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{product.categories?.name}</p>
                    <p className="text-sm mt-2">{formatPrice(product.price_lkr, product.price_usd)}</p>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center py-20 text-muted-foreground tracking-wider text-sm">No products found</div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default Shop;
