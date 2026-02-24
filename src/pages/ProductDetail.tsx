import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, Heart, ChevronRight } from 'lucide-react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const product = {
    id: id || '1',
    name: 'Midnight Oversized Tee',
    priceLKR: 4500,
    priceUSD: 15,
    description: 'Crafted from premium heavyweight cotton, this oversized tee features a relaxed silhouette with dropped shoulders and a raw-edge finish. Designed for those who refuse to compromise on quality or style.',
    materials: '100% Premium Heavyweight Cotton, 280 GSM. Pre-shrunk and enzyme-washed for a lived-in feel.',
    care: 'Machine wash cold. Tumble dry low. Do not bleach. Iron on low heat if needed.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Charcoal', 'Off-White'],
    images: ['', '', '', ''],
  };

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      image: '',
      priceLKR: product.priceLKR,
      priceUSD: product.priceUSD,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
  };

  const tabs = [
    { key: 'description', label: 'Description' },
    { key: 'materials', label: 'Materials' },
    { key: 'care', label: 'Care' },
  ];

  return (
    <StorefrontLayout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8 tracking-wider">
          <Link to="/" className="hover:text-foreground">HOME</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-foreground">SHOP</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name.toUpperCase()}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="grid grid-cols-2 gap-2">
              {product.images.map((_, i) => (
                <div key={i} className={`bg-surface ${i === 0 ? 'col-span-2 aspect-[4/5]' : 'aspect-square'}`} />
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="lg:sticky lg:top-32 lg:self-start">
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.1em] mb-3">{product.name.toUpperCase()}</h1>
            <p className="text-xl mb-8">{formatPrice(product.priceLKR, product.priceUSD)}</p>

            {/* Color */}
            <div className="mb-6">
              <span className="text-xs tracking-[0.2em] text-muted-foreground block mb-3">COLOR — {selectedColor.toUpperCase()}</span>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm border transition-colors ${selectedColor === color ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-foreground'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <span className="text-xs tracking-[0.2em] text-muted-foreground block mb-3">SIZE — {selectedSize}</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 text-sm border flex items-center justify-center transition-colors ${selectedSize === size ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-foreground'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="text-xs tracking-[0.2em] text-muted-foreground block mb-3">QUANTITY</span>
              <div className="flex items-center border border-border w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-surface">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-surface">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-primary-foreground py-4 font-display text-sm tracking-[0.3em] hover:bg-primary/90 transition-colors"
              >
                ADD TO BAG
              </button>
              <button className="border border-border p-4 hover:border-foreground transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-t border-border pt-6">
              <div className="flex gap-6 mb-4">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`text-xs tracking-[0.2em] pb-2 border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
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
