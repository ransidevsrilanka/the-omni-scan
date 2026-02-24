import AdminLayout from '@/components/layout/AdminLayout';
import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const AdminBudget = () => {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-[0.15em]">BUDGET & BILLING</h1>
        <button className="border border-border px-6 py-2.5 text-sm font-display tracking-[0.15em] hover:border-foreground transition-colors flex items-center gap-2">
          <Download className="h-4 w-4" /> EXPORT CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border p-6">
          <TrendingUp className="h-5 w-5 text-primary mb-3" />
          <p className="text-xs text-muted-foreground tracking-wider mb-1">TOTAL REVENUE</p>
          <p className="font-display text-2xl">LKR 0</p>
        </div>
        <div className="bg-card border border-border p-6">
          <TrendingDown className="h-5 w-5 text-destructive mb-3" />
          <p className="text-xs text-muted-foreground tracking-wider mb-1">TOTAL EXPENSES</p>
          <p className="font-display text-2xl">LKR 0</p>
        </div>
        <div className="bg-card border border-border p-6">
          <DollarSign className="h-5 w-5 text-primary mb-3" />
          <p className="text-xs text-muted-foreground tracking-wider mb-1">NET PROFIT</p>
          <p className="font-display text-2xl">LKR 0</p>
        </div>
      </div>

      <div className="bg-card border border-border p-6 mb-4">
        <h2 className="font-display text-sm tracking-[0.15em] mb-4">REVENUE CHART</h2>
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm tracking-wider">
          Chart data will appear here
        </div>
      </div>

      <div className="bg-card border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-surface">
          <h2 className="text-xs tracking-[0.15em] text-muted-foreground font-medium">TRANSACTION HISTORY</h2>
        </div>
        <div className="px-4 py-12 text-center text-sm text-muted-foreground tracking-wider">
          No transactions yet
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBudget;
