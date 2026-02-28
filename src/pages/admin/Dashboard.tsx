import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { TrendingUp, ShoppingCart, Users, DollarSign, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, ordersToday: 0, pendingOrders: 0, totalCustomers: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split('T')[0];

      const [ordersRes, profilesRes, pendingRes, variantsRes] = await Promise.all([
        supabase.from('orders').select('total_lkr, total_usd, created_at, status'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('product_variants').select('*, products(name)').lt('stock', 10).order('stock'),
      ]);

      const orders = ordersRes.data || [];
      const revenue = orders.reduce((sum, o) => sum + Number(o.total_lkr || 0), 0);
      const ordersToday = orders.filter(o => o.created_at?.startsWith(today)).length;

      setStats({
        revenue,
        ordersToday,
        pendingOrders: pendingRes.count || 0,
        totalCustomers: profilesRes.count || 0,
      });

      setLowStock((variantsRes.data || []).slice(0, 5));

      // Recent orders
      const { data: recent } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5);
      setRecentOrders(recent || []);

      // Chart: last 7 days
      const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });
      const chart = last7.map(date => ({
        date: date.slice(5),
        revenue: orders.filter(o => o.created_at?.startsWith(date)).reduce((s, o) => s + Number(o.total_lkr || 0), 0),
      }));
      setChartData(chart);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `LKR ${stats.revenue.toLocaleString()}`, icon: DollarSign, change: '+12%' },
    { label: 'Orders Today', value: String(stats.ordersToday), icon: ShoppingCart, change: `${stats.ordersToday}` },
    { label: 'Pending Orders', value: String(stats.pendingOrders), icon: AlertTriangle, change: String(stats.pendingOrders) },
    { label: 'Total Customers', value: String(stats.totalCustomers), icon: Users, change: `+${stats.totalCustomers}` },
  ];

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl tracking-[0.15em] mb-8">DASHBOARD</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass-stat p-6 rounded-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-sm bg-primary/10 flex items-center justify-center">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-primary tracking-wider flex items-center gap-1">
                {card.change} <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="font-display text-2xl tracking-wider mb-1">{card.value}</p>
            <p className="text-xs text-muted-foreground tracking-wider">{card.label.toUpperCase()}</p>
          </motion.div>
        ))}
      </div>

      {/* Sales Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 mb-8 rounded-sm">
        <h2 className="font-display text-sm tracking-[0.15em] mb-6">SALES OVERVIEW — LAST 7 DAYS</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 16%)" />
              <XAxis dataKey="date" stroke="hsl(0, 0%, 40%)" fontSize={11} />
              <YAxis stroke="hsl(0, 0%, 40%)" fontSize={11} />
              <Tooltip contentStyle={{ background: 'hsl(0, 0%, 6%)', border: '1px solid hsl(0, 0%, 16%)', borderRadius: '2px', color: 'hsl(0, 0%, 96%)' }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(43, 74%, 49%)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 rounded-sm">
          <h2 className="font-display text-sm tracking-[0.15em] mb-4">RECENT ORDERS</h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground tracking-wider">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm tracking-wider">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">{(order.shipping_address as any)?.firstName} {(order.shipping_address as any)?.lastName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatPrice(order.total_lkr, order.total_usd)}</p>
                    <span className={`text-[10px] tracking-wider px-2 py-0.5 ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : order.status === 'cancelled' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Low Stock */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6 rounded-sm">
          <h2 className="font-display text-sm tracking-[0.15em] mb-4">LOW STOCK ALERTS</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground tracking-wider">All products are well-stocked</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map(v => (
                <div key={v.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm tracking-wider">{(v as any).products?.name}</p>
                    <p className="text-xs text-muted-foreground">{v.size} / {v.color}</p>
                  </div>
                  <span className={`text-sm font-display ${v.stock <= 5 ? 'text-destructive' : 'text-primary'}`}>{v.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
