import { Package, MapPin, Heart, User, LogOut } from 'lucide-react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { Link } from 'react-router-dom';

const Account = () => {
  const menuItems = [
    { icon: Package, label: 'Order History', href: '/account/orders', desc: 'Track and manage your orders' },
    { icon: MapPin, label: 'Addresses', href: '/account/addresses', desc: 'Manage your shipping addresses' },
    { icon: Heart, label: 'Wishlist', href: '/account/wishlist', desc: 'Items you\'ve saved for later' },
    { icon: User, label: 'Profile', href: '/account/profile', desc: 'Update your personal details' },
  ];

  return (
    <StorefrontLayout>
      <div className="container py-12 max-w-3xl">
        <h1 className="font-display text-3xl tracking-[0.15em] mb-2">MY ACCOUNT</h1>
        <p className="text-sm text-muted-foreground tracking-wider mb-10">Welcome back to Island Couture</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map(item => (
            <Link
              key={item.href}
              to={item.href}
              className="border border-border p-6 hover:border-primary/30 transition-colors group"
            >
              <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
              <h3 className="font-display text-sm tracking-[0.15em] mb-1">{item.label.toUpperCase()}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </Link>
          ))}
        </div>

        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-8 tracking-wider transition-colors">
          <LogOut className="h-4 w-4" /> SIGN OUT
        </button>
      </div>
    </StorefrontLayout>
  );
};

export default Account;
