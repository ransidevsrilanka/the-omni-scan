import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<any>(null);
  const [form, setForm] = useState({ name: '', slug: '', is_visible: true, position: 0 });

  const fetch = async () => {
    const { data } = await supabase.from('categories').select('*, products(id)').order('position');
    setCategories(data || []);
  };
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (editCat) {
      const { error } = await supabase.from('categories').update({ ...form, slug }).eq('id', editCat.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Category updated');
    } else {
      const { error } = await supabase.from('categories').insert({ ...form, slug, position: categories.length });
      if (error) { toast.error(error.message); return; }
      toast.success('Category created');
    }
    setShowForm(false); setEditCat(null); setForm({ name: '', slug: '', is_visible: true, position: 0 }); fetch();
  };

  const deleteCat = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id);
    toast.success('Category deleted'); fetch();
  };

  const toggleVis = async (id: string, current: boolean) => {
    await supabase.from('categories').update({ is_visible: !current }).eq('id', id); fetch();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-[0.15em]">CATEGORIES</h1>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setShowForm(true); setEditCat(null); setForm({ name: '', slug: '', is_visible: true, position: 0 }); }}
          className="bg-primary text-primary-foreground px-6 py-2.5 text-sm font-display tracking-[0.15em] hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> ADD CATEGORY
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="glass-card p-8 w-full max-w-md rounded-sm">
              <h2 className="font-display text-lg tracking-[0.15em] mb-6">{editCat ? 'EDIT' : 'NEW'} CATEGORY</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">NAME</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_visible} onChange={e => setForm({ ...form, is_visible: e.target.checked })} className="accent-primary" /> Visible on storefront
                </label>
                <div className="flex gap-3 pt-2">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-3 font-display text-sm tracking-[0.2em]">{editCat ? 'UPDATE' : 'CREATE'}</motion.button>
                  <button onClick={() => setShowForm(false)} className="px-6 py-3 border border-border text-sm tracking-wider">CANCEL</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {categories.length === 0 ? (
          <div className="glass-card p-6 text-center text-sm text-muted-foreground tracking-wider py-12 rounded-sm">No categories yet</div>
        ) : categories.map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card flex items-center justify-between p-4 rounded-sm">
            <div className="flex items-center gap-4">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <div>
                <p className="text-sm tracking-wider">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.products?.length || 0} products · /{cat.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditCat(cat); setForm({ name: cat.name, slug: cat.slug, is_visible: cat.is_visible, position: cat.position }); setShowForm(true); }} className="p-1.5 hover:text-primary"><Edit className="h-3.5 w-3.5" /></button>
              <button onClick={() => toggleVis(cat.id, cat.is_visible)} className="p-1.5 hover:text-primary">{cat.is_visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>
              <button onClick={() => deleteCat(cat.id)} className="p-1.5 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
