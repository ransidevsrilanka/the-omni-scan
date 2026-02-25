import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { motion } from 'framer-motion';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('profiles').select('*, orders(total_lkr)');
      setCustomers(data || []);
    };
    fetch();
  }, []);

  const filtered = customers.filter(c =>
    `${c.first_name} ${c.last_name} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl tracking-[0.15em] mb-8">CUSTOMERS</h1>
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-surface border border-border pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
      </div>

      <div className="glass-card overflow-hidden rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">CUSTOMER</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">PHONE</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">ORDERS</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">TOTAL SPENT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground tracking-wider">No customers yet</td></tr>
            ) : filtered.map((c, i) => (
              <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="tracking-wider">{c.first_name} {c.last_name}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone || '—'}</td>
                <td className="px-4 py-3">{c.orders?.length || 0}</td>
                <td className="px-4 py-3">LKR {(c.orders || []).reduce((s: number, o: any) => s + Number(o.total_lkr || 0), 0).toLocaleString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
