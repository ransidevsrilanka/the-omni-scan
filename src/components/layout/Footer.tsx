import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl tracking-[0.2em] mb-4">ISLAND COUTURE</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bold, premium fashion crafted for those who dare to stand out. Redefining style with uncompromising quality.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm tracking-[0.2em] mb-6">QUICK LINKS</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-foreground transition-colors">Shop All</Link></li>
              <li><Link to="/shop?sort=newest" className="hover:text-foreground transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?collection=featured" className="hover:text-foreground transition-colors">Collections</Link></li>
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-display text-sm tracking-[0.2em] mb-6">CUSTOMER CARE</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/shipping-policy" className="hover:text-foreground transition-colors">Shipping Policy</Link></li>
              <li><Link to="/return-policy" className="hover:text-foreground transition-colors">Return Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-sm tracking-[0.2em] mb-6">STAY IN THE LOOP</h4>
            <p className="text-sm text-muted-foreground mb-4">Get exclusive drops and updates straight to your inbox.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
              />
              <button className="bg-primary text-primary-foreground px-6 py-2.5 text-sm font-display tracking-wider hover:bg-primary/90 transition-colors">
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Island Couture. All rights reserved.</span>
          <span>Designed with precision. Built with passion.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
