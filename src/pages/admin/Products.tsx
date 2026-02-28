import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Plus, Search, MoreHorizontal, Eye, EyeOff, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const { formatPrice } = useCurrency();

  const [form, setForm] = useState({
    name: '', slug: '', description: '', materials: '', care: '',
    price_lkr: '', price_usd: '', category_id: '', is_visible: true, is_featured: false,
  });

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*, categories(name), product_variants(stock)').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('position');
    setCategories(data || []);
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const handleSave = async () => {
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const payload = { ...form, slug, price_lkr: Number(form.price_lkr), price_usd: Number(form.price_usd), category_id: form.category_id || null };
    
    if (editProduct) {
      const { error } = await supabase.from('products').update(payload).eq('id', editProduct.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Product updated');
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Product created');
    }
    setShowForm(false); setEditProduct(null);
    setForm({ name: '', slug: '', description: '', materials: '', care: '', price_lkr: '', price_usd: '', category_id: '', is_visible: true, is_featured: false });
    fetchProducts();
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_visible: !current }).eq('id', id);
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    toast.success('Product deleted');
    fetchProducts();
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const totalStock = (p: any) => (p.product_variants || []).reduce((s: number, v: any) => s + (v.stock || 0), 0);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-xl sm:text-2xl tracking-[0.15em]">PRODUCTS</h1>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setShowForm(true); setEditProduct(null); setForm({ name: '', slug: '', description: '', materials: '', care: '', price_lkr: '', price_usd: '', category_id: '', is_visible: true, is_featured: false }); }}
          className="bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-display tracking-[0.15em] hover:bg-primary/90 transition-colors flex items-center gap-2 w-fit">
          <Plus className="h-4 w-4" /> ADD PRODUCT
        </motion.button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="glass-card p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm">
              <h2 className="font-display text-lg tracking-[0.15em] mb-6">{editProduct ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">NAME</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">CATEGORY</label>
                    <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary">
                      <option value="">No category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">DESCRIPTION</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">PRICE (LKR)</label>
                    <input type="number" value={form.price_lkr} onChange={e => setForm({ ...form, price_lkr: e.target.value })} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">PRICE (USD)</label>
                    <input type="number" value={form.price_usd} onChange={e => setForm({ ...form, price_usd: e.target.value })} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">MATERIALS</label>
                    <input value={form.materials} onChange={e => setForm({ ...form, materials: e.target.value })} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">CARE</label>
                    <input value={form.care} onChange={e => setForm({ ...form, care: e.target.value })} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.is_visible} onChange={e => setForm({ ...form, is_visible: e.target.checked })} className="accent-primary" /> Visible
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="accent-primary" /> Featured
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-3 font-display text-sm tracking-[0.2em] hover:bg-primary/90">
                    {editProduct ? 'UPDATE' : 'CREATE'}
                  </motion.button>
                  <button onClick={() => setShowForm(false)} className="px-6 py-3 border border-border text-sm tracking-wider hover:border-foreground">CANCEL</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-surface border border-border pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">PRODUCT</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">CATEGORY</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">PRICE</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">STOCK</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">STATUS</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground tracking-wider">No products found</td></tr>
            ) : filtered.map((p, i) => (
              <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="tracking-wider">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.categories?.name || '—'}</td>
                <td className="px-4 py-3">{formatPrice(p.price_lkr, p.price_usd)}</td>
                <td className="px-4 py-3">{totalStock(p)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs tracking-wider px-2 py-1 ${p.is_visible ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                    {p.is_visible ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditProduct(p); setForm({ name: p.name, slug: p.slug, description: p.description || '', materials: p.materials || '', care: p.care || '', price_lkr: String(p.price_lkr), price_usd: String(p.price_usd), category_id: p.category_id || '', is_visible: p.is_visible, is_featured: p.is_featured }); setShowForm(true); }} className="p-1.5 hover:text-primary"><Edit className="h-3.5 w-3.5" /></button>
                    <button onClick={() => toggleVisibility(p.id, p.is_visible)} className="p-1.5 hover:text-primary">{p.is_visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>
                    <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
