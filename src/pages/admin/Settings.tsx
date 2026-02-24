import AdminLayout from '@/components/layout/AdminLayout';
import { Save } from 'lucide-react';

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-[0.15em]">SETTINGS</h1>
        <button className="bg-primary text-primary-foreground px-6 py-2.5 text-sm font-display tracking-[0.15em] hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Save className="h-4 w-4" /> SAVE CHANGES
        </button>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Store Settings */}
        <div className="bg-card border border-border p-6">
          <h2 className="font-display text-sm tracking-[0.15em] mb-6">STORE INFORMATION</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">STORE NAME</label>
              <input defaultValue="Island Couture" className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">CONTACT EMAIL</label>
              <input placeholder="hello@islandcouture.com" className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">PHONE</label>
              <input placeholder="+94 XX XXX XXXX" className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-card border border-border p-6">
          <h2 className="font-display text-sm tracking-[0.15em] mb-6">SHIPPING RATES</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">STANDARD SHIPPING (LKR)</label>
              <input placeholder="350" className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">FREE SHIPPING THRESHOLD (LKR)</label>
              <input placeholder="15000" className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-card border border-border p-6">
          <h2 className="font-display text-sm tracking-[0.15em] mb-6">PAYMENT GATEWAY — PAYHERE</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">MERCHANT ID</label>
              <input placeholder="Enter your PayHere Merchant ID" className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">MODE</label>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-xs tracking-wider border border-primary text-primary">SANDBOX</button>
                <button className="px-4 py-2 text-xs tracking-wider border border-border text-muted-foreground hover:border-foreground">LIVE</button>
              </div>
            </div>
          </div>
        </div>

        {/* Tax */}
        <div className="bg-card border border-border p-6">
          <h2 className="font-display text-sm tracking-[0.15em] mb-6">TAX SETTINGS</h2>
          <div>
            <label className="text-xs tracking-[0.15em] text-muted-foreground block mb-2">TAX RATE (%)</label>
            <input placeholder="0" className="w-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
