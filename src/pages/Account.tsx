import { useState, useEffect } from 'react';
import { Package, MapPin, Heart, User, LogOut } from 'lucide-react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Account = () => {
  const { user, profile, signOut } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('orders').select('*, order_items(*)').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setOrders(data || []));
    supabase.from('addresses').select('*').eq('user_id', user.id).then(({ data }) => setAddresses(data || []));
    supabase.from('wishlists').select('*, products(name, slug, price_lkr, price_usd)').eq('user_id', user.id).then(({ data }) => setWishlist(data || []));
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/');
  };

  const tabs = [
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'addresses', label: 'Addresses', icon: MapPin },
    { key: 'wishlist', label: 'Wishlist', icon: Heart },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <StorefrontLayout>
      <div className="container py-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl tracking-[0.15em] mb-2">MY ACCOUNT</h1>
          <p className="text-sm text-muted-foreground tracking-wider mb-10">
            Welcome back, {profile?.first_name || user?.email}
          </p>

          <div className="flex gap-2 mb-8 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-[0.15em] border transition-colors whitespace-nowrap ${activeTab === tab.key ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-foreground'}`}>
                <tab.icon className="h-3.5 w-3.5" /> {tab.label.toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm tracking-wider">No orders yet</div>
              ) : orders.map(order => (
                <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-sm tracking-wider">{order.order_number}</span>
                    <span className={`text-xs tracking-wider px-3 py-1 ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : order.status === 'cancelled' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatPrice(order.total_lkr, order.total_usd)} · {new Date(order.created_at).toLocaleDateString()}</p>
                  <div className="mt-3 space-y-1">
                    {order.order_items?.map((item: any) => (
                      <p key={item.id} className="text-xs text-muted-foreground">{item.quantity}x {item.name} — {item.size} / {item.color}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.length === 0 ? (
                <div className="col-span-2 text-center py-16 text-muted-foreground text-sm tracking-wider">No saved addresses</div>
              ) : addresses.map(addr => (
                <div key={addr.id} className="glass-card p-6">
                  <p className="font-display text-sm tracking-wider mb-2">{addr.label?.toUpperCase()} {addr.is_default && <span className="text-primary text-xs ml-2">DEFAULT</span>}</p>
                  <p className="text-sm text-muted-foreground">{addr.first_name} {addr.last_name}</p>
                  <p className="text-sm text-muted-foreground">{addr.address}, {addr.city}</p>
                  <p className="text-sm text-muted-foreground">{addr.postal_code}, {addr.country}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {wishlist.length === 0 ? (
                <div className="col-span-3 text-center py-16 text-muted-foreground text-sm tracking-wider">Your wishlist is empty</div>
              ) : wishlist.map((item: any) => (
                <div key={item.id} className="glass-card p-4">
                  <div className="aspect-[3/4] bg-surface mb-3" />
                  <p className="text-sm tracking-wider">{item.products?.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{formatPrice(item.products?.price_lkr, item.products?.price_usd)}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="glass-card p-6 max-w-md space-y-4">
              <div>
                <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">EMAIL</label>
                <p className="text-sm">{user?.email}</p>
              </div>
              <div>
                <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">NAME</label>
                <p className="text-sm">{profile?.first_name} {profile?.last_name}</p>
              </div>
            </div>
          )}

          <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-8 tracking-wider transition-colors">
            <LogOut className="h-4 w-4" /> SIGN OUT
          </button>
        </motion.div>
      </div>
    </StorefrontLayout>
  );
};

export default Account;
