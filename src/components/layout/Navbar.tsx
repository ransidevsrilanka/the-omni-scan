import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { currency, setCurrency } = useCurrency();

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?sort=newest' },
    { label: 'Collections', href: '/shop?collection=featured' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        {/* Top bar */}
        <div className="border-b border-border/30">
          <div className="container flex items-center justify-between py-1.5 text-xs tracking-widest text-muted-foreground">
            <span>FREE SHIPPING ON ORDERS OVER LKR 15,000</span>
            <button
              onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              {currency} <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Main nav */}
        <div className="container flex items-center justify-between py-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="font-display text-2xl md:text-3xl tracking-[0.3em] font-bold">
            ISLAND COUTURE
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(!searchOpen)} className="hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/account" className="hover:text-primary transition-colors">
              <User className="h-5 w-5" />
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-primary transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border/30 overflow-hidden"
            >
              <div className="container py-4">
                <div className="relative">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-transparent pl-8 pr-4 py-2 text-sm border-b border-border focus:border-primary outline-none placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-background z-50 border-r border-border"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <span className="font-display text-xl tracking-[0.2em]">MENU</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="p-6 flex flex-col gap-6">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-border pt-6 mt-2">
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="text-lg tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                    Account
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
