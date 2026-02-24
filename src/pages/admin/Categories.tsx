import AdminLayout from '@/components/layout/AdminLayout';
import { Plus } from 'lucide-react';

const AdminCategories = () => {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-[0.15em]">CATEGORIES</h1>
        <button className="bg-primary text-primary-foreground px-6 py-2.5 text-sm font-display tracking-[0.15em] hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> ADD CATEGORY
        </button>
      </div>

      <div className="bg-card border border-border p-6">
        <p className="text-sm text-muted-foreground tracking-wider text-center py-12">
          No categories yet. Create your first category to organize your products.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
