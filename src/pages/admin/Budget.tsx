import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminBudget = () => {
  const [stats, setStats] = useState({ revenue: 0, expenses: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data: orders } = await supabase.from('orders').select('total_lkr, created_at').eq('payment_status', 'paid');
      const revenue = (orders || []).reduce((s, o) => s + Number(o.total_lkr || 0), 0);
      setStats({ revenue, expenses: 0 });

      // Monthly chart
      const months: Record<string, number> = {};
      (orders || []).forEach(o => {
        const m = o.created_at?.slice(0, 7);
        if (m) months[m] = (months[m] || 0) + Number(o.total_lkr || 0);
      });
      setChartData(Object.entries(months).map(([month, rev]) => ({ month: month.slice(5), revenue: rev })));
    };
    fetch();
  }, []);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-[0.15em]">BUDGET & BILLING</h1>
        <motion.button whileTap={{ scale: 0.95 }} className="border border-border px-6 py-2.5 text-sm font-display tracking-[0.15em] hover:border-foreground transition-colors flex items-center gap-2">
          <Download className="h-4 w-4" /> EXPORT CSV
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: TrendingUp, label: 'TOTAL REVENUE', value: `LKR ${stats.revenue.toLocaleString()}`, color: 'text-primary' },
          { icon: TrendingDown, label: 'TOTAL EXPENSES', value: `LKR ${stats.expenses.toLocaleString()}`, color: 'text-destructive' },
          { icon: DollarSign, label: 'NET PROFIT', value: `LKR ${(stats.revenue - stats.expenses).toLocaleString()}`, color: 'text-primary' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-stat p-6 rounded-sm">
            <item.icon className={`h-5 w-5 ${item.color} mb-3`} />
            <p className="text-xs text-muted-foreground tracking-wider mb-1">{item.label}</p>
            <p className="font-display text-2xl">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 mb-4 rounded-sm">
        <h2 className="font-display text-sm tracking-[0.15em] mb-4">REVENUE CHART</h2>
        <div className="h-48">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 16%)" />
                <XAxis dataKey="month" stroke="hsl(0, 0%, 40%)" fontSize={11} />
                <YAxis stroke="hsl(0, 0%, 40%)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(0, 0%, 6%)', border: '1px solid hsl(0, 0%, 16%)', color: 'hsl(0, 0%, 96%)' }} />
                <Bar dataKey="revenue" fill="hsl(43, 74%, 49%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm tracking-wider">No revenue data yet</div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminBudget;
