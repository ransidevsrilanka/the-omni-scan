import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Plus, Tag, Image, Mail, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AdminMarketing = () => {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [subCount, setSubCount] = useState(0);
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountForm, setDiscountForm] = useState({ code: '', type: 'percentage' as const, value: '', min_order: '', max_uses: '', is_active: true });

  const fetch = async () => {
    const { data: d } = await supabase.from('discount_codes').select('*').order('created_at', { ascending: false });
    setDiscounts(d || []);
    const { data: b } = await supabase.from('banners').select('*').order('position');
    setBanners(b || []);
    const { count } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true });
    setSubCount(count || 0);
  };
  useEffect(() => { fetch(); }, []);

  const createDiscount = async () => {
    const { error } = await supabase.from('discount_codes').insert({
      code: discountForm.code.toUpperCase(),
      type: discountForm.type as any,
      value: Number(discountForm.value),
      min_order: discountForm.min_order ? Number(discountForm.min_order) : 0,
      max_uses: discountForm.max_uses ? Number(discountForm.max_uses) : null,
      is_active: discountForm.is_active,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Discount code created');
    setShowDiscount(false); setDiscountForm({ code: '', type: 'percentage', value: '', min_order: '', max_uses: '', is_active: true }); fetch();
  };

  const deleteDiscount = async (id: string) => {
    await supabase.from('discount_codes').delete().eq('id', id);
    toast.success('Deleted'); fetch();
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl tracking-[0.15em] mb-8">MARKETING</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Tag, title: 'DISCOUNT CODES', desc: `${discounts.length} active codes`, action: () => setShowDiscount(true), actionLabel: 'CREATE CODE' },
          { icon: Image, title: 'BANNERS', desc: `${banners.length} active banners`, action: () => {}, actionLabel: 'ADD BANNER' },
          { icon: Mail, title: 'NEWSLETTER', desc: `${subCount} subscribers`, action: () => {}, actionLabel: '' },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-stat p-6 rounded-sm">
            <item.icon className="h-5 w-5 text-primary mb-3" />
            <h3 className="font-display text-sm tracking-[0.15em] mb-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground mb-4">{item.desc}</p>
            {item.actionLabel && (
              <button onClick={item.action} className="text-xs text-primary tracking-wider hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" /> {item.actionLabel}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showDiscount && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDiscount(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="glass-card p-8 w-full max-w-md rounded-sm">
              <h2 className="font-display text-lg tracking-[0.15em] mb-6">NEW DISCOUNT CODE</h2>
              <div className="space-y-4">
                <input placeholder="CODE" value={discountForm.code} onChange={e => setDiscountForm({ ...discountForm, code: e.target.value })} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary uppercase placeholder:text-muted-foreground" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={discountForm.type} onChange={e => setDiscountForm({ ...discountForm, type: e.target.value as any })} className="bg-surface border border-border px-4 py-2.5 text-sm outline-none">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                  <input placeholder="Value" type="number" value={discountForm.value} onChange={e => setDiscountForm({ ...discountForm, value: e.target.value })} className="bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                </div>
                <input placeholder="Min order (optional)" type="number" value={discountForm.min_order} onChange={e => setDiscountForm({ ...discountForm, min_order: e.target.value })} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
                <motion.button whileTap={{ scale: 0.97 }} onClick={createDiscount} className="w-full bg-primary text-primary-foreground py-3 font-display text-sm tracking-[0.2em]">CREATE</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card overflow-hidden rounded-sm">
        <div className="px-4 py-3 border-b border-border bg-surface/50">
          <h2 className="text-xs tracking-[0.15em] text-muted-foreground font-medium">DISCOUNT CODES</h2>
        </div>
        {discounts.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground tracking-wider">No discount codes yet</div>
        ) : (
          <div className="divide-y divide-border/50">
            {discounts.map(d => (
              <div key={d.id} className="flex items-center justify-between px-4 py-3 hover:bg-surface/30 transition-colors">
                <div>
                  <p className="text-sm font-display tracking-wider">{d.code}</p>
                  <p className="text-xs text-muted-foreground">{d.type === 'percentage' ? `${d.value}% off` : `LKR ${d.value} off`} · Used {d.used_count}/{d.max_uses || '∞'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 ${d.is_active ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>{d.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
                  <button onClick={() => deleteDiscount(d.id)} className="p-1 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMarketing;
