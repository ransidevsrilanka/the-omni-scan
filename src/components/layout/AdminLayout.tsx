import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, UserPlus,
  Megaphone, DollarSign, Settings, Menu, X, LogOut, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Team', href: '/admin/team', icon: UserPlus },
  { label: 'Marketing', href: '/admin/marketing', icon: Megaphone },
  { label: 'Budget & Billing', href: '/admin/budget', icon: DollarSign },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/admin" className="font-display text-lg tracking-[0.2em] text-sidebar-foreground">
          {collapsed ? 'IC' : 'ISLAND COUTURE'}
        </Link>
        <p className={cn("text-xs text-muted-foreground mt-1", collapsed && "hidden")}>Admin Panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((link, i) => {
          const isActive = location.pathname === link.href;
          return (
            <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <Link
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:translate-x-1"
                )}
              >
                <link.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="tracking-wider">{link.label}</span>}
              </Link>
            </motion.div>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
          <ChevronRight className="h-4 w-4" />
          {!collapsed && <span className="tracking-wider">View Store</span>}
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors w-full">
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="tracking-wider">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar z-50 lg:hidden border-r border-sidebar-border">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></button>
              <button className="hidden lg:block" onClick={() => setCollapsed(!collapsed)}><Menu className="h-5 w-5" /></button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground tracking-wider hidden sm:block">{profile?.first_name || 'Admin'}</span>
              <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm font-display">
                {profile?.first_name?.[0] || 'A'}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
