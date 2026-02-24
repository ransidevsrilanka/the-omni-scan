import AdminLayout from '@/components/layout/AdminLayout';
import { Plus, Tag, Image, Mail } from 'lucide-react';

const AdminMarketing = () => {
  return (
    <AdminLayout>
      <h1 className="font-display text-2xl tracking-[0.15em] mb-8">MARKETING</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border p-6">
          <Tag className="h-5 w-5 text-primary mb-3" />
          <h3 className="font-display text-sm tracking-[0.15em] mb-1">DISCOUNT CODES</h3>
          <p className="text-xs text-muted-foreground mb-4">Create and manage promotional codes</p>
          <button className="text-xs text-primary tracking-wider hover:underline flex items-center gap-1">
            <Plus className="h-3 w-3" /> CREATE CODE
          </button>
        </div>
        <div className="bg-card border border-border p-6">
          <Image className="h-5 w-5 text-primary mb-3" />
          <h3 className="font-display text-sm tracking-[0.15em] mb-1">BANNERS</h3>
          <p className="text-xs text-muted-foreground mb-4">Manage homepage hero banners</p>
          <button className="text-xs text-primary tracking-wider hover:underline flex items-center gap-1">
            <Plus className="h-3 w-3" /> ADD BANNER
          </button>
        </div>
        <div className="bg-card border border-border p-6">
          <Mail className="h-5 w-5 text-primary mb-3" />
          <h3 className="font-display text-sm tracking-[0.15em] mb-1">NEWSLETTER</h3>
          <p className="text-xs text-muted-foreground mb-4">View subscriber list</p>
          <p className="text-2xl font-display">0 <span className="text-xs text-muted-foreground">subscribers</span></p>
        </div>
      </div>

      {/* Discount codes table */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-surface">
          <h2 className="text-xs tracking-[0.15em] text-muted-foreground font-medium">ACTIVE DISCOUNT CODES</h2>
        </div>
        <div className="px-4 py-12 text-center text-sm text-muted-foreground tracking-wider">
          No discount codes yet
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMarketing;
