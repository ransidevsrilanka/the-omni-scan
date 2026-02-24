import AdminLayout from '@/components/layout/AdminLayout';
import { Plus, Search, MoreHorizontal } from 'lucide-react';

const AdminProducts = () => {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-[0.15em]">PRODUCTS</h1>
        <button className="bg-primary text-primary-foreground px-6 py-2.5 text-sm font-display tracking-[0.15em] hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> ADD PRODUCT
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input placeholder="Search products..." className="w-full bg-surface border border-border pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
        </div>
      </div>

      <div className="bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">PRODUCT</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">PRICE</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">STOCK</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">STATUS</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground tracking-wider">
                No products yet. Add your first product to get started.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
