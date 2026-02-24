import AdminLayout from '@/components/layout/AdminLayout';
import { Search } from 'lucide-react';

const statusFilters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  return (
    <AdminLayout>
      <h1 className="font-display text-2xl tracking-[0.15em] mb-8">ORDERS</h1>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {statusFilters.map(status => (
          <button
            key={status}
            className={`px-4 py-2 text-xs tracking-[0.15em] border transition-colors ${status === 'All' ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-foreground'}`}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">ORDER</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">CUSTOMER</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">TOTAL</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">STATUS</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">DATE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground tracking-wider">
                No orders yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
