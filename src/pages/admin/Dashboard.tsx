import AdminLayout from '@/components/layout/AdminLayout';
import { TrendingUp, ShoppingCart, Users, DollarSign, AlertTriangle } from 'lucide-react';

const statCards = [
  { label: 'Total Revenue', value: 'LKR 0', icon: DollarSign, change: '+0%' },
  { label: 'Orders Today', value: '0', icon: ShoppingCart, change: '+0%' },
  { label: 'Pending Orders', value: '0', icon: AlertTriangle, change: '0' },
  { label: 'Total Customers', value: '0', icon: Users, change: '+0%' },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1 className="font-display text-2xl tracking-[0.15em] mb-8">DASHBOARD</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.label} className="bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <card.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-primary tracking-wider">{card.change}</span>
            </div>
            <p className="font-display text-2xl tracking-wider mb-1">{card.value}</p>
            <p className="text-xs text-muted-foreground tracking-wider">{card.label.toUpperCase()}</p>
          </div>
        ))}
      </div>

      {/* Sales Chart placeholder */}
      <div className="bg-card border border-border p-6 mb-8">
        <h2 className="font-display text-sm tracking-[0.15em] mb-6">SALES OVERVIEW</h2>
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm tracking-wider">
          <TrendingUp className="h-8 w-8 mr-3" /> Chart data will appear here
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-card border border-border p-6">
          <h2 className="font-display text-sm tracking-[0.15em] mb-4">RECENT ORDERS</h2>
          <p className="text-sm text-muted-foreground tracking-wider">No orders yet</p>
        </div>
        {/* Low Stock */}
        <div className="bg-card border border-border p-6">
          <h2 className="font-display text-sm tracking-[0.15em] mb-4">LOW STOCK ALERTS</h2>
          <p className="text-sm text-muted-foreground tracking-wider">All products are well-stocked</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
