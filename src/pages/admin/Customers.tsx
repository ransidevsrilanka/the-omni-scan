import AdminLayout from '@/components/layout/AdminLayout';
import { Search } from 'lucide-react';

const AdminCustomers = () => {
  return (
    <AdminLayout>
      <h1 className="font-display text-2xl tracking-[0.15em] mb-8">CUSTOMERS</h1>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input placeholder="Search customers..." className="w-full bg-surface border border-border pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
      </div>

      <div className="bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">CUSTOMER</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">EMAIL</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">ORDERS</th>
              <th className="text-left px-4 py-3 text-xs tracking-[0.15em] text-muted-foreground font-medium">TOTAL SPENT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground tracking-wider">
                No customers yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
