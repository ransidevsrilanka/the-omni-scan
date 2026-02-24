import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalItems } = useCart();
  const { formatPrice } = useCurrency();

  const subtotalLKR = items.reduce((sum, i) => sum + i.priceLKR * i.quantity, 0);
  const subtotalUSD = items.reduce((sum, i) => sum + i.priceUSD * i.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-lg tracking-[0.2em]">YOUR BAG ({totalItems})</h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <ShoppingBag className="h-12 w-12" />
                <p className="text-sm tracking-wider">YOUR BAG IS EMPTY</p>
                <Link
                  to="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="text-sm text-primary hover:underline tracking-wider"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-24 bg-surface flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.size} / {item.color}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-surface">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-surface">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm">{formatPrice(item.priceLKR * item.quantity, item.priceUSD * item.quantity)}</span>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="self-start text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground tracking-wider">SUBTOTAL</span>
                    <span className="font-medium">{formatPrice(subtotalLKR, subtotalUSD)}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full bg-primary text-primary-foreground text-center py-3.5 text-sm font-display tracking-[0.2em] hover:bg-primary/90 transition-colors"
                  >
                    CHECKOUT
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full text-center py-2 text-sm text-muted-foreground hover:text-foreground tracking-wider transition-colors"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
