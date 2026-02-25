import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, Heart, ChevronRight } from 'lucide-react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('products').select('*, categories(name), product_images(url, position)').eq('slug', slug).maybeSingle();
      if (data) {
        setProduct(data);
        const { data: v } = await supabase.from('product_variants').select('*').eq('product_id', data.id);
        setVariants(v || []);
        const sizes = [...new Set((v || []).map((x: any) => x.size))];
        const colors = [...new Set((v || []).map((x: any) => x.color))];
        if (sizes.length) setSelectedSize(sizes[0] as string);
        if (colors.length) setSelectedColor(colors[0] as string);
      }
    };
    fetch();
  }, [slug]);

  if (!product) return <StorefrontLayout><div className="container py-20 text-center text-muted-foreground tracking-wider animate-pulse">LOADING...</div></StorefrontLayout>;

  const sizes = [...new Set(variants.map(v => v.size))];
  const colors = [...new Set(variants.map(v => v.color))];
  const selectedVariant = variants.find(v => v.size === selectedSize && v.color === selectedColor);
  const images = product.product_images?.sort((a: any, b: any) => a.position - b.position) || [];

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      productId: product.id,
      name: product.name,
      image: images[0]?.url || '',
      priceLKR: product.price_lkr,
      priceUSD: product.price_usd,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    toast.success('Added to bag');
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please sign in first'); return; }
    await supabase.from('wishlists').upsert({ user_id: user.id, product_id: product.id });
    toast.success('Added to wishlist');
  };

  return (
    <StorefrontLayout>
      <div className="container py-8">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8 tracking-wider">
          <Link to="/" className="hover:text-foreground">HOME</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-foreground">SHOP</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name.toUpperCase()}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="grid grid-cols-2 gap-2">
              {images.length > 0 ? images.map((img: any, i: number) => (
                <div key={i} className={`bg-surface overflow-hidden ${i === 0 ? 'col-span-2 aspect-[4/5]' : 'aspect-square'}`}>
                  <img src={img.url} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              )) : (
                <div className="col-span-2 aspect-[4/5] bg-surface" />
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs text-primary tracking-[0.3em] mb-2">{product.categories?.name?.toUpperCase()}</p>
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.1em] mb-3">{product.name.toUpperCase()}</h1>
            <p className="text-xl mb-8">{formatPrice(product.price_lkr, product.price_usd)}</p>

            {colors.length > 0 && (
              <div className="mb-6">
                <span className="text-xs tracking-[0.2em] text-muted-foreground block mb-3">COLOR — {selectedColor.toUpperCase()}</span>
                <div className="flex gap-2">
                  {colors.map(c => (
                    <motion.button key={c} whileTap={{ scale: 0.95 }} onClick={() => setSelectedColor(c!)} className={`px-4 py-2 text-sm border transition-colors ${selectedColor === c ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-foreground'}`}>{c}</motion.button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="mb-6">
                <span className="text-xs tracking-[0.2em] text-muted-foreground block mb-3">SIZE — {selectedSize}</span>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(s => (
                    <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => setSelectedSize(s!)} className={`w-12 h-12 text-sm border flex items-center justify-center transition-colors ${selectedSize === s ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-foreground'}`}>{s}</motion.button>
                  ))}
                </div>
              </div>
            )}

            {selectedVariant && (
              <p className="text-xs text-muted-foreground mb-4 tracking-wider">{selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'OUT OF STOCK'}</p>
            )}

            <div className="mb-8">
              <span className="text-xs tracking-[0.2em] text-muted-foreground block mb-3">QUANTITY</span>
              <div className="flex items-center border border-border w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-surface"><Minus className="h-4 w-4" /></button>
                <span className="px-6 text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-surface"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart} disabled={selectedVariant?.stock === 0}
                className="flex-1 bg-primary text-primary-foreground py-4 font-display text-sm tracking-[0.3em] hover:bg-primary/90 transition-colors disabled:opacity-50">
                ADD TO BAG
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleWishlist} className="border border-border p-4 hover:border-primary hover:text-primary transition-colors">
                <Heart className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex gap-6 mb-4">
                {[{ key: 'description', label: 'Description' }, { key: 'materials', label: 'Materials' }, { key: 'care', label: 'Care' }].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`text-xs tracking-[0.2em] pb-2 border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                    {tab.label.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeTab === 'description' && product.description}
                {activeTab === 'materials' && product.materials}
                {activeTab === 'care' && product.care}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default ProductDetail;
