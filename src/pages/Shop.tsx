import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { useCurrency } from '@/contexts/CurrencyContext';
import { motion } from 'framer-motion';

const mockProducts = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: `Product ${i + 1}`,
  priceLKR: 3000 + i * 800,
  priceUSD: 10 + i * 3,
  image: '',
  category: ['Menswear', 'Womenswear', 'Accessories', 'Footwear'][i % 4],
}));

const Shop = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { formatPrice } = useCurrency();

  return (
    <StorefrontLayout>
      <div className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl md:text-4xl tracking-[0.15em]">SHOP ALL</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground tracking-wider transition-colors">
              <SlidersHorizontal className="h-4 w-4" /> FILTERS
            </button>
            <div className="flex border border-border">
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-surface' : ''}`}>
                <Grid className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-surface' : ''}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground tracking-wider">
              SORT BY <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {filtersOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border border-border p-6 mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h4 className="text-xs tracking-[0.2em] text-muted-foreground mb-3">CATEGORY</h4>
              {['Menswear', 'Womenswear', 'Accessories', 'Footwear'].map(c => (
                <label key={c} className="flex items-center gap-2 text-sm mb-2 cursor-pointer hover:text-foreground text-muted-foreground">
                  <input type="checkbox" className="accent-primary" /> {c}
                </label>
              ))}
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-muted-foreground mb-3">SIZE</h4>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                <label key={s} className="flex items-center gap-2 text-sm mb-2 cursor-pointer hover:text-foreground text-muted-foreground">
                  <input type="checkbox" className="accent-primary" /> {s}
                </label>
              ))}
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-muted-foreground mb-3">COLOR</h4>
              {['Black', 'White', 'Grey', 'Navy'].map(c => (
                <label key={c} className="flex items-center gap-2 text-sm mb-2 cursor-pointer hover:text-foreground text-muted-foreground">
                  <input type="checkbox" className="accent-primary" /> {c}
                </label>
              ))}
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-muted-foreground mb-3">PRICE RANGE</h4>
              <p className="text-sm text-muted-foreground">LKR 0 — LKR 20,000</p>
            </div>
          </motion.div>
        )}

        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6' : 'space-y-4'}>
          {mockProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {viewMode === 'grid' ? (
                <Link to={`/product/${product.id}`} className="block group">
                  <div className="aspect-[3/4] bg-surface mb-3 overflow-hidden">
                    <div className="w-full h-full bg-surface-hover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="text-sm tracking-wider group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{formatPrice(product.priceLKR, product.priceUSD)}</p>
                </Link>
              ) : (
                <Link to={`/product/${product.id}`} className="flex gap-6 group border border-border p-4 hover:border-primary/30 transition-colors">
                  <div className="w-24 h-32 bg-surface flex-shrink-0" />
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm tracking-wider group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                    <p className="text-sm mt-2">{formatPrice(product.priceLKR, product.priceUSD)}</p>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default Shop;
